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
                    // 有指定 default=true 才會變成預設包
                    if (current_package && current_package['default']) {
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
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            let ret = JSON.parse(this.responseText);
            ret.fetch_at = (new Date()).getTime();
            chrome.storage.local.set({packages: ret}, function(){
                cb(ret);
            });
        };
    };
    xhr.open('get', 'https://jobhelper.g0v.ronny.tw/api/getpackages');
    xhr.send('');
};

var _package_csv = null;

var get_package_csv_from_storage = function(cb){
    if (null !== _package_csv) {
        cb(_package_csv);
        return;
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
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    let ret = JSON.parse(this.responseText);
                    _package_csv[id] = package_csv;
                    chrome.storage.local.set({package_csv: _package_csv});
                    cb(_package_csv[id].content);
                };
            };
            xhr.open('get', 'https://jobhelper.g0v.ronny.tw/api/getpackages');
            xhr.send('');
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

    // 處理 高雄市私立新東海老人養護中心
    if (db_name.match('.*私立(.*)')) {
        if (web_name.indexOf(db_name.match('.*私立(.*)')[1]) >= 0) {
            return true;
        }
    }
    return false;
};

var search_package_by_name = function(name, cb, checker){
    get_choosed_packages(function(choosed_packages){
        for (var id in choosed_packages) {
            (function(id){
                get_package_csv_by_id(id, function(package_csv){
                    if ('undefined' == typeof(package_csv)) {
                        return;
                    }
                    var rows;
                    for (var i = 0; i < package_csv.length; i ++) {
                        rows = package_csv[i];
                        if (checker(name, rows[0])) {
                            cb(id, rows);
                        }
                    }
                });
            })(id);
        }
    });
};

var search_package_by_name_api = function(name, url, cb, failed_cb){
    get_choosed_packages(function(choosed_packages){
        var packages = [];
        for (var id in choosed_packages) {
            packages.push(id);
        }
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                let ret = JSON.parse(this.responseText);
                if (ret.error) {
                    failed_cb(ret.message);
                    return;
                }
                var d;
                for (var i = 0; i < ret.data.length; i ++) {
                    d = ret.data[i];
                    cb(d.package_id, [d.name, d.date, d.reason, d.link, d.snapshot]);
                }
            };
        };
        xhr.open('get', 'https://jobhelper.g0v.ronny.tw/api/search?name=' + encodeURIComponent(name) + '&url=' + encodeURIComponent(url) + '&packages=' + encodeURIComponent(packages.join(',')));
        xhr.send('');
    });
};

var htmlspecialchars = function(str){
    var span_dom = document.createElement('span');
    span_dom.innerText = str;
    str = span_dom.innerHTML;
    delete(span_dom);
    return str;
};
