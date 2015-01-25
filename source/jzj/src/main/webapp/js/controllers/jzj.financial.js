
'use strict';

/*
** 资金管理页面相关的Controller
*/
//本金记录 controller
app.controller('CapitalCtrl',['$scope',function($scope){
	$scope.capitalList = [];
	$scope.$watch('$viewContentLoaded',function(){	
		loadCapital();
	});
	$scope.$on('pageChanged',function(event,data){

	});
	var loadCapital = function(){
		$scope.capitalList = [
			{ "createTime" : "2015.1.8 8:30", "income" : "108元", "pay" : "-", "balance" : "-", "remark" : "确认退款，解冻押金" },
			{ "createTime" : "2015.2.8 6:30", "income" : "-", "pay" : "299元", "balance" : "-", "remark" : "购买VIP会员" },
			{ "createTime" : "2015.9.22 8:50", "income" : "178.5元", "pay" : "-", "balance" : "-", "remark" : "" },
			{ "createTime" : "2015.3.22 7:32", "income" : "-", "pay" : "-", "balance" : "500元", "remark" : "" },
			{ "createTime" : "2015.1.22 5:12", "income" : "17元", "pay" : "-", "balance" : "-", "remark" : "" }
		];
	};
}]);
//押金记录 controller
app.controller('DepositCtrl',['$scope',function($scope){

}]);
//佣金记录 controller
app.controller('BrokerageCtrl',['$scope',function($scope){

}]);
//赚点记录 controller
app.controller('PointCtrl',['$scope',function($scope){

}]);
//会员记录 controller
app.controller('MemberCtrl',['$scope',function($scope){

}]);
//提现现金 controller
app.controller('CashoutCtrl',['$scope',function($scope){
	
}]);
//分页 ctrl
controllers.controller('PaginationCtrl',['$scope','$timeout', function($scope,$timeout){
  $scope.pageSize = 20;
  $scope.maxSize = 10;
  $scope.totalItems = 0;
  $scope.currentPage = 1;
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };
  $scope.pageChanged = function(pageNo) {
    $scope.$emit('pageChanged', {"currentPage" : pageNo, "pageSize" : $scope.pageSize});
  };
  $scope.$on('resultsLoaded',function(event,data){
     $scope.totalItems = 0;
     timeout(data);
  });
  var timeout = function(data){
    $timeout(function(){
        $scope.totalItems = data.totalItems;
        $scope.currentPage = data.currentPage; 
    },100);
  };
}]);
