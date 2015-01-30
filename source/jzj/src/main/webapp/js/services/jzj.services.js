'use strict';
//分页 ctrl
app.controller('PaginationCtrl',['$scope','$timeout', function($scope,$timeout){
  $scope.pageSize = 20;
  $scope.maxSize = 10;
  $scope.totalItems = 10;
  $scope.currentPage = 1;
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };
  $scope.pageChanged = function(pageNo) {
    $scope.$emit('pageChanged', {"currentPage" : pageNo, "pageSize" : $scope.pageSize});
  };
  $scope.$on('resultsLoaded',function(event,data){
     //$scope.totalItems = 0;
     //timeout(data);
  });
  var timeout = function(data){
    $timeout(function(){
        $scope.totalItems = data.totalItems;
        $scope.currentPage = data.currentPage; 
    },100);
  };
}]);
//request 拦截器，为http请求加上header信息
app.factory('sessionInjector', ['toaster', function(toaster){
	return {
      request: function (config) {
          //如果User Session信息已经保存了，包在request的header发回去给服务器
          if (angular.isObject(app.userSession)) {            
            //config.headers['token'] = app.userSession.Tokan;
            config.headers['token'] = '123';
          }                    
          return config;
      },
      response:function(response) {            
            switch (response.status) {            	
                case (200):
                	//console.log(response.headers('token'));                	
                	
                    if(angular.isObject(response.data)){
                		
                	}
                    break;
                case (500):
                    toaster.pop('error', 'Server Error', "服务器系统内部错误");
                    break;
                case (401):
                    toaster.pop('error', 'Server Error', "未登录");
                    break;
                case (403):
                    toaster.pop('error', 'Server Error', "无权限执行此操作");
                    break;
                case (408):
                    toaster.pop('error', 'Server Error', "请求超时");
                    break;
                default:
                    toaster.pop('error', 'Server Error', "未知错误");
            }
            return response;
        }
    };
}]);
//Promise Get的公共请求方式
app.factory('promiseGet', ['$http','$q','toaster','$location', function($http,$q,toaster,$location){
	return function(url){
		var deferred = $q.defer();
		$http.get(url)
		.success(function(result){
			if(angular.isDefined(result.code)){				
				if(result.code == 'access_notloggedin'){
					$location.path("/access/signin");
				}
				deferred.reject(result);
			}
			else if(angular.isObject(result)){
				deferred.resolve(angular.fromJson(result));	
			}else{			
				deferred.resolve(result);
			}
		})
		.error(function(reason){
			var reasonObj = angular.fromJson(reason);
			if(angular.isDefined(reasonObj)){
				if(reasonObj.code == 'access_notloggedin'){
					$location.path("/access/signin");
				}
			}else{
				toaster.pop('error', 'Server Error', reason);	
			}						
			deferred.reject(reason);
		});
		return deferred.promise;
	};
}]);
//Promise Post的公共请求方式
app.factory('promisePost', ['$http','$q','toaster','$location', function($http,$q,toaster,$location){
	return function(url,para){
		var deferred = $q.defer();
		$http.post(url,para)
		.success(function(result){
			if(angular.isDefined(result.code)){
				if(result.code == 'access_notloggedin'){
					$location.path("/access/signin");
				}
				deferred.reject(result);
			}
			else if(angular.isObject(result)){
				deferred.resolve(angular.fromJson(result));	
			}else{			
				deferred.resolve(result);
			}
		})
		.error(function(reason){
			var reasonObj = angular.fromJson(reason);
			if(angular.isDefined(reasonObj)){
				if(reasonObj.code == 'access_notloggedin'){
					$location.path("/access/signin");
				}
			}
			else{
				toaster.pop('error', 'Server Error', reason);	
			}
			deferred.reject(reason);
		});
		return deferred.promise;
	};
}]);
//Promise Put的公共请求方式
app.factory('promisePut', ['$http','$q','toaster','$location', function($http,$q,toaster,$location){
	return function(url,para){
		var deferred = $q.defer();
		$http.put(url,para)
		.success(function(result){
			if(angular.isDefined(result.code)){
				if(result.code == 'access_notloggedin'){
					$location.path("/access/signin");
				}
				deferred.reject(result);
			}
			else if(angular.isObject(result)){
				deferred.resolve(angular.fromJson(result));	
			}else{			
				deferred.resolve(result);
			}
		})
		.error(function(reason){
			var reasonObj = angular.fromJson(reason);
			if(angular.isDefined(reasonObj)){
				if(reasonObj.code == 'access_notloggedin'){
					$location.path("/access/signin");
				}
			}
			else{
				toaster.pop('error', 'Server Error', reason);	
			}
			deferred.reject(reason);
		});
		return deferred.promise;
	};
}]);
//restAPI Get的公共请求方式
app.factory('restAPIGet', ['$resource', function($resource){
	return function(url){
		return $resource(url).get();
	};
}]);
//restAPI Post的公共请求方式
app.factory('restAPIPost', ['$resource', function($resource){
	return function(url,para){
		return $resource(url, para);
	};
}]);
//平台操作Service
app.factory('platforms', ['promisePost','promiseGet',function(promisePost,promiseGet){
	var platformList = [
			    {id : 1, name: '淘宝', filter:'taobao', color:'#23b7e5', active : false},
			    {id : 2, name: '天猫', filter:'tmall', color:'#7266ba', active : false},
			    {id : 3, name: '京东', filter:'jd', color:'#fad733', active : false},
			    {id : 4, name: '当当', filter:'dangdang', color:'#27c24c', active : false},
			    {id : 5, name: '亚马逊', filter:'amazon', color:'#fad733', active : false},
			    {id : 6, name: '一号店', filter:'yhd', color:'#23b7e5', active : false}
			  ];
	return {
		getAll : function(){
			//TODO: 获取所有平台，这个需要跟数据库对应，写死的就好
			return platformList;
		},
		getDefault : function(){
			return {id : 1, name: '淘宝', filter:'taobao', color:'#23b7e5', active : false};
		},
		getAllWithShopCount : function(){
			//TODO: 需要从后台的API来获取
			return [
			    {id : 1, name: '淘宝', count : 3},
			    {id : 2, name: '天猫', count : 2},
			    {id : 3, name: '京东', count : 1},
			    {id : 4, name: '当当', count : 0},
			    {id : 5, name: '亚马逊', count : 0},
			    {id : 6, name: '一号店', count : 0}
			  ];
		},
		getPlatformName : function(platformId){
			var name = "";
			angular.forEach(platformList,function(value){
				if(value.id == platformId){
					name = value.name;
				}
			});
			return name;
		}		
	};
}]);
//不同平台的任务类型
app.factory('taskTypes',['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		//TODO: 根据平台查询任务类型
		query : function(platformId){
			return [
				{id : 1, name : "文字好评订单", point : 10.5},
				{id : 2, name : "图文好评订单", point : 14.5},
				{id : 3, name : "聚划算", point : 10.5},
				{id : 4, name : "直通车订单", point : 10.5}
			];
		},
		//获取所有的任务类型
		getAll : function(){
			return [
				{id : 1, name : "文字好评订单", point : 10.5},
				{id : 2, name : "图文好评订单", point : 14.5},
				{id : 3, name : "聚划算", point : 10.5},
				{id : 4, name : "直通车订单", point : 10.5}
			];
		}
	};
}]);
//终端
app.factory('terminals',['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		getAll : function(){
			return [
				{id : 1, name : "电脑"},
				{id : 2, name : "手机/Pad"}
			];
		}
	};
}]);
//终端
app.factory('taskStatuss',['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		getAll : function(){
			return [
				{id : 1, name : "已完成"},
				{id : 2, name : "未发布"},
				{id : 3, name : "待处理"},
				{id : 4, name : "进行中"},
				{id : 5, name : "已发布"}
			];
		}	
	};
}]);
//任务流程 Service
app.factory('flowDatas',function(){
	var flowData = null;
	return {
		create : function(platformId){
			var taobao = { 		
					"taskId" : -1,	
					"status" : 2,		
					"platformId" : 1, 
					"shopId" : -1, 
					"taskTypeId" : 1,
					"productId" : -1,
					"productPrice" : 0,
					"totalTasks" : 1,					
				    "commission": 0,
				    "bonus": 0,
				    "terminal": null,
				    "approvalPriority": 0,
				    "taskPriority": 0,
				    "includeShipping": 0,
					"taskDetail" : {
						"currItem" : "app.task.item1",
						"flowItem" : ['app.task.item1','app.task.item2','app.task.item3','app.task.item4','app.task.item5','app.task.item6'],
						"taskId" : -1,
						"status" : 2,
						"platformId" : 1, 
						"shopId" : -1, 
						"shopName" : "",
						"taskTypeId" : 1,
						"productId" : -1,
						"productPrice" : 0, 
						"productCount" : 1,
						"searchProductKeywords" : [{"keyword":"", "totalTasks":"", "prodcutCategory1" : "", "prodcutCategory2" : "", "prodcutCategory3" : "", "prodcutCategory4" : ""}],
						"searchMinPrice" : "",
						"searchMaxPrice" : "",
						"searchProductLocation" : "",
						"includeShipping" : false,
						"totalTasks" : "",					
						"orderMessages" : [""],
						"agreeFastRefunds" : false,
						"taskPriority" : -1,
						"agreeBonus" : false,
						"bonus" : 0,
						"agreeApprovalPriority" : false,
						"agreeQualityPraise" : false,
						"praiseKeywords" : ["","",""],
						"paymentPiont" : false,
						"paymentDeposit" : false,
						"paymentBank" : false
					}					
				};
			var tmall = { "platformId" : 1, "shopId" : 1, "taskTypeId" : 1 };
			var jd = { "platformId" : 1, "shopId" : 1, "taskTypeId" : 1 };
			var yhd = { "platformId" : 1, "shopId" : 1, "taskTypeId" : 1 };
			var dangdang = { "platformId" : 1, "shopId" : 1, "taskTypeId" : 1 };
			var amazon = { "platformId" : 1, "shopId" : 1, "taskTypeId" : 1 };
			var model;
			switch(platformId){
				case 1:
					model = taobao;
					break;
				case 2:
					model = tmall;
					break;
				case 3:
					model = jd;
					break;
				case 4:
					model = dangdang;
					break;
				case 5:
					model = amazon;
					break;
				case 6:
					model = yhd;
					break;				
				default:
					model = taobao;
					break;
			}
			return model;
		},
		get : function(){
			return flowData;
		},
		set : function(data){
			flowData = data;
		}
	};
});
//ShopTast 对象数据交互 Service
app.factory('tasks', ['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		add : function(shopTask){
			return promisePost('http://mc-ubuntu2.cloudapp.net/shopTask', shopTask);	
		},
		save : function(taskId,shopTask){
			return promisePost('http://mc-ubuntu2.cloudapp.net/shopTask/' + taskId, shopTask);
		},
		queryByStatus : function(statusId){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/shopTask/find?status=' + statusId);
		},
		queryByPlatform : function(platformId){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/shopTask/find?PlatformId=' + platformId);
		},
		filter : function(statusId,condition){
			var queryPara = 'find?status=' + statusId;
			if(angular.isDefined(condition.platformId) && condition.platformId != -1){
				queryPara += '&PlatformId=' + condition.platformId;
			}
			if(angular.isDefined(condition.shopId) && condition.shopId != -1){
				queryPara += '&shopId=' + condition.shopId;
			}
			if(angular.isDefined(condition.taskTypeId) && condition.taskTypeId != -1){
				queryPara += '&taskTypeId=' + condition.taskTypeId;
			}
			return promiseGet('http://mc-ubuntu2.cloudapp.net/shopTask/' + queryPara);
		},
		get : function(taksId){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/shopTask/' + taksId);
		},
		statsShopOrderCount : function(shopId){
			//TODO: 统计店铺最近发布任务的单数
			return 1;
		}		
	};
}]);
//ShopProduct 对象数据交互 Service
app.factory('products', ['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		add : function(product){
			return promisePost('http://mc-ubuntu2.cloudapp.net/shopProduct', product);	
		},
		get : function(productId){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/shopProduct?id=' + productId);
		},
		save : function(productId,product){
			return promisePost('http://mc-ubuntu2.cloudapp.net/shopProduct/' + productId, product);
		},
		newEmpty : function(){
			return {
				"productId" : -1,
				"shopId" : -1,
				"productName" : "",
				"productLink" : "",
				"productDesc" : { "color" : "", "size" : ""},
				"productPrice" : 0,
				"productPrice2" : "",
				"productImage" : ""
			};
		}		
	};
}]);
//User 对象数据交互 Service
app.factory('users', ['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		// login : function(email, password){
		// 	//TODO: 用户登录, 返回USERID, SESSIONTOTAN
		// 	var para = { "login" : email, "password" : password };
		// 	return promisePost('http://mc-ubuntu2.cloudapp.net/user/login',para);
		// },
		logout : function(){
			//TODO: 退出登录
								
		},
		get : function(userId){
			//TODO: 获取用户信息，根据userid
			return promiseGet('http://mc-ubuntu2.cloudapp.net/user?id=' + userId);			
		},
		save : function(userId, user){
			//TODO: 保存用户编辑信息
			return promisePost('http://mc-ubuntu2.cloudapp.net/user/' + userId, user);
		},
		add : function(user){
			//TODO: 添加一个用户
			return promisePost('http://mc-ubuntu2.cloudapp.net/user/create', user);	
		},
		newEmpty : function(){
			return {
		        "userId": -1, 
		        "userType": -1, 
		        "userLogin": "", 
		        "password": "", 
		        "payPassword": "", 
		        "image": "", 
		        "qq": "", 
		        "email": "", 
		        "mobile": "",
		        "wechat": ""
		    };
		}
	};
}]);
//UserBank Type 定义
app.factory('bankTypes',['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		getAll : function (){
			return [
				{id : 1, name : "支付宝"},
				{id : 2, name : "财富通"},
				{id : 3, name : "银行卡"}
			];
		},
		getZFB : function(){
			return {id : 1, name : "支付宝"};
		},
		getCFT : function(){
			return {id : 2, name : "财富通"};
		},
		getYHK : function(){
			return {id : 3, name : "银行卡"};
		}
	};
}]);
//UserBank 对象数据交互 Service
app.factory('userBanks',['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		get : function(userId, bankType){
			//TODO: 获取一条User Bank记录，根据userid 和 banktype
			return promiseGet('http://mc-ubuntu2.cloudapp.net/userBank/find?userId=' + userId + '&bankType=' + bankType);
		},
		query : function(userId){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/userBank/find?userId=' + userId);	
		},
		add : function(userBank){
			//TODO: 添加一条User Bank记录，可以是支付宝，财付通，银行卡等
			return promisePost('http://mc-ubuntu2.cloudapp.net/userBank', userBank);	
		},
		newEmpty : function(bankType){
			//新建一个空对象
			return {
			      "userId": -1, 
			      "userBankId": -1, 
			      "bankType": bankType, 
			      "accountName": "", 
			      "accountNumber": "", 
			      "branch": "", 
			      "City": "", 
			      "screenshot": ""
			};
		}
	};
}]);
//BuyerAccount 对象数据交互 Service
app.factory('buyerAccounts', ['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		get : function(buyerAccountId){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/buyerAccount/'+buyerAccountId);
		},
		query : function(userId, platformId){
			//TODO: 获取买号绑定信息，根据userid和platformid，返回的是一个数组
			return promiseGet('http://mc-ubuntu2.cloudapp.net/buyerAccount/find?userId=' + userId + '&platformId=' + platformId);			
		},
		add : function(buyerAccount){
			//TODO: 添加买号信息
			return promisePost('http://mc-ubuntu2.cloudapp.net/buyerAccount', buyerAccount);
		},
		update : function(buyerAccountId,buyerAccount){
			//TODO: 添加买号信息
			return promisePost('http://mc-ubuntu2.cloudapp.net/buyerAccount/'+buyerAccountId, buyerAccount);
		},
		count : function(userId, platformId){
			//TODO: 统计某个平台下的买号绑定数量，不能拿超过3个
			var para = { "userId" : userId, "platformId" : platformId };
			return 2;
		},
		newEmpty : function(){
			return {
					    "buyerAccountId": -1, 
					    "userId": -1, 
					    "platformId": -1, 
					    "accountLogin": "", 
					    "wangwang": "", 
					    "addressId" : null,
					    "wwScreenshot": ""
					};
		}
	};
}]);
//买手收货地址 Service
app.factory('userAddresses',['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		get : function(addressId){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/useraddress/'+addressId);
		},
		query : function(userId){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/useraddress/find?userId'+userId);	
		},
		add : function(userAddress){
			return promisePost('http://mc-ubuntu2.cloudapp.net/useraddress/', userAddress);
		},
		newEmpty : function(){
			return {
		        "recipient": "",
		        "province": null,
		        "city": null,
		        "district": null,
		        "phone": null,
		        "addressId": -1,
		        "userId": -1,
		        "addressTypeId": null,
		        "streetAddress": "",
		        "postalCode": ""
		    };
		}
	};
}]);
//SellerShop 对象数据交互 Service
app.factory('sellerShops', ['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		get : function(shopId){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/sellerShop/'+shopId);
		},
		query : function(userId, platformId){
			//TODO: 获取店铺绑定信息, 返回的是一个数组
			return promiseGet('http://mc-ubuntu2.cloudapp.net/sellerShop/find?userId=' + userId + '&platformId=' + platformId);	
		},
		getAllShops : function(userId){
			//TODO: 获取店铺绑定信息, 返回的是一个数组
			return promiseGet('http://mc-ubuntu2.cloudapp.net/sellerShop/find?userId=' + userId);	
		},
		add : function(sellerShop){
			//TODO: 添加店铺绑定信息
			return promisePost('http://mc-ubuntu2.cloudapp.net/sellerShop', sellerShop);
		},
		update : function(shopId,sellerShop){
			return promisePost('http://mc-ubuntu2.cloudapp.net/sellerShop/'+shopId, sellerShop);
		},
		count : function(userId, platformId){
			//TODO: 统计某个平台下的店铺绑定数量，不能拿超过3个
			var para = { "userId" : userId, "platformId" : platformId };
			return 2;
		},
		newEmpty : function(){
			return {
					    "shopId": -1, 
					    "userId": -1, 
					    "platformId": -1, 
					    "url": "", 
					    "wangwang": "", 
					    "province": "", 
					    "city": "", 
					    "street": ""
					} ;
		}
	};
}]);
//商品所在地 Service
app.factory('productLocations',function(){
	return {
		getAll : function(){
			return [ "全国"
					,"北京"
					,"上海"
					,"广州"
					,"深圳"
					,"杭州"
					,"海外"
					,"江浙沪"
					,"珠三角"
					,"京津冀" 
					,"东三省"
					,"港澳台"
					,"江浙沪皖"
					,"长沙"
					,"长春"
					,"成都"
					,"重庆"
					,"大连"
					,"东莞"
					,"佛山"
					,"福州"
					,"贵阳"
					,"合肥"
					,"金华"
					,"济南"
					,"嘉兴"
					,"昆明"
					,"宁波"
					,"南昌"
					,"南京"
					,"青岛"
					,"泉州"
					,"沈阳"
					,"苏州"
					,"天津"
					,"温州"
					,"无锡"
					,"武汉"
					,"西安"
					,"厦门"
					,"郑州"
					,"中山"
					,"石家"
					,"哈尔"
					,"安徽"
					,"福建"
					,"广东"
					,"广西"
					,"贵州"
					,"海南"
					,"河北"
					,"河南"
					,"湖北"
					,"湖南"
					,"江苏"
					,"江西"
					,"吉林"
					,"辽宁"
					,"宁夏"
					,"青海"
					,"山东"
					,"山西"
					,"陕西"
					,"云南"
					,"四川"
					,"西藏"
					,"新疆"
					,"浙江"
					,"澳门"
					,"香港"
					,"台湾"
					,"内蒙古"
					,"黑龙江"];
		}
	};
});
//交易状态配置
app.factory('transStatus',function(){
	return {
		getAll : function(){
			return [
				{id : 1, name : "成功"},
				{id : 2, name : "失败"},
				{id : 3, name : "处理中"}
			];
		}
	};
});
//交易状态配置
app.factory('transType',function(){
	return {
		getAll : function(){
			return [
				{id : 1, name : "提现"},				
				{id : 2, name : "充值现金"},
				{id : 3, name : "充值押金"},
				{id : 4, name : "充值赚点"},
				{id : 5, name : "变现"}
			];
		}
	};
});
//提现 Service
app.factory('cashouts',['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		get : function(userId,currentPage,pageSize){			
			return promiseGet('http://mc-ubuntu2.cloudapp.net/cashout/find?userId=' + userId + '&limit=' + pageSize + '&skip=' + currentPage);
		},
		add : function(cashout){
			return promisePost('http://mc-ubuntu2.cloudapp.net/trans/cashout', cashout);
		},
		queryCount : function(){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/query/count/?model=cashout&where={"rechargetypeId":1}');
		},
		newEmpty : function(){
			return {
			    "amount": 0,
			    "points": 0,
			    "fee": 0,
			    "comment": "",
			    "status": 3,
			    "cashoutId": -1,
			    "userId": -1,
			    "cashoutTypeId": 3,
			    "type": 1
			};
		}
	};
}]);
//充值 Service
app.factory('recharges',['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		get : function(userId,currentPage,pageSize){			
			return promiseGet('http://mc-ubuntu2.cloudapp.net/recharge/find?userId=' + userId + '&limit=' + pageSize + '&skip=' + currentPage);
		},
		add : function(recharge){
			return promisePost('http://mc-ubuntu2.cloudapp.net/trans/recharge', recharge);
		},
		queryCount : function(){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/query/count/?model=recharge&where={"rechargetypeId":1}');
		},
		newEmpty : function(){
			return {
			    "amount": 0,
			    "points": 0,
			    "comment": "",
			    "rechargeId": -1,
			    "userId": -1,
			    "rechargeTypeId": 2,
			    "type" : 1,
			    "isFrozen" : false
			};
		}
	};
}]);
//变现 Service
app.factory('points2cashs',['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		get : function(userId,currentPage,pageSize){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/points2cash/find?userId=' + userId + '&limit=' + pageSize + '&skip=' + currentPage);
		},
		add : function(points2cash){
			return promisePost('http://mc-ubuntu2.cloudapp.net/trans/points2cash', points2cash);
		},
		queryCount : function(){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/query/count/?model=points2cash&where={"rechargetypeId":1}');
		},
		newEmpty : function(){
			return {
			    "amount": 0,
			    "points": 0,
			    "fee": 0,
			    "comment": "",
			    "cashoutId": -1,
			    "userId": -1
			};
		}
	};
}]);
//变现 Service
app.factory('transactions',['promisePost','promiseGet','restAPIGet',function(promisePost,promiseGet,restAPIGet){
	return {
		get : function(userId,currentPage,pageSize){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/transaction/find?userId=' + userId + '&limit=' + pageSize + '&skip=' + currentPage);
		},
		downloadCSV : function(userId){
			//TODO: 导出交易记录CSV
			window.open("http://mc-ubuntu2.cloudapp.net/transaction/csv");
		},
		queryCount : function(){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/query/count/?model=transaction&where={"rechargetypeId":1}');
		}
	};
}]);
//余额查询 Service 
app.factory('balances', ['promiseGet','promisePost',function(promiseGet,promisePost){
	return {
		get : function(userId){
			return promiseGet('http://mc-ubuntu2.cloudapp.net/query/balance?userId=' + userId);
		},
		checkPayPassword : function(payPassword){
			return promisePost('http://mc-ubuntu2.cloudapp.net/service/checkPayPassword',{"password":payPassword});
		}
	};
}]);