'use strict';
//request 拦截器，为http请求加上header信息
app.factory('sessionInjector', ['$rootScope', function($rootScope){
	return {
      request: function (config) {
          //如果User Session信息已经保存了，包在request的header发回去给服务器
          if (angular.isObject($rootScope.global.userSession)) {            
            config.headers['user-session-token'] = $rootScope.global.userSession.Tokan;
          }                    
          return config;
      }
    };
}]);
//Promise Get的公共请求方式
app.factory('promiseGet', ['$http','$q', function($http,$q){
	return function(url){
		var deferred = $q.defer();
		$http.get(url)
		.success(function(result){
			if(result.status=='Success'){
				deferred.resolve(angular.fromJson(result.data));	
			}
			else if(result.status=='Error'){
				//TODO: 错误信息处理
				if(result.errorCode==1){
					//TODO： Session错误，跳转到登录页面
				}
				else if(result.status==2){
					//TODO：其他错误，弹出错误消息
				}
				deferred.reject(result.msg);
			}
			else if(result.status == 'Warning'){
				//TODO: 警告信息处理
				deferred.resolve(angular.fromJson(result.data));	
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
			if(result.status=='Success'){
				deferred.resolve(angular.fromJson(result.data));	
			}
			else if(result.status=='Error'){
				//TODO: 错误信息处理
				if(result.errorCode==1){
					//TODO： Session错误，跳转到登录页面
				}
				else if(result.status==2){
					//TODO：其他错误，弹出错误消息
				}
				deferred.reject(result.msg);
			}
			else if(result.status == 'Warning'){
				//TODO: 警告信息处理
				deferred.resolve(angular.fromJson(result.data));	
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
	return {
		getAll : function(){
			//TODO: 获取所有平台，这个需要跟数据库对应，写死的就好
			return [
			    {name: '淘宝', filter:'taobao', color:'#23b7e5'},
			    {name: '天猫', filter:'tmall', color:'#7266ba'},
			    {name: '京东', filter:'jd', color:'#fad733'},
			    {name: '当当', filter:'dangdang', color:'#27c24c'},
			    {name: '亚马逊', filter:'amazon', color:'#fad733'},
			    {name: '一号店', filter:'yhd', color:'#23b7e5'},
			  ];
		}		
	};
}]);
//User 对象数据交互 Service
app.factory('users', ['promisePost','promiseGet','$rootScope','$window',function(promisePost,promiseGet,$rootScope,$window){
	return {
		login : function(email, password){
			//TODO: 用户登录, 返回USERID, SESSIONTOTAN
			var para = { "username" : email, "password" : password };
			//登录成功保存session tokan到浏览器缓存
			var result = { "status" : "Success", "UserId" : 1, "Tokan" : "213541m5n855hf" };
			if(true){
				$window.localStorage.setItem("userSession", angular.toJson(result));
				$rootScope.global.userSession = result;
				return result;
			}else{
				return { "status" : "Error", "msg" : "邮箱或者密码不正确" };
			}
		},
		logout : function(){
			//TODO: 退出登录
			$window.localStorage.removeItem("userSession");
			$rootScope.global.userSession = null;
			//退出成功
			if(true){				
				
				return true;
			}else{
				return false;
			}			
		},
		get : function(userId){
			//TODO: 获取用户信息，根据userid
			return {
					    "UserId": 1, 
					    "UserType": "buyer", 
					    "Username": "moke", 
					    "Password": "bdnacn", 
					    "PayPassword": "bdnacn", 
					    "Image": "", 
					    "Qq": "", 
					    "Email": "moke@bdnacn.com", 
					    "Mobile": "13800138000"
					};
		},
		save : function(user){
			//TODO: 保存用户编辑信息
			return user; 
		},
		add : function(user){
			//TODO: 添加一个用户
			return user; 	
		},
		newEmpty : function(){
			return {
		        "UserId": -1, 
		        "UserType": "", 
		        "Username": "", 
		        "Password": "", 
		        "PayPassword": "", 
		        "Image": "", 
		        "Qq": "", 
		        "Email": "", 
		        "Mobile": ""
		    };
		}
	};
}]);
//UserBank 对象数据交互 Service
app.factory('userBanks',['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		get : function(userId, bankType){
			//TODO: 获取一条User Bank记录，根据userid 和 banktype
			var para = { "userid" : userId, "bankType" : bankType };
			return  {
					    "UserId": 1, 
					    "UserBankId": 2, 
					    "BankType": 0, 
					    "AccountName": "juzhuanjie", 
					    "AccountNumber": "55555888888666666", 
					    "Branch": "", 
					    "City": "", 
					    "Screenshot": ""
					};  
		},
		add : function(userbank){
			//TODO: 添加一条User Bank记录，可以是支付宝，财付通，银行卡等
			return userbank;
		},
		newEmpty : function(bankType){
			//新建一个空对象
			return {
			      "UserId": -1, 
			      "UserBankId": -1, 
			      "BankType": bankType, 
			      "AccountName": "", 
			      "AccountNumber": "", 
			      "Branch": "", 
			      "City": "", 
			      "Screenshot": ""
			};
		}
	};
}]);
//BuyerAccount 对象数据交互 Service
app.factory('buyerAccounts', ['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		get : function(userId, platformId){
			//TODO: 获取买号绑定信息，根据userid和platformid，返回的是一个数组
			var para = { "userId" : userId, "platformId" : platformId };
			return  [
						{
						    "BuyerAccountId": 1, 
						    "UserId": 2, 
						    "PlatformId": 0, 
						    "AccountLogin": "juzhuanjie", 
						    "Wangwang": "55555", 
						    "Province": "", 
						    "City": "", 
						    "District": "", 
						    "ShreetAddress": "", 
						    "Phone": "", 
						    "Screenshot": ""
						} ,
						{
						    "BuyerAccountId": 2, 
						    "UserId": 2, 
						    "PlatformId": 0, 
						    "AccountLogin": "juzhuanjie", 
						    "Wangwang": "6666666", 
						    "Province": "", 
						    "City": "", 
						    "District": "", 
						    "ShreetAddress": "", 
						    "Phone": "", 
						    "Screenshot": ""
						} 
					];
		},
		add : function(buyerAccount){
			//TODO: 添加买号信息
			return buyerAccount;
		},
		count : function(userId, platformId){
			//TODO: 统计某个平台下的买号绑定数量，不能拿超过3个
			var para = { "userId" : userId, "platformId" : platformId };
			return 2;
		}
	};
}]);
//SellerShop 对象数据交互 Service
app.factory('sellerShops', ['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		get : function(userId, platformId){
			//TODO: 获取店铺绑定信息, 返回的是一个数组
			var para = { "userId" : userId, "platformId" : platformId };
			return  [
						{
						    "ShopId": 1, 
						    "UserId": 2, 
						    "PlatformId": 0, 
						    "Url": "http://juzhuanjie.taobao.com", 
						    "Wangwang": "55555", 
						    "Province": "", 
						    "City": "", 
						    "District": ""
						} ,
						{
						    "ShopId": 2, 
						    "UserId": 2, 
						    "PlatformId": 0, 
						    "Url": "http://juzhuanjie.tmall.com", 
						    "Wangwang": "66666666", 
						    "Province": "", 
						    "City": "", 
						    "District": ""
						} 
					];
		},
		add : function(sellerShop){
			//TODO: 添加店铺绑定信息
			return sellerShop;
		},
		count : function(userId, platformId){
			//TODO: 统计某个平台下的店铺绑定数量，不能拿超过3个
			var para = { "userId" : userId, "platformId" : platformId };
			return 2;
		}
	};
}]);