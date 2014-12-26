
angular.module('app').directive('labelColor', function(){
  return function(scope, $el, attrs){
    $el.css({'color': attrs.color});
  }
});

angular.module('app').directive('provincedropdown', function(){
  return {
  	restrict:'E',
  	replace:true,
  	template: '<select ng-model="provinc" ng-options="p for p in provincs">' 
  			+ '<option value="">请选择省份</option>'
  			+ '</select>',
  	link : function(scope, element, attrs){
  		scope.provinc = "";
  		scope.provincs = [];
  		function init(){
  			angular.forEach(citydata.citylist,function(item){
  				scope.provincs.push(item.p);
  			});
  			scope.provinc = attrs.value;
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
  		scope.provinc = "";
  		scope.city = "";
  		scope.citys = [];
  		function init(){
  			scope.provinc = attrs.provinc;
  			load();
  			scope.city = attrs.value;  						
  		};
  		function load(){
  			scope.citys = [];
  			angular.forEach(citydata.citylist,function(pItem){
  				if(pItem.p == scope.provinc){
  					angular.forEach(pItem.c,function(cItem){
  						scope.citys.push(cItem.n);
  					});
  				}
  			});
  		};
  		scope.$watch('provinc',function(){
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
  		scope.provinc = "";
  		scope.city = "";
  		scope.district = "";
  		scope.districts = [];
  		function init(){
  			scope.provinc = attrs.provinc;
  			scope.city = attrs.city;
  			load();
  			scope.district = attrs.value;
  		};
  		function load(){
  			scope.districts = [];
  			angular.forEach(citydata.citylist,function(pItem){
  				if(pItem.p == scope.provinc){
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
  		scope.$watch('provinc',function(){
		    scope.districts = [];
		});
		scope.$watch('city',function(){
		    load();
		});
  		init();
  	}
  };
});