
var statusType = {"READY":"READY","RUNNING":"RUNNING","PAUSE":"PAUSE","STOP":"STOP","ERROR":"ERROR","FINISH":"FINISH"};
var flow = new shoppingFlow();
var storage = new storageService();
var isActive = false;
var errorDelaySecond = 10 * 1000;


/*锁屏*/
function lockUI(tabId){
	var _script = [];
	_script.push('try{');
	_script.push('	var pageHeight = window.document.body.offsetHeight;');
	_script.push('	var oldDiv = document.getElementById(\"lock-div\");');
	_script.push('	if(oldDiv!=undefined)oldDiv.remove();');
	_script.push('	var div = document.createElement(\"div\");');
	_script.push('	div.setAttribute("id","lock-div");');
	_script.push('	div.style.position = "absolute";');
	_script.push('	div.style.right = "25px";');
	_script.push('	div.style.top = "0px";');
	_script.push('	div.style.left = "0px";');
	_script.push('	div.style.width = "100%";');
	_script.push('	div.style.height = pageHeight + "px";');
	_script.push('	div.style.background = "#000";');
	_script.push('	div.style.zIndex = "9999999999";	');
	_script.push('	div.style.filter = "alpha(opacity=45)";	');
	_script.push('	div.style.opacity = "0.45";	');
	_script.push('	document.body.appendChild(div);');
	_script.push('}catch(e){console.error(e)}');
	chrome.tabs.executeScript(tabId, {
		runAt: "document_end",
		code: _script.join("")
	});
};
/*解锁*/
function unLockUI(tabId){
	var _script = [];
	_script.push('try{');	
	_script.push('	var oldDiv = document.getElementById(\"lock-div\");');
	_script.push('	if(oldDiv!=undefined)oldDiv.remove();');
	_script.push('}catch(e){console.error(e)}');
	chrome.tabs.executeScript(tabId, {
		runAt: "document_end",
		code: _script.join("")
	});
};
/*插入iframe到页面*/
function insertIframe(tabId){
	lockUI(tabId);
	var url = chrome.extension.getURL("index.html");
	var _script = [];
	_script.push('try{');
	_script.push('	var oldIframe = document.getElementById(\"step-iframe\");');
	_script.push('	if(oldIframe!=undefined)oldIframe.remove();');
	_script.push('	var iframe = document.createElement(\"iframe\");');
	_script.push('	iframe.setAttribute("id","step-iframe");');
	_script.push('	iframe.style.position = "fixed";');
	_script.push('	iframe.style.right = "25px";');
	_script.push('	iframe.style.top = "25px";');
	_script.push('	iframe.style.width = "320px";');
	_script.push('	iframe.style.height = "700px";');
	_script.push('	iframe.style.background = "#2F373D";');
	_script.push('	iframe.style.zIndex = "10000000000";	');
	_script.push('	iframe.style.border = "2px solid #ccc";');
	_script.push('	iframe.setAttribute("src",\"' + url + '\");');
	_script.push('	document.body.appendChild(iframe);');
	_script.push('}catch(e){console.error(e)}');
	chrome.tabs.executeScript(tabId, {
		runAt: "document_end",
		code: _script.join("")
	});
};
/*移除iframe*/
function removeIframe(){
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
	  	unLockUI(tabs[0].id);
	  	var _script = [];
		_script.push('try{');
		_script.push('	var iframe = document.getElementById(\"step-iframe\");');
		_script.push('	iframe.remove();');
		_script.push('}catch(e){console.error(e)}');
		chrome.tabs.executeScript(tabs[0].id, {
			runAt: "document_end",
			code: _script.join("")
		});	
	});
};

/*监听单击插件图标的事件*/
chrome.browserAction.onClicked.addListener(function(tab){
	if(!isActive){
		storage.clearFlowDesc();
		storage.clearFlowData();
	}
	isActive = true;
	insertIframe(tab.id);
});
/*监听创建新TAB的事件*/
chrome.tabs.onCreated.addListener(function(tab){

	if(!isActive){
		return;
	}
	if(flow.getStatus()!=statusType.PAUSE){
		insertIframe(tab.id);		
	}
});
/*监听当前TAB刷新的事件*/
chrome.tabs.onUpdated.addListener(function(tab){

	if(!isActive){
		return;
	}
	if(flow.getStatus()!=statusType.PAUSE){
		insertIframe(tab.id);		
	}
});

