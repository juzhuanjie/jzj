'use strict';
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
				deferred.reject(result.msg);
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
				deferred.reject(result.msg);
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
//账号信息的基本信息Service
app.factory('AccountProfile', ['promisePost','promiseGet', function(promisePost,promiseGet){
	return {
		getSettings : function(para){
			return promisePost('data/account_profile.json',para);
		},
		saveHeadImage : function(para){
			
		},
		saveLoginPassword : function(para){
			
		},
		savePayedPassword : function(para) {
			
		},
		saveQQ : function(para){
			
		},
		saveEmail : function(para){
			
		},
		savePhone : function(para){
			
		}
	};
}]);
//账号信息的提现Service
app.factory('AccountCashout', ['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		getZfbSettings : function(para){
			return promisePost('data/zhifubao.json',para);
		},
		getCftSettings : function(para){
			return promisePost('data/caifutong.json',para);
		},
		getYhSettings : function(para){
			return promisePost('data/yinhang.json',para);
		},
		saveZfbSettings : function(para){
			
		},
		saveCftSettings : function(para){
			
		},	
		saveYhSettings : function(para){
			
		}
	};
}]);
//账号信息的绑定买手Service
app.factory('AccountBuyer', ['promisePost','promiseGet',function(promisePost,promiseGet){
	
}]);
//账号信息的绑定店铺Service
app.factory('AccountSeller', ['promisePost','promiseGet',function(promisePost,promiseGet){
	
}]);
//平台操作Service
app.factory('Platforms', ['promisePost','promiseGet',function(promisePost,promiseGet){
	return {
		getAll : function(){
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