
'use strict';

/*
** 账号信息设置页面相关的Controller
*/

//基本信息Controller
app.controller('UserCtrl', ['$scope', '$modal','users', function($scope, $modal, users) {
    var userId = app.userSession.userId;
    $scope.user = users.newEmpty();
    $scope.openSetLoginPwd = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_password.html',
        controller: 'SetPwdCtrl',
        resolve: {
          data: function () {
            return { "title": "设置登录密码", "password": $scope.user.password};
          }
        }
      });
      modalInstance.result.then(function (data) {        
        save({'password':data});   
      });
    };
    $scope.openSetPayPwd = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_password.html',
        controller: 'SetPwdCtrl',
        resolve: {
          data: function () {
            return { "title": "设置支付密码", "password": $scope.user.payPassword};
          }
        }
      });
      modalInstance.result.then(function (data) {      
        save({'payPassword':data});   
      });
    };
    $scope.openSetQQ = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_value.html',
        controller: 'SetValueCtrl',
        resolve: {
          data: function () {
            return { "title": "设置QQ账号", "value": $scope.user.qq};
          }
        }
      });
      modalInstance.result.then(function (data) {      
        save({'qq':data});   
      });
    };
    $scope.openSetEmail = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_value.html',
        controller: 'SetValueCtrl',
        resolve: {
          data: function () {
            return { "title": "设置邮箱地址", "value": $scope.user.email};
          }
        }
      });
      modalInstance.result.then(function (data) {
        save({'email':data});       
      });
    };
    $scope.openSetPhone = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_value.html',
        controller: 'SetValueCtrl',
        resolve: {
          data: function () {
            return { "title": "设置手机号码", "value": $scope.user.mobile};
          }
        }
      });
      modalInstance.result.then(function (data) {      
        save({'mobile':data}); 
      });
    };
    $scope.openSetHeadImage = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/set_headimage.html',
        controller: 'HeadImageUploadCtrl',
        size: 'lg',
        resolve: {
          data: function () {
            return { "title": "上传头像", "image": $scope.user.image};
          }
        }
      });
      modalInstance.result.then(function (data) {        
        save({'image':data});      
      });
    };
    $scope.$watch('$viewContentLoaded',function(){      
      users.get(userId).then(function(result){
        $scope.user = result;
      });
    }); 
    var save = function(json){
      users.save(userId, json).then(function(result){
        $scope.user = result;
      });      
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
app.controller('ZhiFuBaoCtrl', ['$scope', 'userBanks','bankTypes', function($scope, userBanks,bankTypes){
  var userId = app.userSession.userId;
  var bankType = bankTypes.getZFB().id;
  $scope.isEdit = true;
  $scope.account = userBanks.newEmpty(bankType);
  $scope.isShow = false;
  $scope.$watch('$viewContentLoaded',function(){
    userBanks.get(userId, bankType).then(function(result){
      if(result.length > 0){
        $scope.account = result[0];  
        $scope.isEdit = true;  
      }  
      else{
        $scope.isEdit = false;
      }    
    },function(reason){
      $scope.isEdit = false;
    });   
  });
  $scope.save = function(){
    //TODO: 验证逻辑处理
    $scope.account.userId = userId;
    $scope.account.bankType = bankType;
    userBanks.add($scope.account).then(function(result){
      $scope.account = result;
      $scope.isShow = false;
      $scope.isEdit = true; 
    }, function(reason){
      $scope.isEdit = false; 
    });
  };
  $scope.showDetails = function(){
    $scope.isShow = true;
  };
  $scope.hideDetails = function(){
    $scope.isShow = false;
  };
}]);
//财付通设置Controller
app.controller('CaiFuTongCtrl', ['$scope','userBanks','bankTypes', function($scope,userBanks,bankTypes){
  var userId = app.userSession.userId;
  var bankType = bankTypes.getCFT().id;
  $scope.isEdit = true;
  $scope.account = userBanks.newEmpty(bankType);
  $scope.isShow = false;
  $scope.$watch('$viewContentLoaded',function(){
    userBanks.get(userId, bankType).then(function(result){
      if(result.length > 0){
        $scope.account = result[0];  
        $scope.isEdit = true;  
      }  
      else{
        $scope.isEdit = false;
      }    
    },function(reason){
      $scope.isEdit = false;
    });
  });
  $scope.save = function(){
    //TODO: 验证逻辑处理
    $scope.account.userId = userId;
    $scope.account.bankType = bankType;
    userBanks.add($scope.account).then(function(result){
      $scope.account = result;
      $scope.isShow = false;
      $scope.isEdit = true; 
    }, function(reason){
      $scope.isEdit = false; 
    });
  };
  $scope.showDetails = function(){
    $scope.isShow = true;
  };
  $scope.hideDetails = function(){
    $scope.isShow = false;
  };
}]);
//银行卡设置Controller
app.controller('YinHangKaCtrl', ['$scope','userBanks','bankTypes', function($scope,userBanks,bankTypes){
  var userId = app.userSession.userId;
  var bankType = bankTypes.getYHK().id;
  $scope.isEdit = true;
  $scope.account = userBanks.newEmpty(bankType);
  $scope.isShow = false;  
  $scope.$watch('$viewContentLoaded',function(){
    userBanks.get(userId, bankType).then(function(result){
      if(result.length > 0){
        $scope.account = result[0];  
        $scope.isEdit = true;  
      }  
      else{
        $scope.isEdit = false;
      }    
    },function(reason){
      $scope.isEdit = false;
    });
  });
  $scope.save = function(){
    //TODO: 验证逻辑处理
    $scope.account.userId = userId;
    $scope.account.bankType = bankType;
    userBanks.add($scope.account).then(function(result){
      $scope.account = result;
      $scope.isShow = false;
      $scope.isEdit = true; 
    }, function(reason){
      $scope.isEdit = false; 
    });
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
  $scope.currPlatform = {};
  $scope.platforms = [];  
  $scope.$watch('$viewContentLoaded',function(){
    var result = platforms.getAll(); 
    if(angular.isObject(result)){
      $scope.platforms = result;
    }
    $scope.currPlatform = result[0];
    $scope.platforms[0].active = true;
  });
  $scope.selectPlatform = function(platformId){
    angular.forEach($scope.platforms, function(value){
      value.active = false;
      if(value.id == platformId){
        value.active = true;
        $scope.currPlatform = value;
      }
    });
    $scope.$broadcast('select_platform', $scope.currPlatform);
  };
}]);
//绑定买手详细Controller
app.controller('BuyerAccountCtrl', ['$scope','buyerAccounts','platforms','userAddresses', function($scope,buyerAccounts,platforms,userAddresses) {
  var userId = app.userSession.userId;
  $scope.platform = {};
  $scope.buyerAccountBinds = [];
  $scope.province = "";
  $scope.city = "";
  $scope.district = "";
  $scope.isShow = false;
  $scope.isEdit = true;
  $scope.currEditBuyerAccount = null;
  $scope.userAddress = {};
  $scope.buyerAccount = {};
  $scope.addBuyerBind = function(){
    $scope.isShow = true;
    $scope.isEdit = false;
    clear();
  };
  $scope.editBuyerBind = function(buyerAccountId){
    buyerAccounts.get(buyerAccountId).then(function(result){
      $scope.buyerAccount.wangwang = result.wangwang;
      $scope.wwScreenshot = result.wwScreenshot;
      $scope.province = result.addressId.province;
      $scope.city = result.addressId.city;
      $scope.district = result.addressId.district;
      $scope.userAddress = result.addressId;
      $scope.isShow = true;
      $scope.isEdit = true;
      $scope.currEditBuyerAccount = result;
    });    
  };
  $scope.cancel = function(){
    $scope.isShow = false;
  };
  $scope.save = function(){

    if($scope.isEdit){
      var buyerAccount = $scope.currEditBuyerAccount;
      $scope.userAddress.province = $scope.province;
      $scope.userAddress.city = $scope.city;
      $scope.userAddress.district = $scope.district;
      buyerAccount.addressId = $scope.userAddress;
      alert(angular.toJson($scope.userAddress));
      buyerAccounts.update(buyerAccount.buyerAccountId,buyerAccount).then(function(result){
        initBuyerAccountList();
        $scope.isShow = false;
        clear();
      },function(reason){

      });  
    }else{
      $scope.buyerAccount.userId = userId; 
      $scope.buyerAccount.platformId = $scope.platform.id; 
      $scope.buyerAccount.accountLogin = $scope.userAddress.recipient; 
      $scope.userAddress.province = $scope.province;
      $scope.userAddress.city = $scope.city;
      $scope.userAddress.district = $scope.district;
      $scope.userAddress.userId = userId;
      $scope.buyerAccount.addressId = $scope.userAddress;
      buyerAccounts.add($scope.buyerAccount).then(function(result){
        if(angular.isObject(result)){
          initBuyerAccountList();
          $scope.isShow = false;
          clear();
        } 
      },function(reason){

      });       
    }        
  };
  var clear = function(){
    $scope.buyerAccount.wangwang="";
    $scope.buyerAccount.wwScreenshot = "";
    $scope.buyerAccount.accountLogin = "";
    $scope.userAddress.province = "";
    $scope.userAddress.city = "";
    $scope.userAddress.district = "";
    $scope.userAddress.streetAddress = "";
    $scope.userAddress.phone = "";
    $scope.province = "";
    $scope.city = "";
    $scope.district = "";
  };
  $scope.$watch('$viewContentLoaded',function(){
    $scope.platform = platforms.getDefault();
    $scope.userAddress = userAddresses.newEmpty();
    $scope.buyerAccount = buyerAccounts.newEmpty(); 
    initBuyerAccountList();    
  });
  $scope.$on('select_platform',function(event,data){
    $scope.platform = data;
    initBuyerAccountList(); 
    $scope.isEdit = false;
    $scope.isShow = false;
    clear();
  });
  var initBuyerAccountList = function(){
    buyerAccounts.query(userId, $scope.platform.id).then(function(result){
      $scope.buyerAccountBinds = result;
    });
  };
}]);
//绑定卖手店铺父Controller
app.controller('SellerCtrl', ['$scope','platforms', function($scope, platforms) {
  $scope.currPlatform = {};
  $scope.platforms = [];  
  $scope.$watch('$viewContentLoaded',function(){
    var result = platforms.getAll(); 
    if(angular.isObject(result)){
      $scope.platforms = result;
    }
    $scope.currPlatform = result[0];
    $scope.platforms[0].active = true;
  });
  $scope.selectPlatform = function(platformId){
    angular.forEach($scope.platforms, function(value){
      value.active = false;
      if(value.id == platformId){
        value.active = true;
        $scope.currPlatform = value;
      }
    });
    $scope.$broadcast('select_platform', $scope.currPlatform);
  };
}]);
//绑定卖手店铺详细Controller
app.controller('SellerShopCtrl', ['$scope','sellerShops','platforms', function($scope,sellerShops,platforms) {
  var userId = app.userSession.userId;
  $scope.platform = {};
  $scope.sellerShopBinds = [];
  $scope.url = "";
  $scope.wangwang="";
  $scope.province = "";
  $scope.city = "";
  $scope.district = "";
  $scope.isShow = false;
  $scope.isEdit = true;
  $scope.currEditSellerShop = null;
  $scope.addSellerBind = function(){
    $scope.isShow = true;
    $scope.isEdit = false;
    clear();
  };
  $scope.editSellerBind = function(shopId){    
    sellerShops.get(shopId).then(function(result){
      $scope.url = result.url;
      $scope.wangwang = result.wangwang;
      $scope.province = result.province;
      $scope.city = result.city;
      $scope.district = result.street;
      $scope.isShow = true;
      $scope.isEdit = true;
      $scope.currEditSellerShop = result;
    }); 
  };
  $scope.cancel = function(){
    $scope.isShow = false;
  };
  $scope.save = function(){
    if($scope.isEdit){
      var sellerShop = $scope.currEditSellerShop;      
      sellerShop.province = $scope.province;
      sellerShop.city = $scope.city;
      sellerShop.street = $scope.district;
      sellerShops.update(sellerShop.shopId,sellerShop).then(function(result){
        initSellerShopList();
        $scope.isShow = false;
        clear();
      },function(reason){

      });
    }else{
      var sellerShop = sellerShops.newEmpty();
      sellerShop.userId = userId;
      sellerShop.platformId = $scope.platform.id;
      sellerShop.url = $scope.url;
      sellerShop.wangwang = $scope.wangwang;
      sellerShop.province = $scope.province;
      sellerShop.city = $scope.city;
      sellerShop.street = $scope.district;
      sellerShops.add(sellerShop).then(function(result){
        if(angular.isObject(result)){
          $scope.sellerShopBinds.push(result);
          $scope.isShow = false;
          clear();
        } 
      },function(reason){

      });      
    }        
  };  
  var clear = function(){
    $scope.url = "";
    $scope.wangwang = "";
    $scope.province = "";
    $scope.city = "";
    $scope.district = "";
  };
  $scope.$watch('$viewContentLoaded',function(){
    $scope.platform = platforms.getDefault();
    initSellerShopList();
  });
  $scope.$on('select_platform',function(event,data){
    $scope.platform = data;
    initSellerShopList(); 
    $scope.isEdit = false;
    $scope.isShow = false;
    clear();
  });
  var initSellerShopList = function(){
    sellerShops.query(userId, $scope.platform.id).then(function(result){
      $scope.sellerShopBinds = result;
    });
  };
}]);
