'use strict';

// controller
app.controller('HomeController', ['$scope', '$state','tasks','taskBuyers','points2cashs','recharges','cashouts', function($scope, $state,tasks,taskBuyers,points2cashs,recharges,cashouts) {
  var userId = app.userSession.userId;
  $scope.$watch('$viewContentLoaded',function(){
    queryFinishTaskCount();
    queryUnpublishTaskCount();
    queryDoingTaskCount();
    queryBuyer1TaskCount();
    queryBuyer2TaskCount();
    queryBuyer3TaskCount();
  });
  $scope.finishTaskCount = 0;
  var queryFinishTaskCount = function(){
    var condition = "{\"status\":1}";
      tasks.queryCount(condition).then(function(result){
        $scope.finishTaskCount = result.count;
      });
  };
  $scope.unpublishTaskCount = 0;
  var queryUnpublishTaskCount = function(){
    var condition = "{\"status\":2}";
      tasks.queryCount(condition).then(function(result){
        $scope.unpublishTaskCount = result.count;
      });
  };
  $scope.doingTaskCount = 0;
  var queryDoingTaskCount = function(){
    var condition = "{\"status\":4}";
      tasks.queryCount(condition).then(function(result){
        $scope.doingTaskCount = result.count;
      });
  };
  $scope.buyer1TaskCount = 0;
  var queryBuyer1TaskCount = function(){
    var condition = "{\"statusId\":1}";
      taskBuyers.queryCount(condition).then(function(result){
        $scope.buyer1TaskCount = result.count;
      });
  };
  $scope.buyer2TaskCount = 0;
  var queryBuyer2TaskCount = function(){
    var condition = "{\"statusId\":2}";
      taskBuyers.queryCount(condition).then(function(result){
        $scope.buyer2TaskCount = result.count;
      });
  };
  $scope.buyer3TaskCount = 0;
  var queryBuyer3TaskCount = function(){
    var condition = "{\"statusId\":3}";
      taskBuyers.queryCount(condition).then(function(result){
        $scope.buyer3TaskCount = result.count;
      });
  };















  $scope.isShowTransHistory = false;
  $scope.transHistoryX = 0;
  $scope.transHistoryY = 0;
  $scope.transHistoryType = "";
  $scope.viewTransHisttory = function($event,type){
    $scope.transHistoryType = type;
    $scope.isShowTransHistory = true;
    $scope.transHistoryX = $event.pageX - 30;
    $scope.transHistoryY = $event.pageY;
    if(type == 'recharge'){
      loadRechargeHistory();
    }else if(type == 'cashout'){    
      loadCashoutHistory();
    }else{
      loadPoints2cashHistory();
    }
  };
  $scope.hideTransHistory = function(){
    $scope.isShowTransHistory = false;
  };
  $scope.rechargeList = [];
  var loadRechargeHistory = function(){    
    recharges.get(1,8).then(function(result){
      $scope.rechargeList = result;
    });
  };
  $scope.points2cashList = [];
  var loadPoints2cashHistory = function(){    
    points2cashs.get(1,8).then(function(result){
      $scope.points2cashList = result;
    });
  };
  $scope.cashoutList = [];
  var loadCashoutHistory = function(){    
    cashouts.get(1,8).then(function(result){
      $scope.cashoutList = result;
    });
  };
}]);

