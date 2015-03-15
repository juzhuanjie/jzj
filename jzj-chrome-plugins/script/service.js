
///
///  主要是处理跟后台交互的API
///  所有数据接口定义
/// 

/*配置API主机和端口*/
function getGlobalConfig(){
	return {
		API : {
			HOST : 'http://119.29.22.94:1337'
		},
		WEB : {
			HOST : 'http://119.29.22.94:1337'
		}
	};
};
/*AJAX POST 请求*/
function ajaxPost(url,json,successCallBack,errorCallBack){
	$.ajax({     
	    'url': url,     
	    'type': 'post',     
	    'contentType': "application/json",
	    'dataType': 'json',
	    'data': JSON.stringify(json),  
	    //'hearders':{},  s 
	    'async' : true, //默认为true 异步     
	    beforeSend: function(request) {
	       var token = getHearders("token");
           request.setRequestHeader("token", token);
        },
	    error:function(error){     
	        if(errorCallBack != undefined && typeof errorCallBack == 'function'){
	        	errorCallBack(error);
	        }
	    },     
	    success:function(data,status,xhr){     
	        if(successCallBack != undefined && typeof successCallBack == 'function'){
	        	successCallBack(data,status,xhr);
	        }
	    }  
	});
}
/*AJAX PUT 请求*/
function ajaxPut(url,json,successCallBack,errorCallBack){
	$.ajax({     
	    'url': url,     
	    'type': 'put',     
	    'contentType': "application/json",
	    'dataType': 'json',
	    'data': JSON.stringify(json),  
	    //'hearders':{},  s 
	    'async' : true, //默认为true 异步     
	    beforeSend: function(request) {
	       var token = getHearders("token");
           request.setRequestHeader("token", token);
        },
	    error:function(error){     
	        if(errorCallBack != undefined && typeof errorCallBack == 'function'){
	        	errorCallBack(error);
	        }
	    },     
	    success:function(data,status,xhr){     
	        if(successCallBack != undefined && typeof successCallBack == 'function'){
	        	successCallBack(data,status,xhr);
	        }
	    }  
	});
}
/*AJAX GET 请求*/
function ajaxGet(url,json,successCallBack,errorCallBack){
	$.ajax({     
	    'url': url,     
	    'type': 'get',     
	    'contentType': "application/json",
	    'dataType': 'json',
	    'data': JSON.stringify(json),  
	    //'hearders':{},   
	    'async' : true, //默认为true 异步     
	    beforeSend: function(request) {
	       var token = getHearders("token");
           request.setRequestHeader("token", token);
        },
	    error:function(error){     
	        if(errorCallBack != undefined && typeof errorCallBack == 'function'){
	        	errorCallBack(error);
	        }
	    },     
	    success:function(data,status,xhr){     
	        if(successCallBack != undefined && typeof successCallBack == 'function'){
	        	successCallBack(data,status,xhr);
	        }
	    }  
	});
}
/*AJAX DELETE 请求*/
function ajaxDelete(url,json,successCallBack,errorCallBack){
	$.ajax({     
	    'url': url,     
	    'type': 'delete',     
	    'contentType': "application/json",
	    'dataType': 'json',
	    'data': JSON.stringify(json),  
	    //'hearders':{},   
	    'async' : true, //默认为true 异步     
	    beforeSend: function(request) {
	       var token = getHearders("token");
           request.setRequestHeader("token", token);
        },
	    error:function(error){     
	        if(errorCallBack != undefined && typeof errorCallBack == 'function'){
	        	errorCallBack(error);
	        }
	    },     
	    success:function(data,status,xhr){     
	        if(successCallBack != undefined && typeof successCallBack == 'function'){
	        	successCallBack(data,status,xhr);
	        }
	    }  
	});
}
/*get global session token*/
function getHearders(key){
	var token = window.localStorage.getItem("token");
	return (token != undefined && token != null ) ? token : "";
}
/*set global session token*/
function setHearders(data){
	//TODO: 设置session token信息到浏览localstoge存储里面和global变量里获取
}
/*后台数据处理的Service*/
function ajaxService(){
	/*获取可接单的任务*/
	this.getTaskForBuyer = function(succCallBack,errCallBack){
		ajaxGet(getGlobalConfig().API.HOST + '/VWShopTask/getTaskForBuyer', { },
			function success(data){
				if(typeof succCallBack == 'function'){
					succCallBack(data);
				}
			},
			function error(reason){
				if(typeof errCallBack == 'function'){
					errCallBack(reason);	
				}
			}
		);			
	};
	/*获取账户信息*/
	this.queryBalance = function(succCallBack,errCallBack){
		ajaxGet(getGlobalConfig().API.HOST + '/query/balance', { }, 
			function success(data){
				if(typeof succCallBack == 'function'){
					succCallBack(data);
				}
			},
			function error(reason){
				if(typeof errCallBack == 'function'){
					errCallBack(reason);	
				}
			}
		);
	};
	/*获取Task信息*/
	this.getTaskData = function(taskId,succCallBack,errCallBack){
		ajaxGet(getGlobalConfig().API.HOST + '/ShopTask/' + taskId, {}, 
			function success(data){
				if(typeof succCallBack == 'function'){
					succCallBack(data);
				}
			}, 
			function error(reason){
				if(typeof errCallBack == 'function'){
					errCallBack(reason);	
				}
			}
		);
	};
	/*买手接手，添加记录*/
	this.addTaskBuyer = function(taskBuyer,succCallBack,errCallBack){
		ajaxPost(getGlobalConfig().API.HOST + '/TaskBuyer', taskBuyer,				
			function success(data,status,xhr){	
				if(typeof errCallBack == 'function'){
					succCallBack(data);
				}				
			},
			function error(reason){
				if(typeof errCallBack == 'function'){
					errCallBack(reason);	
				}				
			}
		);
	};
	/*更新taskBuyer状态*/
	this.updateTaskBuyerStatus = function(taskStatus,succCallBack,errCallBack){
		ajaxPut(getGlobalConfig().API.HOST + '/TaskBuyer', taskBuyer,				
			function success(data,status,xhr){	
				if(typeof succCallBack == 'function'){
					succCallBack(data);
				}				
			},
			function error(reason){
				if(typeof errCallBack == 'function'){
					errCallBack(reason);	
				}				
			}
		);
	};
	/*记录做任务的每一步的信息*/
	this.addTaskBuyerActivityDetail = function(details,succCallBack,errCallBack){
		ajaxPost(getGlobalConfig().API.HOST + '/TaskBuyerActivityDetail', details,				
			function success(data,status,xhr){	
				if(typeof succCallBack == 'function'){
					succCallBack(data);
				}				
			},
			function error(reason){
				if(typeof errCallBack == 'function'){
					errCallBack(reason);	
				}				
			}
		);
	};
};
function getCurrExecuteTask(){
	var taskId = window.localStorage.getItem("currExecuteTaskId");
	if(taskId==undefined&&taskId==null){
		return -1;
	}else{
		return taskId;
	}
};
/*保存当前执行的task id*/
function saveCurrExecuteTask(id){
	window.localStorage.setItem("currExecuteTaskId", id);
};
/*清除当前执行的task id*/
function clearCurrExecuteTask(){
	window.localStorage.removeItem("currExecuteTaskId");
};
/*保存session信息到localstorage*/
function saveSession(token,user){
	window.localStorage.setItem("token", token);
	window.localStorage.setItem("loginTime", new Date());
	window.localStorage.setItem("userId", user.userId);
	window.localStorage.setItem("userLogin", user.userLogin);
	window.localStorage.setItem("email", user.email);
}
/*清除session信息从localstorage*/
function clearSession(){
	window.localStorage.removeItem("token");
	window.localStorage.removeItem("loginTime");
	window.localStorage.removeItem("userId");
	window.localStorage.removeItem("userLogin");
	window.localStorage.removeItem("email");
}
/*获取流程状态*/
function getStorageFlowStatus(status){
	return window.localStorage.getItem("flowStatus");
};
/*获取URL参数*/
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function flowStorageService(){
	this.getFlowDesc = function(){
		return window.localStorage.getItem("flowDesc");	
	};
	this.getFlowData = function(){
		return window.localStorage.getItem("flowData");	
	};
}


