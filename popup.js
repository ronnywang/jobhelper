var storage = chrome.storage.local;

var update_packages = function(){
    $.get('http://jobhelper.g0v.ronny.tw/api/getpackages', function(ret){
	ret.fetch_at = (new Date()).getTime();
	storage.set({packages: ret});
	show_packages(ret);
    }, 'json');
};

// 從 storage 中取得 packages 清單
storage.get('packages', function(items){
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
	$('input:checkbox', li_dom).val(packages.packages[i].package_id);
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
