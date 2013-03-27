var storage = chrome.storage.local;
var choosed_packages = {};

var update_packages = function(){
    $.get('http://jobhelper.g0v.ronny.tw/api/getpackages', function(ret){
	ret.fetch_at = (new Date()).getTime();
	storage.set({packages: ret});
	show_packages(ret);
    }, 'json');
};

// 從 storage 中取得 packages 清單
storage.get({packages: {}, choosed_packages: {}}, function(items){
        choosed_packages = items.choosed_packages;
    if ('undefined' === typeof(items.packages) || 'undefined' === typeof(items.packages.fetch_at) || ((new Date()).getTime() - items.packages.fetch_at) > 86400 * 1000) {
	update_packages();
    } else {
	show_packages(items.packages);
    }
});

var show_packages = function(packages){
    $('#package-list').html('');
    for (var i = 0; i < packages.packages.length; i ++) {
	var li_dom = $($('#li-tmpl').html());
	$('input:checkbox', li_dom).attr('value', packages.packages[i].id);
        if ('undefined' !== typeof(choosed_packages[packages.packages[i].id])) {
            $('input:checkbox', li_dom).prop('checked', true);
        }
	$('.package_name', li_dom).text(packages.packages[i].name);
	$('#package-list').append(li_dom);
    }
    var fetch_at = new Date();
    fetch_at.setTime(packages.fetch_at);
    $('#package-fetch-at').text('' + fetch_at);
}

$('#fetch-package-btn').click(function(){
    update_packages();
});

$('#package-list').on('change', 'li input:checkbox', function(){
    var self = $(this);
    if (self.is(':checked')) {
        choosed_packages[self.attr('value')] = true;
    } else {
        delete(choosed_packages[self.attr('value')]);
    }
    storage.set({choosed_packages: choosed_packages});
});
