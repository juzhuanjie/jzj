
'use strict';

/*
** 资金管理页面相关的Controller
*/
//交易历史 controller
app.controller('TransHistoryCtrl',['$scope','transactions',function($scope,transactions){
  var userId = app.userSession.userId;
  $scope.transList = [];
  $scope.$watch('$viewContentLoaded',function(){  
    loadTransHistory(1,15);
    queryCount();
  });
  $scope.downloadCSV = function(){
    transactions.downloadCSV(userId);
  };
  $scope.$on('pageChanged',function(event,data){
      loadTransHistory(data.currentPage,data.pageSize);
  });
  var loadTransHistory = function(currentPage,pageSize){    
    transactions.get(userId,currentPage,pageSize).then(function(result){
      $scope.transList = result;
      //$scope.$broadcast('resultsLoaded', result);
    });
  };
  var queryCount = function(){
    transactions.queryCount().then(function(result){
      $scope.$broadcast('resultsLoaded', result);
    });
  };
}]);
//变现历史 controller
app.controller('Points2cashHistoryCtrl',['$scope','points2cashs',function($scope,points2cashs){
  var userId = app.userSession.userId;
  $scope.points2cashList = [];
  $scope.$watch('$viewContentLoaded',function(){  
    loadPoints2cashHistory(1,15);
    queryCount();
  });
  $scope.$on('pageChanged',function(event,data){
      loadPoints2cashHistory(data.currentPage,data.pageSize);
  });
  var loadPoints2cashHistory = function(currentPage,pageSize){    
    points2cashs.get(userId,currentPage,pageSize).then(function(result){
      $scope.points2cashList = result;
    });
  };
  var queryCount = function(){
    points2cashs.queryCount().then(function(result){
      $scope.$broadcast('resultsLoaded', result);
    });
  };
}]);
//充值历史 controller
app.controller('RechargeHistoryCtrl',['$scope','recharges',function($scope,recharges){
  var userId = app.userSession.userId;
  $scope.rechargeList = [];
  $scope.$watch('$viewContentLoaded',function(){  
    loadRechargeHistory(1,15);
    queryCount();
  });
  $scope.$on('pageChanged',function(event,data){
      loadRechargeHistory(data.currentPage,data.pageSize);
  });
  var loadRechargeHistory = function(currentPage,pageSize){    
    recharges.get(userId,currentPage,pageSize).then(function(result){
      $scope.rechargeList = result;
    });
  };
  var queryCount = function(){
    recharges.queryCount().then(function(result){
      $scope.$broadcast('resultsLoaded', result);
    });
  };
}]);
//提现现金记录
app.controller('CashoutHistoryCtrl',['$scope','cashouts',function($scope,cashouts){
  var userId = app.userSession.userId;
  $scope.cashoutList = [];
  $scope.$watch('$viewContentLoaded',function(){  
    loadCashoutHistory(1,15);
    queryCount();
  });
  $scope.$on('pageChanged',function(event,data){
      loadCashoutHistory(data.currentPage,data.pageSize);
  });
  var loadCashoutHistory = function(currentPage,pageSize){    
    cashouts.get(userId,currentPage,pageSize).then(function(result){
      $scope.cashoutList = result;
    });
  };
  var queryCount = function(){
    cashouts.queryCount().then(function(result){
      $scope.$broadcast('resultsLoaded', result);
    });
  };
}]);
//充值 controller
app.controller('RechargeCtrl',['$scope','recharges','bankTypes','toaster','userBanks',function($scope,recharges,bankTypes,toaster,userBanks){
  var userId = app.userSession.userId;
  $scope.isBindUserBank = false; 
  $scope.bankTypeList = [];
  $scope.userBankList = [];
  $scope.bankType = "";
  $scope.point = {};
  $scope.cash = {};
  $scope.deposit = {};
  $scope.payPassword = "";
  $scope.$watch('$viewContentLoaded',function(){  
    $scope.point = recharges.newEmpty();
    $scope.cash = recharges.newEmpty();
    $scope.deposit = recharges.newEmpty();
    //TODO: 获取提现账号绑定信息
    $scope.bankTypeList = bankTypes.getAll();
     userBanks.query(userId).then(function(result){
      $scope.userBankList = result;
      if($scope.userBankList.length > 0){
        $scope.isBindUserBank = true; 
      }
    });
  });
  //充值赚点
  $scope.rechargePoint = function(){
    $scope.point.userId = userId;
    $scope.point.isFrozen = false;
    $scope.point.type = 4;    
    $scope.point.bankType = $scope.bankType;    
    recharges.add($scope.point).then(function(result){
      toaster.pop('success', '充值赚点', result);
    },function(reason){
      toaster.pop('error', '充值赚点', reason);
    });
  };
  //充值现金
  $scope.rechargeCash = function(){
    $scope.cash.userId = userId;
    $scope.cash.isFrozen = false;
    $scope.cash.points = 0;
    $scope.cash.type = 2;
    $scope.cash.bankType = $scope.bankType;    
    recharges.add($scope.cash).then(function(result){
      toaster.pop('success', '充值现金', result);
    },function(reason){
      toaster.pop('error', '充值现金', reason);
    });
  };
  //充值押金
  $scope.rechargeDeposit = function(){
    $scope.deposit.userId = userId;
    $scope.deposit.isFrozen = true;
    $scope.deposit.points = 0;
    $scope.deposit.type = 3;
    $scope.deposit.bankType = $scope.bankType;    
    recharges.add($scope.deposit).then(function(result){
      toaster.pop('success', '充值押金', result);
    },function(reason){
      toaster.pop('error', '充值押金', reason);
    });
  };
  $scope.getBankName = function(bankType){
    var bankName = "";
    angular.forEach($scope.bankTypeList,function(value){
      if(value.id == bankType){
        bankName = value.name;
      }
    });
    return bankName;
  };
}]);
//提现现金 controller
app.controller('CashoutCtrl',['$scope','cashouts','points2cashs','userBanks','bankTypes','balances','toaster',function($scope,cashouts,points2cashs,userBanks,bankTypes,balances,toaster){
	var userId = app.userSession.userId;
  $scope.cashout = {}; 
  $scope.points2cash = {}; 
  $scope.isBindUserBank = false; 
  $scope.bankTypeList = [];
  $scope.userBankList = [];
  $scope.userBankId = -1;
  $scope.payPassword = "";
  $scope.totalCashs = 0;
  $scope.totalPoints = 0;
  $scope.transPoints = 0;
  $scope.transCashs = 0;
  $scope.isVisibelPoints2cash = false;
  $scope.$watch('$viewContentLoaded',function(){  
    $scope.cashout = cashouts.newEmpty(); 
    $scope.points2cash = points2cashs.newEmpty(); 
    //TODO: 获取所有的用户银行类型    
    $scope.bankTypeList = bankTypes.getAll();
    //TODO: 获取提现账号绑定信息
    userBanks.query(userId).then(function(result){
      $scope.userBankList = result;
      if($scope.userBankList.length > 0){
        $scope.isBindUserBank = true; 
      }
    });
    getBalance();
  });
  var getBalance = function(){
    //TODO: 获取可提现金额
    balances.get(userId).then(function(result){
      $scope.totalCashs = result.cash;
      $scope.totalPoints = result.points;
    });    
  };
  $scope.getBankName = function(bankType){
    var bankName = "";
    angular.forEach($scope.bankTypeList,function(value){
      if(value.id == bankType){
        bankName = value.name;
      }
    });
    return bankName;
  };
  $scope.showPoints2cash = function(){
    $scope.isVisibelPoints2cash = true;
  };
  $scope.countPoints2cashFee = function(){
    $scope.points2cash.points = $scope.transPoints;
    $scope.points2cash.fee = parseInt($scope.points2cash.points) * 0.05;
    $scope.points2cash.amount = parseInt($scope.points2cash.points) * (1 - 0.05);
  };  
  $scope.submitPoints2cash = function(){
    $scope.points2cash.userId = userId;
    $scope.points2cash.type = 5; //变现
    points2cashs.add($scope.points2cash).then(function(result){
      getBalance();
      $scope.isVisibelPoints2cash = false;
      toaster.pop('success', '申请变现', result);
    },function(reason){
      toaster.pop('error', '申请变现', reason);
    });
  };
  $scope.cancelPoints2cash = function(){
    $scope.isVisibelPoints2cash = false;
  };
  $scope.countCashoutFee = function(){
    $scope.cashout.points = $scope.transCashs;
    $scope.cashout.fee = parseInt($scope.cashout.points) * 0.003;
    $scope.cashout.amount = parseInt($scope.cashout.points) * (1 - 0.05);
  };
  $scope.submitCashout = function(){
    if($scope.payPassword == ''){
      toaster.pop('error', '申请提现', '请填写支付密码');
      return;
    }
    balances.checkPayPassword($scope.payPassword).then(function(result){
      if(angular.isObject(result) && result.result == true){
        $scope.cashout.userId = userId;
        $scope.cashout.userBankId = $scope.userBankId;
        $scope.cashout.type = 1; //提现
        cashouts.add($scope.cashout).then(function(result){
          getBalance();
          toaster.pop('success', '申请提现', result);
        },function(reason){
          toaster.pop('error', '申请提现', reason);
        });
      }else{
        toaster.pop('error', '申请提现', '支付密码不正确');
      }
    });    
  };
}]);
//分页 controller
app.controller('PaginationCtrl',['$scope', function($scope){
    $scope.pageSize = 15;
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
        $scope.totalItems = parseInt(data.count);
    });
}]);