/*监听web page传递回来的事件，主要是控制流程*/
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
   var reqMsg = request;
   /* 消息格式 */
   /* { command: "", message : "", data : "" } */
   switch(reqMsg.command){
   		case "getFlowDesc":
			storage.clearFlowDesc();
			storage.saveFlowDesc(flow.getFlowDesc());
   			break;
   		case "init":
   			ajaxGet(getGlobalConfig().API.HOST + '/ShopTask/' + reqMsg.data.taskId, {}, function(data){
   				flow.init(reqMsg.data.taskId,JSON.parse(data.taskDetail));
   				storage.clearFlowDesc();
				storage.saveFlowDesc(flow.getFlowDesc());
   			},function(error){
   				console.log(error);
   			}); 
   			break;
   		case "start":
   			//开始购物流程
   			flow.start();  			
   			break;
   		case "pause":
   			//暂停购物流程
   			unLockUI();
   			flow.pause();   			
   			break;
   		case "stop":
   			//停止购物流程
   			if(flow.getStatus()==statusType.RUNNING){
   				if(confirm("正在执行任务，您确定要停止吗？")){
					flow.stop(); 
				}
   			}else{
   				flow.stop();  
   			}   			
   			break;
   		case "retry":
   			//重试购物流程
   			var currIndex = reqMsg.data.currIndex;
   			flow.retry(currIndex);
   			break;
   		case "continue":
   			//继续购物流程下一步
   			var currIndex = reqMsg.data.currIndex;
   			flow.continue(currIndex);
   			break;
   		case "next":   					
   			if(reqMsg.status != undefined && reqMsg.status == -1){
   				/*执行过程发生错误，重试3次*/ 
   				setTimeout(function(){ 
   					console.log("出现错误，可能是页面没有加载完成, resume "+flow.getRetryTimes()+" 次"); 
   					flow.resume(); 
   					flow.setRetryTimes(flow.getRetryTimes()+1);
   				},
   				errorDelaySecond);
   			}else{
   				//购物流程下一步
   				flow.next();
   			}   			
   			break;
   		case "go":
   			var step = reqMsg.step || -1;
			if (step > 1) {
				/* go to the index step */
				flow.go(step);
			}
   			break;
   		case "run":
   			var step = reqMsg.step || -1;
			if (step > 1) {
				flow.run(step);
			}
   			break;
   		case "error":
   			/*执行过程发生错误，重试3次*/
   			if(flow.getRetryTimes() < 4){
   				setTimeout(function(){ 
   					console.log("出现错误，可能是页面没有加载完成, resume "+flow.getRetryTimes()+" 次"); 
   					flow.resume(); 
   					flow.setRetryTimes(flow.getRetryTimes()+1);
   				},
   				errorDelaySecond);
   			}else{
   				flow.errorHandler(reqMsg.message);
   			}	
   			break;
   		case "closeIframe":   		
   			if(flow.getStatus()==statusType.RUNNING || flow.getStatus()==statusType.PAUSE){
   				if(confirm("正在执行任务，您确定要停止吗？")){
					isActive = false;	
   					removeIframe(); 
   					flow.stop();  
				}
   			}else{
   				isActive = false;	
   				removeIframe();  
   			}	
   			break;
   		case "hideIframe":   		
   			removeIframe();
   			break;
   		case "check_insert_status":
   			if(reqMsg.data == undefined || reqMsg.data == null){
   				console.log("页面没有加载完成, 重新注入代码（resume）");
   				flow.resume();
   			}   			
   			break;
   		default:
   			break;
   }
   sendResponse({ message : "command" + reqMsg.command + " process finish."});
});

