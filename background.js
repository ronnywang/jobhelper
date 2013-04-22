var popup_function = function(rows, package_info){
    if (!document.getElementById('CompanyInfo')) {
	var content = "<div id='CompanyInfo' style='max-height: 20%; overflow-y: scroll; background: #cc103f; bottom: 0; padding: 5px; text-align: left; z-index: 99999; font-size: 14.5px; line-height: 1.5; color: #fff; position: fixed'>"
	    + "<ol id='CompanyInfoMessage'></ol>"
	    + "<div style='color:#fff;font-weight:bold;float:right;padding-right:8px;width:46px;'>"
	    + "<span id='CompanyInfoClose' style='cursor:pointer;'>關閉</span>"                
	    + "</div></div>";
	document.body.innerHTML = content + document.body.innerHTML;
	var close = document.getElementById('CompanyInfoClose');

	close.addEventListener('click',function() {
	    document.getElementById('CompanyInfo').style.display = 'none';
	});
    } else {
	document.getElementById('CompanyInfo').style.display = 'block';
    }

    var htmlspecialchars = function(str){
	var span_dom = document.createElement('span');
	span_dom.innerText = str;
	str = span_dom.innerHTML;
	delete(span_dom);
	return str;
    };

    var info_dom = document.getElementById('CompanyInfo');
    info_dom.style.background = 'yellow';
    info_dom.style.color = 'black';
    var content = '';
    content += '<li>';
    content += htmlspecialchars(rows[1]) + '. ' + htmlspecialchars(rows[2]);
    if (rows[3]) {
        content += '[<a href="' + htmlspecialchars(rows[3]) + '" target="_blank">原始連結</a>]';
    }
    if (rows[4]) {
        content += '[<a href="' + htmlspecialchars(rows[4]) + '" target="_blank">截圖</a>]';
    }
    content += '[資料包: <a href="' + htmlspecialchars(package_info.url + '#company-' + rows[0] + '-' + rows[1]) + '" target="_blank">' + htmlspecialchars(package_info.name) + '</a>]';
    content += '</li>';

    document.getElementById('CompanyInfoMessage').innerHTML += content;
};


function onRequest(request, sender, sendResponse) {
    if (request.method== 'page') {
        // 顯示設定求職小幫手的 page action
        chrome.pageAction.show(sender.tab.id);
    }

    if (request.method == 'add_match') {
        chrome.tabs.executeScript(sender.tab.id, {code: "(" + popup_function + ')(' + JSON.stringify(request.rows) + ',' + JSON.stringify(request.package_info) + ')'});
    }

    // Return nothing to let the connection be cleaned up.
    sendResponse({});
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
