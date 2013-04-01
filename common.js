var _choosed_packages = null;

var update_choosed_packages = function(choosed_packages){
    chrome.storage.local.set({choosed_packages: choosed_packages});
};

var get_choosed_packages = function(cb){
    chrome.storage.local.get({choosed_packages: {}}, function(items){
        get_package_info(function(package_info){
            var choosed_packages = {};
            var current_package = null;
            for (var i = 0; i < package_info.packages.length; i ++) {
                current_package = package_info.packages[i];
                if ('undefined' === typeof(items.choosed_packages[current_package.id])) {
                    if (current_package) {
                        choosed_packages[current_package.id] = true;
                    }
                } else if (false === items.choosed_packages[current_package.id]) {
                } else {
                    choosed_packages[current_package.id] = true;
                }
            }
            cb(choosed_packages);
        });
    });
};

var get_package_info = function(cb){
    chrome.storage.local.get({packages: {}}, function(items){
        if ('undefined' === typeof(items.packages.fetch_at) || ((new Date()).getTime() - items.packages.fetch_at) > 86400 * 1000) {
            update_packages(cb);
            return;
        }

        cb(items.packages);
    });
};

var update_packages = function(cb){
    $.get('http://jobhelper.g0v.ronny.tw/api/getpackages', function(ret){
        ret.fetch_at = (new Date()).getTime();
        chrome.storage.local.set({packages: ret}, function(){
            cb(ret);
        });
    }, 'json');
};

var _package_csv = null;

var get_package_csv_from_storage = function(cb){
    if (null !== _package_csv) {
        cb(_package_csv);
    }
    chrome.storage.local.get({package_csv: {}}, function(items){
        _package_csv = items.package_csv;
        cb(_package_csv);
    });
};
var get_package_info_by_id = function(package_info, id){
    for (var i = 0; i < package_info.packages.length; i ++) {
       if (package_info.packages[i].id == id) { 
           return package_info.packages[i];
       }
    }
    return null;
};

var get_package_csv_by_id = function(id, cb){
    get_package_info(function(package_info){
        get_package_csv_from_storage(function(package_csv){
            if ('undefined' !== typeof(package_csv[id]) && package_csv[id].package_time == get_package_info_by_id(package_info, id).package_time) {
                cb(package_csv[id].content);
                return;
            }
            $.get('http://jobhelper.g0v.ronny.tw/api/getpackage?id=' + parseInt(id), function(package_csv){
                _package_csv[id] = package_csv;
                cb(_package_csv[id].content);
            });
        });
    });
};

var check_name = function(web_name, db_name){
    if ('string' !== typeof(db_name)) {
        return false;
    }
    // 先比對一次
    if (web_name.indexOf(db_name) >= 0) {
        return true;
    }

    // 如果不是 "公司" 結尾的(Ex: 宏達國際電子股份有限公司桃園廠), 只判斷到公司
    if (db_name.match('公司') && !db_name.match('公司$')) {
        if (web_name.indexOf(db_name.match('(^.*公司)')[1]) >= 0) {
            return true;
        }
    }

    // 處理 "吳美玉(即玉皇手作茶飲店)" 格式
    if (db_name.match('.*\\(即.*\\)')) {
        if (web_name.indexOf(db_name.match('.*\\(即(.*)\\)')[1]) >= 0) {
            return true;
        }
    }
    return false;
};
