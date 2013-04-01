var _package_info = null;
var _choosed_packages = null;

var update_choosed_packages = function(choosed_packages){
    _choosed_packages = choosed_packages;
    chrome.storage.local.set({choosed_packages: choosed_packages});
};

var get_choosed_packages = function(cb){
    if (null !== _choosed_packages) {
        cb(_choosed_packages);
        return;
    } 
    chrome.storage.local.get({choosed_packages: null}, function(items){
	if (null === items.choosed_packages) {
	    get_package_info(function(package_info){
		var choosed_packages = {};
		for (var i = 0; i < package_info.packages.length; i ++) {
		    if (package_info.packages[i].default) {
			choosed_packages[package_info.packages[i].id] = true;
		    }
		}
		update_choosed_packages(choosed_packages);
		cb(choosed_packages);
	    });
	    return;
	}
        _choosed_packages = items.choosed_packages;
        cb(items.choosed_packages);
    });
};

var get_package_info = function(cb){
    if (null !== _package_info) {
        cb(_package_info);
    }

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
