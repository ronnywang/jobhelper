var package_info = null;
var _choosed_packages = null;

var update_choosed_packages = function(choosed_packages){
    _choosed_packages = choosed_packages;
    chrome.storage.local.set({choosed_packages: choosed_packages});
};

var get_choosed_packages = function(cb){
    if (null !== _choosed_packages) {
        cb(_choosed_packages);
    } 
    chrome.storage.local.get({choosed_packages: {}}, function(items){
        _choosed_packages = items.choosed_packages;
        cb(items.choosed_packages);
    });
};

var get_package_info = function(cb){
    if (null !== package_info) {
        cb(package_info);
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
        storage.set({packages: ret}, function(){
            cb(ret);
        });
    }, 'json');
};
