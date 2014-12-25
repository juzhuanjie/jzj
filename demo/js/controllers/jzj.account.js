'use strict';
/*
** 账号信息设置页面相关的Controller
*/
app.controller('AccountProfileCtrl', ['$scope', '$modal','AccountProfile', function($scope, $modal, AccountProfile) {
    $scope.user = {
        "UserId": -1, 
        "UserType": "", 
        "UserName": "", 
        "Password": "", 
        "PayedPassword": "", 
        "Image": "", 
        "Qq": "", 
        "Email": "", 
        "Phone": ""
    };
    $scope.openSetLoginPwd = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_password.html',
        controller: 'SetPwdCtrl',
        resolve: {
          data: function () {
            return { "title": "设置登录密码", "password": $scope.user.Password};
          }
        }
      });
      modalInstance.result.then(function (data) {        
        $scope.user.Password = data;
        AccountProfile.saveLoginPassword({"userId" : 1 ,"password" : data});
      });
    };
    $scope.openSetPayPwd = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_password.html',
        controller: 'SetPwdCtrl',
        resolve: {
          data: function () {
            return { "title": "设置支付密码", "password": $scope.user.PayedPassword};
          }
        }
      });
      modalInstance.result.then(function (data) {    
        $scope.user.PayedPassword = data;    
        AccountProfile.savePayedPassword({"userId" : 1 ,"payedPassword" : $scope.user.PayedPassword});
      });
    };
    $scope.openSetQQ = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_value.html',
        controller: 'SetValueCtrl',
        resolve: {
          data: function () {
            return { "title": "设置QQ账号", "value": $scope.user.Qq};
          }
        }
      });
      modalInstance.result.then(function (data) {    
        $scope.user.Qq = data;    
        AccountProfile.saveQQ({"userId" : 1 ,"qq" : $scope.user.Qq});
      });
    };
    $scope.openSetEmail = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_value.html',
        controller: 'SetValueCtrl',
        resolve: {
          data: function () {
            return { "title": "设置邮箱地址", "value": $scope.user.Email};
          }
        }
      });
      modalInstance.result.then(function (data) {
        $scope.user.Email = data;
        AccountProfile.saveEmail({"userId" : 1 ,"email" : $scope.user.Email});       
      });
    };
    $scope.openSetPhone = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_value.html',
        controller: 'SetValueCtrl',
        resolve: {
          data: function () {
            return { "title": "设置手机号码", "value": $scope.user.Phone};
          }
        }
      });
      modalInstance.result.then(function (data) {  
        $scope.user.Phone = data;      
        AccountProfile.savePhone({"userId" : 1 ,"phone" : $scope.user.Phone});
      });
    };
    $scope.openSetHeadImage = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_headimage.html',
        controller: 'HeadImageUploadCtrl',
        size: 'lg',
        resolve: {
          data: function () {
            return { "title": "上传头像", "image": $scope.user.Image};
          }
        }
      });
      modalInstance.result.then(function (data) {  
        $scope.user.Image = data;      
        AccountProfile.saveHeadImage({"userId" : 1 ,"iamge" : $scope.user.Image});        
      });
    };
    $scope.$watch('$viewContentLoaded',function(){
      var promise = AccountProfile.getSettings({"UserId":1});
      promise.then(function(result){
          if(angular.isObject(result)){
              $scope.user = result;
          }
      });
    }); 
}]);
//设置密码的弹出框Controller处理
app.controller('SetPwdCtrl', ['$scope', '$modalInstance','data', function($scope, $modalInstance,data) {   
    $scope.title = data.title;    
    $scope.password = data.password;    
    $scope.ok = function () {
      $modalInstance.close($scope.password);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);
//设置普通值的弹出框Controller处理
app.controller('SetValueCtrl', ['$scope', '$modalInstance','data', function($scope, $modalInstance,data) {   
    $scope.title = data.title;    
    $scope.value = data.value;    
    $scope.ok = function () {
      $modalInstance.close($scope.value);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);
//头像上传
app.controller('HeadImageUploadCtrl', ['$scope', 'FileUploader', '$modalInstance', 'data', function($scope, FileUploader, $modalInstance, data) {
    
    $scope.title = data.title;
    $scope.image = data.image;

    var uploader = $scope.uploader = new FileUploader({
        url: 'js/controllers/upload.php'
    });

    // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);

    $scope.ok = function () {
      $modalInstance.close($scope.image);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);
//支付宝设置Controller
app.controller('ZfbCashoutCtrl', ['$scope', 'AccountCashout', function($scope,AccountCashout){
  $scope.zfb = {
      "UserId": -1, 
      "UserBankId": -1, 
      "BankType": -1, 
      "AccountName": "", 
      "AccountNumber": "", 
      "Branch": "", 
      "City": "", 
      "Screenshot": ""
  };
  $scope.isShow = false;
  $scope.$watch('$viewContentLoaded',function(){
    var promise = AccountCashout.getZfbSettings({"UserId":1});
    promise.then(function(result){
        if(angular.isObject(result)){
          $scope.zfb = result;
        }
    });    
  });
  $scope.save = function(){
    //TODO: 验证逻辑处理
    AccountCashout.saveZfbSettings($scope.zfb);
  };
  $scope.showDetails = function(){
    $scope.isShow = true;
  };
  $scope.hideDetails = function(){
    $scope.isShow = false;
  };
}]);
//财付通设置Controller
app.controller('CftCashoutCtrl', ['$scope','AccountCashout', function($scope,AccountCashout){
  $scope.ctf = {
      "UserId": -1, 
      "UserBankId": -1, 
      "BankType": -1, 
      "AccountName": "", 
      "AccountNumber": "", 
      "Branch": "", 
      "City": "", 
      "Screenshot": ""
  };
  $scope.isShow = false;
  $scope.$watch('$viewContentLoaded',function(){
    var promise = AccountCashout.getCftSettings({"UserId":1});
    promise.then(function(result){
        if(angular.isObject(result)){
          $scope.ctf = result;
        }    
    }); 
  });
  $scope.save = function(){
    //TODO: 验证逻辑处理
    AccountCashout.saveZfbSettings($scope.ctf);
  };
  $scope.showDetails = function(){
    $scope.isShow = true;
  };
  $scope.hideDetails = function(){
    $scope.isShow = false;
  };
}]);
//银行设置Controller
app.controller('YhCashoutCtrl', ['$scope','AccountCashout', function($scope,AccountCashout){
  $scope.yh = {
      "UserId": -1, 
      "UserBankId": -1, 
      "BankType": -1, 
      "AccountName": "", 
      "AccountNumber": "", 
      "Branch": "", 
      "City": "", 
      "Screenshot": ""
  };
  $scope.isShow = false;  
  $scope.$watch('$viewContentLoaded',function(){
    var promise = AccountCashout.getYhSettings({"UserId":1});
    promise.then(function(result){
        if(angular.isObject(result)){
          $scope.yh = result;  
        }        
    });
  });
  $scope.save = function(){
    //TODO: 验证逻辑处理
    AccountCashout.saveZfbSettings($scope.yh);
  };
  $scope.showDetails = function(){
    $scope.isShow = true;
  };
  $scope.hideDetails = function(){
    $scope.isShow = false;
  };
}]);
//绑定买手页父Controller
app.controller('BuyerCtrl', ['$scope','Platforms', function($scope,Platforms) {
  $scope.platforms = [];  
  $scope.$watch('$viewContentLoaded',function(){
    var result = Platforms.getAll(); 
    if(angular.isObject(result)){
      $scope.platforms = result;
    }
  });
}]);
//绑定买手详细Controller
app.controller('BuyerBindCtrl', ['$scope', 'AccountBuyer', function($scope, AccountBuyer) {
  
}]);
//绑定卖手店铺父Controller
app.controller('SellerCtrl', ['$scope','Platforms', function($scope, Platforms) {
  $scope.platforms = [];  
  $scope.$watch('$viewContentLoaded',function(){
    var result = Platforms.getAll(); 
    if(angular.isObject(result)){
      $scope.platforms = result;
    }
  });
}]);
//绑定卖手店铺详细Controller
app.controller('SellerDetailCtrl', ['$scope', 'AccountSeller', function($scope, AccountSeller) {

}]);
