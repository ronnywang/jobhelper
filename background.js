var popup_function = function(params){
    if (!document.getElementById('CompanyInfo')) {
	var content = "<div id='CompanyInfo' style='background: #cc103f; bottom: 0; padding: 5px; text-align: center; z-index: 99999; font-size: 14.5px; line-height: 1.5; color: #fff; position: fixed'>"
	    + "<div id='CompanyInfoMessage'></div>"
	    + "<div style='color:#fff;font-weight:bold;float:right;padding-right:8px;width:46px;'>"
	    + "<span id='CompanyInfoClose' style='cursor:pointer;'>&times;</div>"                
	    + "</div></div>";
	document.body.innerHTML = content + document.body.innerHTML;
	var close = document.getElementById('CompanyInfoClose');

	close.addEventListener('click',function() {
	    document.getElementById('CompanyInfo').style.display = 'none';
	});
    } else {
	document.getElementById('CompanyInfo').style.display = 'block';
    }

    var info_dom = document.getElementById('CompanyInfo');
    info_dom.style.background = ('undefined' === typeof(params.bgcolor)) ? 'yellow' : params.bgcolor;
    info_dom.style.color = ('undefined' === typeof(params.fgcolor)) ? 'black' : params.fgcolor;
    document.getElementById('CompanyInfoMessage').innerHTML = '<b>' + params.body + '</b>';
};

function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script)
  // was on.
    chrome.tabs.executeScript(sender.tab.id, {code: "(" + popup_function + ')(' + JSON.stringify(request) + ')'});

  // Return nothing to let the connection be cleaned up.
  sendResponse({});
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
