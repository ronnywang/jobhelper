var popup_function = function(rows, package_info){
    // 確認有沒有 #CompanyInfo 的下方視窗
    if (!document.getElementById('CompanyInfo')) {
        var content = "<div id='CompanyInfo' style='width:100%; max-height: 20%; overflow-y: scroll; background: #cc103f; bottom: 0; padding: 5px; text-align: left; z-index: 99999; font-size: 14.5px; line-height: 1.5; color: #fff; position: fixed'>"
            + "<ul id='CompanyInfoMessage' style='list-style-type: disc'></ul>"
            + "<div style='color:#fff;font-weight:bold;float:right;padding-right:8px;width:46px;'>"
            + "<span id='CompanyInfoClose' style='cursor:pointer;'>關閉</span>"                
            + "</div></div>";
        document.body.innerHTML = content + document.body.innerHTML;
        var close = document.getElementById('CompanyInfoClose');

        close.addEventListener('click',function() {
            document.getElementById('CompanyInfo').style.display = 'none';
        });

        var info_dom = document.getElementById('CompanyInfo');
        info_dom.style.background = 'yellow';
        info_dom.style.color = 'black';
    }

    if(!package_info) {
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
chrome.runtime.onMessage.addListener(onRequest);
