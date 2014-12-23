'use strict';

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

app.factory('restAPIGet', ['$resource', function($resource){
	return function(url){
		return $resource(url);
	};
}]);

app.factory('restAPIPost', ['$resource', function($resource){
	return function(url,para){
		return $resource(url, para);
	};
}]);

app.factory('AccountProfileService', ['promisePost','promiseGet', function(promisePost,promiseGet){
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

app.factory('AccountCashoutService', ['promisePost','promiseGet',function(promisePost,promiseGet){
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