
angular.module('app').directive('labelColor', function(){
  return function(scope, $el, attrs){
    $el.css({'color': attrs.color});
  }
});

angular.module('app').directive('provincedropdown', function(){
  return {
  	restrict:'E',
  	replace:true,
  	template: '<select ng-model="province" ng-options="p for p in provinces">' 
  			+ '<option value="">请选择省份</option>'
  			+ '</select>',
  	link : function(scope, element, attrs){
  		scope.province = "";
  		scope.provinces = [];
  		function init(){
  			angular.forEach(citydata.citylist,function(item){
  				scope.provinces.push(item.p);
  			});
  			scope.province = attrs.value;
  		};
  		init();
  	}
  };
});

angular.module('app').directive('citydropdown', function(){
  return {
  	restrict:'E',
  	replace:true,
  	template: '<select ng-model="city" ng-options="c for c in citys">' 
  			+ '<option value="">请选择城市</option>'
  			+ '</select>',
  	link : function(scope, element, attrs){
  		scope.province = "";
  		scope.city = "";
  		scope.citys = [];
  		function init(){
  			scope.province = attrs.province;
  			load();
  			scope.city = attrs.value;  						
  		};
  		function load(){
  			scope.citys = [];
  			angular.forEach(citydata.citylist,function(pItem){
  				if(pItem.p == scope.province){
  					angular.forEach(pItem.c,function(cItem){
  						scope.citys.push(cItem.n);
  					});
  				}
  			});
  		};
  		scope.$watch('province',function(){
		    load();
		}); 
		init();
  	}
  };
});

angular.module('app').directive('districtdropdown', function(){
  return {
  	restrict:'E',
  	replace:true,
  	template: '<select ng-model="district" ng-options="d for d in districts">' 
  			+ '<option value="">请选择区域</option>'
  			+ '</select>',
  	link : function(scope, element, attrs){
  		scope.province = "";
  		scope.city = "";
  		scope.district = "";
  		scope.districts = [];
  		function init(){
  			scope.province = attrs.province;
  			scope.city = attrs.city;
  			load();
  			scope.district = attrs.value;
  		};
  		function load(){
  			scope.districts = [];
  			angular.forEach(citydata.citylist,function(pItem){
  				if(pItem.p == scope.province){
  					angular.forEach(pItem.c,function(cItem){
  						if(cItem.n == scope.city){
		  					angular.forEach(cItem.a,function(dItem){
		  						scope.districts.push(dItem.s);
		  					});
		  				}
  					});
  				}
  			});
  		};
  		scope.$watch('province',function(){
		    scope.districts = [];
		});
		scope.$watch('city',function(){
		    load();
		});
  		init();
  	}
  };
});