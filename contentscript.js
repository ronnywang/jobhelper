var get_company_info = function(){
    var params = {};
    params.link = document.location.href;

    if ('www.104.com.tw' == document.location.hostname || '104.com.tw' == document.location.hostname) {
        // 有 jQuery 可以用
        var company_dom = jQuery('#comp_header li.comp_name p a', document);
        if (company_dom.length != 0) {
            params.from = '104-1';
            params.name = company_dom.eq(0).text();
            params.company_link = company_dom.eq(0).attr('href');
            return params;
        }

        company_dom = jQuery('#comp_header li.comp_name h1', document);
        if (company_dom.length != 0) {
            params.from = '104-2';
            params.name = company_dom.text();
            params.company_link = document.location;
            return params;
        }

    // http://www.104.com.tw/job/?jobno=3lluq&jobsource=n104bank1
        company_dom = jQuery('span.company a:first', document);
        if (company_dom.length != 0) {
            params.from = '104-3';
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
                    params.from = '104-4';
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
                    params.from = '104-5';
                }
            }

            return params;
        }
        
        return;
    } else if ('m.104.com.tw' == document.location.hostname) {
        // 有 jQuery 可以用
        if (document.location.pathname.match('\/cust\/')) {
            company_dom = jQuery('header h1.title', document);
            if (company_dom.length != 0) {
                params.from = '104-2';
                params.name = company_dom.text();
                params.company_link = document.location;
                return params;
            }
        }
        
        if (document.location.pathname.match('\/job\/')) {
            // http://m.104.com.tw/job/3lluq
            company_dom = jQuery('h2.company a:first', document);
            if (company_dom.length != 0) {
                params.from = '104-3';
                params.name = company_dom.eq(0).text();
                params.company_link = company_dom.eq(0).attr('href');
                return params;
            }
        }
        
        return;
    } else if ('www.taiwanjobs.gov.tw' == document.location.hostname) {
        var company_dom = jQuery('#divcontent span:first',document);
        if (company_dom.length != 0) {
            params.from = 'ejob-1';
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
            params.from = '104temp-1';
        }

        return params;
    } else if ('www.yes123.com.tw' == document.location.hostname||'yes123.com.tw' == document.location.hostname) {
            // 處理小而美企業頁面
        if (jQuery('.dtitle').length == 1 && document.location.href.match('small_corp')) {
            params.from = 'yes123-1';
            params.name = jQuery('.dtitle').text();
            return params;
        }
            
        var matches = document.location.search.match(/p_id=([^&]*)/);
        if (!matches) {
            return;
        }
        
        if (jQuery('.company_title').length==1) {
                params.name = jQuery('.company_title').text();
        params.from = 'yes123-2';
        }else if (jQuery('.jobname_title a:first').length==1) {
                params.name = jQuery('.jobname_title a:first').text();
        params.from = 'yes123-3';
        }

        params.company_link = matches[1];
        return params;
    } else if ('www.1111.com.tw' == document.location.hostname) {
        var found = false;

        // check HTML   <li><a href="/job-bank/company-description.asp?nNo=2765266"></a></li>
        jQuery('#commonTop li a').each(function(){
            var href = $(this).attr('href');
            if ('string' == typeof(href) && href.match('/job-bank/company-description\.asp\\?nNo=[^&]*')) {
                params.from = '1111-1';
                params.name = $(this).text();
                params.company_link = $(this).attr('href');
                found = true;
                return false;
            }
        });
        if (found) {
            return params;
        }

        var company_dom = jQuery('#jobcontent ul li h2', document);
        if (company_dom.length != 0) {
            params.from = '1111-1';
            params.name = company_dom.eq(0).text();
            
            company_dom = jQuery('#companyDescription', document);
            if (company_dom.length != 0) {
                params.company_link = company_dom.eq(0).attr('href');
            }
            return params;
        }
        
        if ('object' === typeof(vizLayer) && 'string' === typeof(vizLayer.catname)) {
            params.from = '1111-2';
            params.name = vizLayer.catname;
            params.company_link = '#';
            return params;
        }
        jQuery('#breadcrumb li a').each(function(){
            var self = $(this);

            if (self.attr('href').match(/找工作機會/)) {
                params.from = '1111-3';
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
                params.from = '1111-4';
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
                params.from = '1111-5';
                params.name = h1_doms.text();
                return params;
            }
        }

        return;
    } else if ('www.518.com.tw' == document.location.hostname) {
        if (jQuery('.company-info h3 a').length) {
            var dom = $('.company-info h3 a');
            params.from = '518-1';
            params.name = dom.text();
            return params;
        }

        if (jQuery('#company-title').length) {
            if (jQuery('#company-title .comp-name').length == 1) {
                params.from = '518-2';
                params.name = jQuery('#company-title .comp-name').text();
                return params;
            }
            if (jQuery('#company-title .sTrong').length == 1) {
                params.from = '518-3';
                params.name = jQuery('#company-title .sTrong')[0].childNodes[0].nodeValue.replace(' ', '');
                return params;
            }
            params.from = '518-4';
            params.name = jQuery('#company-title').text().replace('所有工作機會»', '').replace(' ', '');
            params.company_link = document.location.href;
            return params;
        }

        if (!jQuery('.company-info h2 a').length) {
            return;
        }

        var dom = jQuery('.company-info h2 a');
        params.from = '518-5';
        params.name = dom.text();
        params.company_link = dom.attr('href');
    } else if ('m.518.com.tw' == document.location.hostname) {
        var dom = jQuery('.job-info .job_detail span');
        if (dom.length == 1) {
            params.from = '518-3';
            params.name = dom.text().replace(' ', '');
            return params;
        }
        var dom = jQuery('.job-info .comp-name a');
        if (dom.length == 1) {
            params.from = '518-5';
            params.name = dom.text();
            params.company_link = dom.attr('href');
            return params;
        }
        return;
    } else {
        return;
    }

    return params;
};

