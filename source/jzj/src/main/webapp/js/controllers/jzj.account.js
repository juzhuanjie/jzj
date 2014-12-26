'use strict';
/*
** 账号信息设置页面相关的Controller
*/
//基本信息Controller
app.controller('UserCtrl', ['$scope', '$modal','users', function($scope, $modal, users) {
    $scope.user = users.newEmpty();
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
        save();
      });
    };
    $scope.openSetPayPwd = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_password.html',
        controller: 'SetPwdCtrl',
        resolve: {
          data: function () {
            return { "title": "设置支付密码", "password": $scope.user.PayPassword};
          }
        }
      });
      modalInstance.result.then(function (data) {    
        $scope.user.PayPassword = data;    
        save();
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
        save();
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
        save();       
      });
    };
    $scope.openSetPhone = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_value.html',
        controller: 'SetValueCtrl',
        resolve: {
          data: function () {
            return { "title": "设置手机号码", "value": $scope.user.Mobile};
          }
        }
      });
      modalInstance.result.then(function (data) {  
        $scope.user.Mobile = data;      
        save();
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
        save();        
      });
    };
    $scope.$watch('$viewContentLoaded',function(){
      //TODO: 这个要从全局的对象里拿USERID
      var result = users.get(1);
      if(!angular.isObject(result)){
        //TODO: 错误处理
      }else{
        $scope.user = result;
      }
    }); 
    var save = function(){
      var result = users.save($scope.user);
      if(!angular.isObject(result)){
        //TODO: 错误处理
      }else{
        $scope.user = result;
      }
    }
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
app.controller('ZhiFuBaoCtrl', ['$scope', 'userBanks', function($scope, userBanks){
  //TODO: 从全局对象里获取UserId
  var userId = 1;
  var bankType = 1;
  $scope.account = {};
  $scope.isShow = false;
  $scope.$watch('$viewContentLoaded',function(){
    var result = userBanks.get(userId, bankType);
    if(angular.isObject(result)){
      $scope.account = result;  
    }     
  });
  $scope.save = function(){
    //TODO: 验证逻辑处理
    var result = userBanks.add($scope.account);
    if(!angular.isObject(result)){
      //TODO: 错误处理
    }else{
      $scope.account = result;
    }
  };
  $scope.showDetails = function(){
    $scope.isShow = true;
  };
  $scope.hideDetails = function(){
    $scope.isShow = false;
  };
}]);
//财付通设置Controller
app.controller('CaiFuTongCtrl', ['$scope','userBanks', function($scope,userBanks){
  //TODO: 从全局对象里获取UserId
  var userId = 1;
  var bankType = 2;
  $scope.account = {};
  $scope.isShow = false;
  $scope.$watch('$viewContentLoaded',function(){
    var result = userBanks.get(userId, bankType);
    if(angular.isObject(result)){
      $scope.account = result;  
    } 
  });
  $scope.save = function(){
    //TODO: 验证逻辑处理
    var result = userBanks.add($scope.account);
    if(!angular.isObject(result)){
      //TODO:错误处理
    }else{
      $scope.account = result;
    }
  };
  $scope.showDetails = function(){
    $scope.isShow = true;
  };
  $scope.hideDetails = function(){
    $scope.isShow = false;
  };
}]);
//银行卡设置Controller
app.controller('YinHangKaCtrl', ['$scope','userBanks', function($scope,userBanks){
  //TODO: 从全局对象里获取UserId
  var userId = 1;
  var bankType = 3;
  $scope.account = {};
  $scope.isShow = false;  
  $scope.$watch('$viewContentLoaded',function(){
    var result = userBanks.get(userId, bankType);
    if(angular.isObject(result)){
      $scope.account = result;  
    }
  });
  $scope.save = function(){
    //TODO: 验证逻辑处理
    var result = userBanks.add($scope.account);
    if(!angular.isObject(result)){
      //TODO:错误处理
    }else{
      $scope.account = result;
    }
  };
  $scope.showDetails = function(){
    $scope.isShow = true;
  };
  $scope.hideDetails = function(){
    $scope.isShow = false;
  };
}]);
//绑定买手页父Controller
app.controller('BuyerCtrl', ['$scope','platforms', function($scope,platforms) {
  $scope.platforms = [];  
  $scope.$watch('$viewContentLoaded',function(){
    var result = platforms.getAll(); 
    if(angular.isObject(result)){
      $scope.platforms = result;
    }
  });
}]);
//绑定买手详细Controller
app.controller('BuyerBindCtrl', ['$scope', function($scope) {
  
}]);
//绑定卖手店铺父Controller
app.controller('SellerCtrl', ['$scope','platforms', function($scope, platforms) {
  $scope.platforms = [];  
  $scope.$watch('$viewContentLoaded',function(){
    var result = platforms.getAll(); 
    if(angular.isObject(result)){
      $scope.platforms = result;
    }
  });
}]);
//绑定卖手店铺详细Controller
app.controller('SellerBindCtrl', ['$scope', function($scope) {

}]);
