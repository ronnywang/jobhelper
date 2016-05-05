var get_company_info = function(){
    var params = {};
    params.link = document.location.href;

    if ('www.104.com.tw' == document.location.hostname) {
	// 有 jQuery 可以用
	var company_dom = jQuery('#comp_header li.comp_name p a', document);
	if (company_dom.length != 0) {
	    params.from = '104';
	    params.name = company_dom.eq(0).text();
	    params.company_link = company_dom.eq(0).attr('href');
	    return params;
	}

	company_dom = jQuery('#comp_header li.comp_name h1', document);
	if (company_dom.length != 0) {
	    params.from = '104';
	    params.name = company_dom.text();
	    params.company_link = document.location;
	    return params;
	}

    // http://www.104.com.tw/job/?jobno=3lluq&jobsource=n104bank1
	company_dom = jQuery('span.company a:first', document);
	if (company_dom.length != 0) {
	    params.from = '104';
	    params.name = company_dom.eq(0).text();
	    params.company_link = company_dom.eq(0).attr('href');
	    return params;
	}

	// 104i
	if (document.location.pathname.match('\/104i\/')) {
	    // 單一公司頁，只有一個 <h1>, Ex: http://www.104.com.tw/jb/104i/cust/view?c=5e3a43255e363e2048323c1d1d1d1d5f2443a363189j01
	    if (document.location.pathname.match('/cust/view')) {
		var h1_dom = jQuery('#mainHeader h1.h1');
		if (h1_dom.length == 1) {
		    params.from = '104';
		    params.name = h1_dom.text();
		    return params;
		}
	    }

	    // 工作頁
	    if (document.location.pathname.match('/job/view')) {
		var a_doms = $('#mainHeader a', document);
		var a_dom;
		for (var i = 0; i < a_doms.length; i ++) {
		    a_dom = a_doms.eq(i);
		    if (!a_dom.attr('href') || !a_dom.attr('href').match(/view\?c=/)) {
			continue;
		    }
		    if (params.company_link && params.company_link != a_dom.attr('href')) {
			// 有兩家不一樣的公司，跳過
			return;
		    }
		    params.company_link = a_dom.attr('href');
		    params.name = a_dom.text();
		    params.from = '104';
		}
	    }

	    return params;
	}
	
	return;
    } else if ('www.taiwanjobs.gov.tw' == document.location.hostname) {
	var company_dom = jQuery('#divcontent span:first',document);
	if (company_dom.length != 0) {
	    params.from = 'ejob';
	    params.name = company_dom.text().trim();
	    return params;
	}
    } else if ('www.104temp.com.tw' == document.location.hostname) {
	// 檢查所有 a dom, 如果 company_intro.jsp 開頭的不超過兩個不一樣的，就確定是這家公司了
	var a_doms = $('a', document);
	var a_dom;
	for (var i = 0; i < a_doms.length; i ++) {
	    a_dom = a_doms.eq(i);
	    if (!a_dom.attr('href') || !a_dom.attr('href').match(/^company_intro\.jsp/)) {
		continue;
	    }
	    if (params.company_link && params.company_link != a_dom.attr('href')) {
		// 有兩家不一樣的公司，跳過
		return;
	    }
	    params.company_link = a_dom.attr('href');
	    params.name = a_dom.text();
	    params.from = '104temp';
	}

	return params;
    } else if ('www.yes123.com.tw' == document.location.hostname||'yes123.com.tw' == document.location.hostname) {
	if (!jQuery('.comp_name').length) {
            // 處理小而美企業頁面
            if (jQuery('.dtitle').length == 1 && document.location.href.match('small_corp')) {
                params.from = 'yes123';
                params.name = jQuery('.dtitle').text();
                return params;
            }
	    return;
	}
	var matches = document.location.search.match(/p_id=([^&]*)/);
	if (!matches) {
	    return;
	}

	params.from = 'yes123';
	params.name = jQuery('.jobname_title a').text();
	params.company_link = matches[1];
    } else if ('www.1111.com.tw' == document.location.hostname) {
	var found = false;

        // check HTML   <li><a href="/job-bank/company-description.asp?nNo=2765266"></a></li>
        jQuery('#commonTop li a').each(function(){
            var href = $(this).attr('href');
            if ('string' == typeof(href) && href.match('/job-bank/company-description\.asp\\?nNo=[^&]*')) {
                params.from = '1111';
		params.name = $(this).text();
		params.company_link = $(this).attr('href');
		found = true;
		return false;
            }
        });
	if (found) {
	    return params;
	}

        if ('object' === typeof(vizLayer) && 'string' === typeof(vizLayer.catname)) {
            params.from = '1111';
            params.name = vizLayer.catname;
            params.company_link = '#';
            return params;
        }
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
	if (found) {
	    return params;
	}

	jQuery('div.path a').each(function(){
	    var self = $(this);

	    if (self.attr('href').match(/找工作機會/)) {
		params.from = '1111';
		params.name = self.text();
		params.company_link = self.attr('href');
		found = true;
		return false;
	    }
	});
	if (found) {
	    return params;
	}

        var decoded_url = decodeURIComponent(document.location.href);
        // 網址中有「找工作」和「找工作機會」都可以
        if (decoded_url.match('http://www.1111.com.tw/.*-找工作(機會)?-[0-9]*\.htm')) {
            var h1_doms = jQuery('h1');
            if (h1_doms.length == 1) {
                params.from = '1111';
                params.name = h1_doms.text();
                return params;
            }
        }

        return;
    } else if ('www.518.com.tw' == document.location.hostname) {
        if (jQuery('.company-info h3 a').length) {
            var dom = $('.company-info h3 a');
            params.from = '518';
            params.name = dom.text();
            return params;
        }

        if (jQuery('#company-title').length) {
            if (jQuery('#company-title .comp-name').length == 1) {
                params.from = '518';
                params.name = jQuery('#company-title .comp-name').text();
                return params;
            }
            if (jQuery('#company-title .sTrong').length == 1) {
                params.from = '518';
                params.name = jQuery('#company-title .sTrong')[0].childNodes[0].nodeValue.replace(' ', '');
                return params;
            }
            params.from = '518';
            params.name = jQuery('#company-title').text().replace('所有工作機會»', '').replace(' ', '');
            params.company_link = document.location.href;
            return params;
        }

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
    chrome.extension.sendRequest({method: 'page'}, function(response){});

    var params = get_company_info();

    if ('object' == typeof(params) && 'undefined' !== typeof(params.name)) {
        search_package_by_name_api(params.name, params.link, function(package_id, rows){
            get_package_info(function(package_info){
                chrome.extension.sendRequest({method: 'add_match', rows: rows, package_info: get_package_info_by_id(package_info, package_id)}, function(response) {});
            });
        }, function(error_message){
            search_package_by_name(params.name, function(package_id, rows){
                get_package_info(function(package_info){
                    chrome.extension.sendRequest({method: 'add_match', rows: rows, package_info: get_package_info_by_id(package_info, package_id)}, function(response) {});
                });
            }, check_name);
        });
    }
};

main();