/*负责执行购物流程代码*/
function shoppingFlow(){

	var template = JSON.stringify({"pretreatment": [{"url": "http://www.tmall.com/", "desc": "搜索商品，关键字【@keyword】", "define": "", "script": "keywork = \"@keyword\";$(\"input#mq\").val(keywork);$(\"form.mallSearch-form button:submit\").click(function(){ callback({status:STATUS.UNKNOW});}).click();"}, {"url": "#", "desc": "选择类别【@category】", "define": "", "script": "category = \"@category\";$(\"a[title^='\" + category + \"']\").click(function(){ callback({status:STATUS.UNKNOW});}).get(0).click();"}, {"url": "#", "desc": "设定价格范围【@minprice】-【@maxprice】", "define": "", "script": "startPrice = @minprice;endPrice = @maxprice;if(startPrice>=0){ $(\"input[name='start_price']\").val(startPrice);}if(startPrice > 0){ $(\"input[name='end_price']\").val(endPrice);}$(\"#J_FPEnter\").click(function(){ callback({status:STATUS.UNKNOW});}).get(0).click();"}, {"url": "#", "desc": "随机访问4个商品，浏览时间大概3分钟", "define": "", "script": "var p = $(\"p.productTitle a\");p.each(function(){ $(this).attr(\"target\", \"_blank\");});var json = {};var jsList = [];var list = getRandom(p,4);for(var i=0; i<list.length; i++){ p.get(list[i]).click(); jsList.push(p.eq(list[i]).attr(\"href\"));sleep(10*(i+1));}json.url = jsList;run(5);"}, {"url": "#", "desc": "打开指定商品浏览，浏览时间大概3分钟", "define": "", "script": "var real_url = \"@productUrl\";callback({status:STATUS.UNKNOW});window.location.href = real_url;"}, {"url": "#", "desc": "进入店家店铺", "define": "", "script": "$(\"a.enterShop\").removeAttr(\"target\");$(\"a.enterShop\").click(function(){sleep(10);callback({status:STATUS.UNKNOW});}).get(0).click();"}, {"url": "http://@shopName.tmall.com/search.htm?spm=a1z10.5-b.w5842-9363500331.1.qThoFI&search=y", "desc": "打开店内商品列表页", "define": "", "script": "/*$(\"div.navs a.navlist3\").removeAttr(\"target\");$(\"div.navs a.navlist3\").click(function(){ callback({status:STATUS.UNKNOW});}).get(0).click();*/"}, {"url": "#", "desc": "随机打开4个商品，浏览时间大概4分钟", "define": "", "script": "var p = $(\"a.item-name\");p.each(function(){ $(this).attr(\"target\", \"_blank\");});var json = {};var jsList = [];var list = getRandom(p,4);for(var i=0; i<list.length; i++){ p.get(list[i]).click(); jsList.push(p.eq(list[i]).attr(\"href\")); sleep(10*(i+1));}json.url = jsList;go(9);"}, {"url": "#", "desc": "购物流程已暂停。需要人工介入，请跟客服聊天，聊天完毕之后，请点击继续按钮，流程继续。", "define": "", "script": "pause(\"在线客服聊天\");"}], "product": [{"url": "@productUrl", "desc": "打开要购买的商品", "define": "", "script": "document.cookie = \"cart=\" + $(\"a.sn-cart-link\").text().replace(/[^\\d]/g, \"\") + \";\";$(\"div.tb-btn-basket a\").click(function(){ callback({status:STATUS.UNKNOW,delay:5000});}).get(0).click();"}, {"url": "#", "desc": "加入购物车", "define": "", "script": "var list = document.cookie.split(\";\");for(var i=0; i<list.length; i++){ var str = list[i].split(\"=\"); if(str[0].replace(/(^\\s)*|(\\s$)*/g, \"\") == \"cart\"){ if($(\"a.sn-cart-link\").text().replace(/[^\\d]/g, \"\") > str[1].replace(/(^\\s)*|(\\s$)*/g, \"\")){ callback({status:STATUS.UNKNOW}); }else{ callback({status:STATUS.FAIL}); } }}"}], "steps": [{"url": "http://cart.tmall.com/cart.htm", "desc": "查看购物车，准备结算。", "define": "", "script": "$(\"input.J_CheckBoxItem\").first().click();$.wait(function(){ return $(\"#J_Go\").is(\":enabled\"); }).done(function(){ $(\"#J_Go\").click(function(){ callback({statue:STATUS.UNKNOW}); }).get(0).click();}).fail(function(){ callback({status:STATUS.FAIL,message:\"Wait timeout\"});});"}, {"url": "#", "desc": "提交订单。", "define": "", "script": "$.wait(function(){return $(\"#J_Go\").is(\":enabled\"); }).done(function(){ $(\"#J_Go\").click(function(){ callback({statue:STATUS.UNKNOW}); }).get(0).click();}).fail(function(){callback({status:STATUS.FAIL,message:\"Wait timeout\"});});"}, {"url": "#", "desc": "购物流程已暂停。需要人工介入，请支付，支付完成后，请点击继续，流程自动结束完成。", "define": "", "script": "pause(\"支付\");"}], "local": "function getRandom(e,n){ var list = []; if(e.length < n){ n = e.length; } while(list.length < n){ var bl = true; var r = Math.floor(Math.random() * e.length); for(var i=0; i<list.length; i++){ if(list[i] == r){ bl = false; } } if(bl){ list.push(r); } } return list;}", "flowDesc": [{"index": "0", "desc": "搜索商品"}, {"index": "1", "desc": "按类别筛选商品"}, {"index": "2", "desc": "按价格筛选商品"}, {"index": "3", "desc": "随机浏览4个商品"}, {"index": "4", "desc": "浏览商品"}, {"index": "5", "desc": "进入店铺"}, {"index": "6", "desc": "打开店内商品列表页"}, {"index": "7", "desc": "随机浏览4个商品"}, {"index": "8", "desc": "在线客服聊天"}, {"index": "9", "desc": "添加购物车"}, {"index": "10", "desc": "查看购物车"}, {"index": "11", "desc": "提交订单"}, {"index": "12", "desc": "支付"}]});

	

	var _this = this; 
	var delay = 10 * 1000;
	var tabId = -1;	
	var retryTimes = 0;
	//var isRunning = false;
	
	_this.templateData = {};
	_this.currStepIndex = -1;	
	_this.currStep = {};
	_this.status = statusType.READY;
	_this.taskData = {};
	_this.taskId = -1;

	/*设置retry次数*/
	_this.setRetryTimes = function(value){
		retryTimes = value;
	};
	/*获取retry次数*/
	_this.getRetryTimes = function(){
		return retryTimes;
	};
	/*把模板的参数调换成真实的值*/
	var replaceTemplate = function(data,tpl){
		var tplStr = tpl;
		tplStr = tplStr.replace(/@keyword/ig, data.searchProductKeywords[0].keyword);
		tplStr = tplStr.replace(/@category/ig, data.searchProductKeywords[0].prodcutCategory1);
		tplStr = tplStr.replace(/@minprice/ig, data.searchMinPrice);
		tplStr = tplStr.replace(/@maxprice/ig, data.searchMaxPrice);
		tplStr = tplStr.replace(/@productUrl/ig, data.productId.productUrl);
		tplStr = tplStr.replace(/@shopName/ig, data.shopName);
		return JSON.parse(tplStr);
	};
	/*初始化任务数据*/
	_this.init = function(taskId,data){
		_this.taskId = taskId;
		_this.templateData = {};
		/*保存任务数据，准备开始调换数据*/
		if(typeof data == "object"){
			data = JSON.stringify(data);
		}
		_this.taskData = JSON.parse(data);
		_this.templateData = replaceTemplate(_this.taskData,template);
	};
	/*开始执行购物流程*/
	_this.start = function(){
		if(isRunning()){
			alert("正在执行任务，如果需要重新开始，请先结束正在执行的任务，然后重试！");
			return;
		}	
		chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
			chrome.tabs.update(tabs[0].id,{url:_this.currStep.url}, function(tab){
				tabId = tabs[0].id;
				_this.currStepIndex = -1;	
				if(!hasNextStep()){
					alert("流程已经结束。");
					return;
				}
				
				_this.status = statusType.RUNNING;	
				_this.currStep = getNextStep();
				storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status);
				execute();
			});
		});
	};
	/*暂停购物流程*/
	_this.pause = function(){
		if(isRunning()){
			//TODO：暂停购物流程，先把之前的数据暂存起来	
		}
		_this.status = statusType.PAUSE;		
		setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
	};
	/*停止购物流程*/
	_this.stop = function(){		
		if(isRunning()){
			//TODO：如果任务正在执行，处理停止过程需要保存的数据
			
		}
		storage.clearFlowDesc();
		storage.clearFlowData();		
		_this.status = statusType.STOP;
		setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
	};
	/*停止购物流程*/
	_this.errorHandler = function(errorMsg){			
		_this.status = statusType.ERROR;
		_this.currStep.desc = errorMsg;
		setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
	};
	/*重试当前步购物流程*/
	_this.retry = function(currIndex){
		if(isRunning()){
			alert("正在执行任务，如果需要重试当前步骤，请先结束正在执行的任务，然后重试！");
			return;
		}
		_this.currStepIndex = currIndex - 1;
		if(!hasNextStep()){
			_this.status = statusType.FINISH
			setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
			alert("流程已经结束。");
			return;
		}
		_this.currStep = getNextStep();
		
		_this.status = statusType.RUNNING;	
		setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
		execute();
	};
	/*继续下一步购物流程*/
	_this.continue = function(currIndex){
		if(isRunning()){
			alert("正在执行任务，如果需要继续下一步，请先结束正在执行的任务，然后重试！");
			return;
		}
		_this.currStepIndex = currIndex;
		if(!hasNextStep()){
			_this.status = statusType.FINISH
			setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
			alert("流程已经结束。");
			return;
		}
		_this.currStep = getNextStep();
		
		_this.status = statusType.RUNNING;	
		setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);

		execute();
	};
	/*下一步购物流程*/
	_this.next = function(){
		if(_this.status==statusType.PAUSE){
			return;
		}
		if(!isRunning()){
			alert("流程已经终止，请重新开始。");
			return;	
		}

		if(!hasNextStep()){
			_this.status = statusType.FINISH
			setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
			alert("流程已经结束。");
			return;
		}
		_this.currStep = getNextStep();
		
		_this.status = statusType.RUNNING;	
		setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
		execute();
	};
	/*goto到购物流程的某一步*/
	_this.go = function(stepIndex){
		if(!isRunning()){
			alert("流程已经终止，请重新开始。");
			return;	
		}
		_this.currStepIndex = stepIndex - 1;
		if(!hasNextStep()){
			_this.status = statusType.FINISH
			setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
			alert("流程已经结束。");
			return;
		}
		_this.status = statusType.RUNNING;
		_this.currStep = getNextStep();
		setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
		execute();
	};
	/*继续运行购物流程某一步*/
	_this.run = function(stepIndex){
		if(!isRunning()){
			alert("流程已经终止，请重新开始。");
			return;	
		}
		_this.currStepIndex = stepIndex - 1;
		/* only run script */
		if(!hasNextStep()){
			_this.status = statusType.FINISH
			setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
			alert("流程已经结束。");
			return;
		}
		_this.status = statusType.RUNNING;
		_this.currStep = getNextStep();
		setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);
		_this.currStep.url = '#';
		execute();
	};
	/*脚本注入不成功重做一次*/
	_this.resume = function(){
		console.log("resume task");
		execute();
	};
	_this.getStatus = function(){
		return _this.status;
	};
	var isRunning = function(){
		return _this.status == statusType.RUNNING;
	};
	/*执行购物流程的细节*/
	var execute = function(){
		try{
			/*开始执行脚本*/
			if(_this.currStep.url != '$' && _this.currStep.url != '#'){
				//打开URL
				chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
					chrome.tabs.update(tabs[0].id,{url:_this.currStep.url}, function(tab){
						console.log('open link:' + _this.currStep.url);
						insertScript();
					});
				});
				
			}else{
				insertScript();
			}
		}catch(e){
			_this.status = statusType.ERROR;
			setTimeout(function(){ storage.setFlowData(_this.taskId,_this.currStepIndex,_this.currStep,_this.status); },delay);			
			console.log("流程执行出错：" + e.message);
		}				
	};
	
	var exeTimeout;

	var insertScript = function(){			

		function executeScript(){

			//开始注入脚本执行
			console.log("begin insert javascript");
			var name = "jzj_script_" + new Date().getTime();
			var _script = [];
			/*node1 是注入JSON类库*/
			_script.push('try{');
			_script.push('var node = document.createElement("script");');
			_script.push('node.setAttribute("name", "' + name + '");');
			_script.push('node.setAttribute("type", "text/javascript");');
			_script.push('node.textContent = "handlerTemplateData(JSON.parse(unescape(\'' + escape(JSON.stringify(_this.currStep))+ '\')))";');			
			_script.push('document.body.appendChild(node);}catch(e){console.error(e)}');			

			function exe(){
				chrome.tabs.query({ currentWindow: true, active: true,  status: "complete" }, function (tabs) {
					if(tabs.length > 0){
						clearTimeout(exeTimeout);
						console.log('脚本已经注入，清除settimeout');
						chrome.tabs.executeScript(tabs[0].id, {
							runAt: "document_end",
							code: _script.join("")
						},function(){
							/*保存执行信息*/
							var ajax = new ajaxService();
							ajax.addTaskBuyerActivityDetail({"tbActivityId":_this.taskId,"stepData":{"stepName":_this.templateData.flowDesc[currStepIndex].desc,"stepDesc":_this.currStep.desc}});
						});	
						console.log("end insert javascript");
					}else{
						exeTimeout = setTimeout(function(){exe();},3000);
					}									
				});	
			};

			exeTimeout = setTimeout(function(){exe();},3000);	
			
		};	

		setTimeout(function(){executeScript();},delay);

	};
	/*判断是否有下一步*/
	var hasNextStep = function(){
		return _this.currStepIndex < (_this.templateData.pretreatment.length + _this.templateData.product.length + _this.templateData.steps.length - 1);
	};
	/*获取下一步执行数据*/
	var getNextStep = function(){
		/*如果执行下一步，说明retry可能成功，清除计数器*/
		_this.setRetryTimes(0);
		_this.currStepIndex++;
		if(_this.currStepIndex < _this.templateData.pretreatment.length){
			return _this.templateData.pretreatment[_this.currStepIndex];
		}else if(_this.currStepIndex < _this.templateData.product.length + _this.templateData.pretreatment.length){
			return _this.templateData.product[_this.currStepIndex - _this.templateData.pretreatment.length];
		}else{
			return _this.templateData.steps[_this.currStepIndex - _this.templateData.product.length - _this.templateData.pretreatment.length];
		}		
	};
	_this.getFlowDesc = function(){
		return _this.templateData.flowDesc;
	};

}
/*存储到local storage serive*/
function storageService(){
	/*保存流程信息*/
	this.saveFlowDesc = function(flowDesc){
		window.localStorage.setItem("flowDesc", JSON.stringify(flowDesc));
	};
	/*清除流程执行的信息*/
	this.clearFlowDesc = function(){
		var flowItem = window.localStorage.getItem("flowDesc");
		if(flowItem!=null&&flowItem!=undefined){
			window.localStorage.removeItem("flowDesc");
		}
	};
	/*保存流程信息*/
	this.setFlowData = function(taskId,currStepIndex,currStep,status){
		var flowData = window.localStorage.getItem("flowData");
		if(flowData!=null&&flowData!=undefined){
			window.localStorage.removeItem("flowData");
		}
		var jsonFlowData = {"taskId":taskId,"currStepIndex":currStepIndex,"currStep":currStep,"status":status};
		console.log("jsonFlowData:" + JSON.stringify(jsonFlowData));
		window.localStorage.setItem("flowData", JSON.stringify(jsonFlowData));
	};
	/*获取流程信息*/
	this.getFlowData = function(){
		var flowData = window.localStorage.getItem("flowData");
		return JSON.parse(flowData);
	};
	/*清除流程信息*/
	this.clearFlowData = function(){
		var flowData = window.localStorage.getItem("flowData");
		if(flowData!=null&&flowData!=undefined){
			window.localStorage.removeItem("flowData");
		}
	};
};

