﻿


(function() {

	// function insertIframe(){
	// 	/*注入Iframe*/
	// 	var iframe = document.createElement("iframe");
	// 	iframe.setAttribute("id","step-iframe");
	// 	iframe.style.position = "fixed";
	// 	iframe.style.right = "5px";
	// 	iframe.style.top = "5px";
	// 	iframe.style.width = "320px";
	// 	iframe.style.height = "600px";
	// 	iframe.style.background = "#2F373D";		
	// 	iframe.style.zIndex = "10000";		
	// 	iframe.style.border = "2px solid #ccc";		
	// 	iframe.setAttribute("src",chrome.extension.getURL("index.html"));
	// 	document.body.appendChild(iframe);
	// };

	function init(){
		if (!document.getElementById("jzj_cdn_jquery")) {
			/*注入处理任务流程的script*/
			var node = document.createElement("script");
			node.setAttribute("name", "jzj_cdn_jquery");
			node.setAttribute("id", "jzj_cdn_jquery");
			node.setAttribute("type", "text/javascript");
			node.setAttribute("src", chrome.extension.getURL("script/jquery-2.1.1.min.js"));
			document.body.appendChild(node);
		}

		if (!document.getElementById("jzj-script")) {
			/*注入处理任务流程的script*/
			var node = document.createElement("script");
			node.setAttribute("name", "jzj-script");
			node.setAttribute("id", "jzj-script");
			node.setAttribute("type", "text/javascript");
			node.setAttribute("src", chrome.extension.getURL("script.js"));
			document.body.appendChild(node);
		}
	};

	init();	

	var port = chrome.runtime.connect();
	window.addEventListener("message", function(event) {
	  if (event.source != window)
	    return;
	  if (event.data.type && (event.data.type == "EXECUTE_SCRIPT_CALLBACK")) {
	    chrome.extension.sendRequest({command: event.data.command, message: event.data.message, data: event.data.data}, function(response) {
		  console.log(response.message);
		});
	  }
	}, false);

})();