/*测试数据*/
function getTmallTemplate(){
	return tmallTemplate = {
	    "pretreatment": [
	        {
	            "url": "http://www.tmall.com/", 
	            "desc": "搜索商品，关键字【@keyword】", 
	            "define": "", 
	            "script": "keywork = \"@keyword\";$(\"input#mq\").val(keywork);$(\"form.mallSearch-form button:submit\").click(function(){ callback({status:STATUS.UNKNOW});}).click();"
	        }, 
	        {
	            "url": "#", 
	            "desc": "选择类别【@category】", 
	            "define": "", 
	            "script": "category = \"@category\";$(\"a[title^='\" + category + \"']\").click(function(){ callback({status:STATUS.UNKNOW});}).get(0).click();"
	        }, 
	        {
	            "url": "#", 
	            "desc": "设定价格范围【@minprice】-【@maxprice】", 
	            "define": "", 
	            "script": "startPrice = @minprice;endPrice = @maxprice;if(startPrice>=0){ $(\"input[name='start_price']\").val(startPrice);}if(startPrice > 0){ $(\"input[name='end_price']\").val(endPrice);}$(\"#J_FPEnter\").click(function(){ callback({status:STATUS.UNKNOW});}).get(0).click();"
	        }, 
	        {
	            "url": "#", 
	            "desc": "随机访问4个商品，浏览时间大概3分钟", 
	            "define": "", 
	            "script": "var p = $(\"p.productTitle a\");p.each(function(){ $(this).attr(\"target\", \"_blank\");});var json = {};var jsList = [];var list = getRandom(p,4);for(var i=0; i<list.length; i++){ p.get(list[i]).click(); jsList.push(p.eq(list[i]).attr(\"href\"));sleep(10*(i+1));}json.url = jsList;run(5);"
	        }, 
	        {
	            "url": "#", 
	            "desc": "打开指定商品浏览，浏览时间大概3分钟", 
	            "define": "", 
	            "script": "var real_url = \"@productUrl\";callback({status:STATUS.UNKNOW});window.location.href = real_url;"
	        }, 
	        {
	            "url": "#", 
	            "desc": "进入店家店铺", 
	            "define": "", 
	            "script": "$(\"a.enterShop\").removeAttr(\"target\");$(\"a.enterShop\").click(function(){sleep(10);callback({status:STATUS.UNKNOW});}).get(0).click();"
	        }, 
	        {
	            "url": "http://@shopName.tmall.com/search.htm?spm=a1z10.5-b.w5842-9363500331.1.qThoFI&search=y", 
	            "desc": "打开店内商品列表页", 
	            "define": "", 
	            "script": "/*$(\"div.navs a.navlist3\").removeAttr(\"target\");$(\"div.navs a.navlist3\").click(function(){ callback({status:STATUS.UNKNOW});}).get(0).click();*/"
	        }, 
	        {
	            "url": "#", 
	            "desc": "随机打开4个商品，浏览时间大概4分钟", 
	            "define": "", 
	            "script": "var p = $(\"a.item-name\");p.each(function(){ $(this).attr(\"target\", \"_blank\");});var json = {};var jsList = [];var list = getRandom(p,4);for(var i=0; i<list.length; i++){ p.get(list[i]).click(); jsList.push(p.eq(list[i]).attr(\"href\")); sleep(10*(i+1));}json.url = jsList;go(9);"
	        }, 
	        {
	            "url": "#", 
	            "desc": "购物流程已暂停。需要人工介入，请跟客服聊天，聊天完毕之后，请点击继续按钮，流程继续。", 
	            "define": "", 
	            "script": "pause(\"在线客服聊天\");"
	        }
	    ], 
	    "product": [
	        {
	            "url": "@productUrl", 
	            "desc": "打开要购买的商品", 
	            "define": "", 
	            "script": "document.cookie = \"cart=\" + $(\"a.sn-cart-link\").text().replace(/[^\\d]/g, \"\") + \";\";$(\"div.tb-btn-basket a\").click(function(){ callback({status:STATUS.UNKNOW,delay:5000});}).get(0).click();"
	        }, 
	        {
	            "url": "#", 
	            "desc": "加入购物车", 
	            "define": "", 
	            "script": "var list = document.cookie.split(\";\");for(var i=0; i<list.length; i++){ var str = list[i].split(\"=\"); if(str[0].replace(/(^\\s)*|(\\s$)*/g, \"\") == \"cart\"){ if($(\"a.sn-cart-link\").text().replace(/[^\\d]/g, \"\") > str[1].replace(/(^\\s)*|(\\s$)*/g, \"\")){ callback({status:STATUS.UNKNOW}); }else{ callback({status:STATUS.FAIL}); } }}"
	        }
	    ], 
	    "steps": [
	        {
	            "url": "http://cart.tmall.com/cart.htm", 
	            "desc": "查看购物车，准备结算。", 
	            "define": "", 
	            "script": "$(\"input.J_CheckBoxItem\").first().click();$.wait(function(){ return $(\"#J_Go\").is(\":enabled\"); }).done(function(){ $(\"#J_Go\").click(function(){ callback({statue:STATUS.UNKNOW}); }).get(0).click();}).fail(function(){ callback({status:STATUS.FAIL,message:\"Wait timeout\"});});"
	        }, 
	        {
	            "url": "#", 
	            "desc": "提交订单。", 
	            "define": "", 
	            "script": "$.wait(function(){return $(\"#J_Go\").is(\":enabled\"); }).done(function(){ $(\"#J_Go\").click(function(){ callback({statue:STATUS.UNKNOW}); }).get(0).click();}).fail(function(){callback({status:STATUS.FAIL,message:\"Wait timeout\"});});"
	        }, 
	        {
	            "url": "#", 
	            "desc": "购物流程已暂停。需要人工介入，请支付，支付完成后，请点击继续，流程自动结束完成。", 
	            "define": "", 
	            "script": "pause(\"支付\");"
	        }
	    ], 
	    "local": "function getRandom(e,n){ var list = []; if(e.length < n){ n = e.length; } while(list.length < n){ var bl = true; var r = Math.floor(Math.random() * e.length); for(var i=0; i<list.length; i++){ if(list[i] == r){ bl = false; } } if(bl){ list.push(r); } } return list;}", 
	    "flowDesc": [
	        {
	            "index": "0", 
	            "desc": "搜索商品"
	        }, 
	        {
	            "index": "1", 
	            "desc": "按类别筛选商品"
	        }, 
	        {
	            "index": "2", 
	            "desc": "按价格筛选商品"
	        }, 
	        {
	            "index": "3", 
	            "desc": "随机浏览4个商品"
	        }, 
	        {
	            "index": "4", 
	            "desc": "浏览商品"
	        }, 
	        {
	            "index": "5", 
	            "desc": "进入店铺"
	        }, 
	        {
	            "index": "6", 
	            "desc": "打开店内商品列表页"
	        }, 
	        {
	            "index": "7", 
	            "desc": "随机浏览4个商品"
	        }, 
	        {
	            "index": "8", 
	            "desc": "在线客服聊天"
	        }, 
	        {
	            "index": "9", 
	            "desc": "添加购物车"
	        }, 
	        {
	            "index": "10", 
	            "desc": "查看购物车"
	        }, 
	        {
	            "index": "11", 
	            "desc": "提交订单"
	        }, 
	        {
	            "index": "12", 
	            "desc": "支付"
	        }
	    ]
	};
}