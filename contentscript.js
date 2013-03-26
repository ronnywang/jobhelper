var get_company_info = function(){
    var params = {};
    params.link = document.location.href;

    if ('www.104.com.tw' == document.location.hostname) {
	// 有 jQuery 可以用

	var company_dom = jQuery('#comp_header li.comp_name p a', document);
	if (company_dom.length == 0) {
	    return;
	}
	params.from = '104';
	params.name = company_dom.eq(0).text();
	params.company_link = company_dom.eq(0).attr('href');
    } else if ('www.yes123.com.tw' == document.location.hostname) {
	if (!jQuery('.comp_name').length) {
	    return;
	}
	var matches = document.location.search.match(/p_id=([^&]*)/);
	if (!matches) {
	    return;
	}

	params.from = 'yes123';
	params.name = jQuery('.comp_name').text();
	params.company_link = matches[1];
    } else if ('www.1111.com.tw' == document.location.hostname) {
	var found = false;
	jQuery('#breadcrumb li a').each(function(){
	    var self = $(this);

	    if (self.attr('href').match(/找工作機會/)) {
		params.from = '1111';
		params.name = self.text();
		params.company_link = self.attr('href');
		found = true;
		return false;
	    }
	});
	if (!found) {
	    return;
	}
    } else if ('www.518.com.tw' == document.location.hostname) {
	if (!jQuery('.company-info h2 a').length) {
	    return;
	}

	var dom = jQuery('.company-info h2 a');
	params.from = '518';
	params.name = dom.text();
	params.company_link = dom.attr('href');
    } else {
	return;
    }

    return params;
};

var main = function(){
    // TODO: 只有特定網站才要 sendRequest 來顯示 page action
    chrome.extension.sendRequest({}, function(response){});
};

main();