var main = function(){
    // TODO: 只有特定網站才要 sendRequest 來顯示 page action
    chrome.runtime.sendMessage({method: 'page'}, function(response){});

    var params = get_company_info();

    if ('object' == typeof(params) && 'undefined' !== typeof(params.name)) {
        //popup_function(null, params.name);
        
        search_package_by_name_api(params.name, params.link, function(package_id, rows){
            get_package_info(function(package_info){
                popup_function(rows, get_package_info_by_id(package_info, package_id));
            });
        }, function(error_message){
            search_package_by_name(params.name, function(package_id, rows){
                get_package_info(function(package_info){
                    chrome.runtime.sendMessage({method: 'add_match', rows: rows, package_info: get_package_info_by_id(package_info, package_id)}, function(response) {});
                });
            }, check_name);
        });
    }
};

var popup_function = function(rows, package_info){
    // 確認有沒有 #CompanyInfo 的下方視窗
    if (!document.getElementById('CompanyInfo')) {
        var content = "<div id='CompanyInfo' style='left:0; right:0; max-height: 20%; overflow-y: scroll; background: #cc103f; bottom: 0; padding: 5px; text-align: left; z-index: 99999; font-size: 14.5px; line-height: 1.5; color: #fff; position: fixed'>"
            + "<div id='CompanyInfoClose' style='color:#fff;font-weight:bold;float:right;padding:5px 0;width:46px;border:#fff solid 1px;text-align:center;'>"
            + "<span style='cursor:pointer;'>關</span>"                
            + "</div>"
            + "<ul id='CompanyInfoMessage' style='list-style-type: disc'></ul>"
            + "</div>";
        document.body.innerHTML = content + document.body.innerHTML;
        var close = document.getElementById('CompanyInfoClose');

        close.addEventListener('click',function() {
            document.getElementById('CompanyInfo').style.display = 'none';
        });

        var info_dom = document.getElementById('CompanyInfo');
        info_dom.style.background = 'yellow';
        info_dom.style.color = 'black';
    }
        
        if(!rows) {
                return;
        }

    // 確認該資料包有沒有 <li>
    if (!document.getElementById('CompanyInfo-Package-' + package_info.id)) {
        var content = '';
        content += '<li>';
        content += '<a href="' + htmlspecialchars(package_info.url) + '" target="_blank">' + htmlspecialchars(package_info.name) + '</a>';
        content += '(共 <span id="CompanyInfo-PackageCount-' + package_info.id + '">1</span> 筆符合)';
        if (package_info.notice) {
            content += '<a style="color: red" href="#" onclick="alert(this.title); return false;" title="' + htmlspecialchars(package_info.notice) + '">[注意!]</a>';
        }
        content += '<ol style="list-style-type: decimal" id="CompanyInfo-Package-' + package_info.id +'"></ol>';
        content += '</li>';
        document.getElementById('CompanyInfoMessage').innerHTML += content;
    }

    // 塞資料
    var content = '';
    content += '<li>';
    content += htmlspecialchars(rows[1]) + '. ' + htmlspecialchars(rows[2]);
    if (rows[3]) {
        content += '[<a style="display:inline" href="' + htmlspecialchars(rows[3]) + (rows[3].indexOf('?') >= 0 ? '&' : '?') + 'utm_source=jobhelper&utm_medium=web&utm_campaign=corp" target="_blank">原始連結</a>]';
    }
    if (rows[4]) {
        content += '[<a style="display:inline" href="' + htmlspecialchars(rows[4]) + '" target="_blank">截圖</a>]';
    }
    content += '</li>';

    document.getElementById('CompanyInfo-Package-' + package_info.id).innerHTML += content;
    document.getElementById('CompanyInfo-PackageCount-' + package_info.id).innerHTML = document.getElementById('CompanyInfo-Package-' + package_info.id).getElementsByTagName('li').length;
};

main();
