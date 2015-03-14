
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
	/*买手接手，添加记录*/
	this.addTaskBuyer = function(taskBuyer,succCallBack,errCallBack){
		ajaxPost(getGlobalConfig().API.HOST + '/TaskBuyer', taskBuyer,				
			function success(data,status,xhr){	
				if(typeof errCallBack == 'function'){
					succCallBack(data);
				}				
			},function error(reason){
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
				if(typeof errCallBack == 'function'){
					succCallBack(data);
				}				
			},function error(reason){
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
