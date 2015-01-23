'use strict';
//request 拦截器，为http请求加上header信息
app.factory('sessionInjector',  function(){
	return {
      request: function (config) {
          //如果User Session信息已经保存了，包在request的header发回去给服务器
          if (angular.isObject(app.userSession)) {            
            config.headers['user-session-token'] = app.userSession.Tokan;
          }                    
          return config;
      }
    };
});
//Promise Get的公共请求方式
app.factory('promiseGet', ['$http','$q', function($http,$q){
	return function(url){
		var deferred = $q.defer();
		$http.get(url)
		.success(function(result){
			if(angular.isUndefined(result.code)){
				deferred.resolve(angular.fromJson(result));	
			}else{			
				deferred.reject(result);
			}
		})
		.error(function(reason){
			deferred.reject(reason);
		});
		return deferred.promise;
	};
}]);
//Promise Post的公共请求方式
app.factory('promisePost', ['$http','$q', function($http,$q){
	return function(url,para){
		var deferred = $q.defer();
		$http.post(url,para)
		.success(function(result){
			if(angular.isUndefined(result.code)){
				deferred.resolve(angular.fromJson(result));	
			}else{			
				deferred.reject(result);
			}
		})
		.error(function(reason){
			deferred.reject(reason);
		});
		return deferred.promise;
	};
}]);
//Promise Put的公共请求方式
app.factory('promisePut', ['$http','$q', function($http,$q){
	return function(url,para){
		var deferred = $q.defer();
		$http.put(url,para)
		.success(function(result){
			if(angular.isUndefined(result.code)){
				deferred.resolve(angular.fromJson(result));	
			}else{			
				deferred.reject(result);
			}
		})
		.error(function(reason){
			deferred.reject(reason);
		});
		return deferred.promise;
	};
}]);
//restAPI Get的公共请求方式
app.factory('restAPIGet', ['$resource', function($resource){
	return function(url){
		return $resource(url);
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
					"PlatformId" : 1, 
					"shopId" : -1, 
					"taskTypeId" : 1,
					"productId" : -1,
					"productPrice" : 0,
					"totalTasks" : 1,
					"taskDetail" : {
						"currItem" : "app.task.item1",
						"flowItem" : ['app.task.item1','app.task.item2','app.task.item3','app.task.item4','app.task.item5','app.task.item6'],
						"totalTasks" : "",
						"productCount" : 1,
						"searchProductKeywords" : [{"keyword":"", "orderQuantity":"", "prodcutCategory1" : "", "prodcutCategory2" : "", "prodcutCategory3" : "", "prodcutCategory4" : ""}],
						"searchMinPrice" : "",
						"searchMaxPrice" : "",
						"searchProductLocation" : "",
						"payedAddProduct" : false,
						"freePostage" : false,
						"orderQuantity" : "",
						"pcOrderQuantity" : "",
						"padOrderQuantity" : "",					
						"orderMessages" : [""],
						"agreeFastRefunds" : false,
						"fastDonePoint" : -1,
						"agreeAddtionPoint" : false,
						"addtionPoint" : "",
						"agreePriorityReview" : false,
						"agreeQualityPraise" : false,
						"praiseKeywords" : ["","",""],
						"paymentPiont" : false,
						"paymentDeposit" : false,
						"paymentBank" : false,
						"shopName" : "",
						"totalCash" : 0,
						"totalPoint" : 0
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
		login : function(email, password){
			//TODO: 用户登录, 返回USERID, SESSIONTOTAN
			var para = { "login" : email, "password" : password };
			return promisePost('http://mc-ubuntu2.cloudapp.net/user/login',para);
		},
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
//UserBank 对象数据交互 Service
app.factory('userBanks',['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		get : function(userId, bankType){
			//TODO: 获取一条User Bank记录，根据userid 和 banktype
			return promiseGet('http://mc-ubuntu2.cloudapp.net/userBank/find?userId=' + userId + '&bankType=' + bankType);
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
			      "Ccity": "", 
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
					    "province": "", 
					    "city": "", 
					    "district": "", 
					    "shreetAddress": "", 
					    "phone": "", 
					    "screenshot": ""
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
					    "district": ""
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