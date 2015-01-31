'use strict';

// forgot pwd controller
app.controller('ForgotpwdController', ['$scope', '$state','users', function($scope, $state, users) {
    $scope.user = {};
    $scope.isCollapsed = true;
    $scope.authError = "";
    $scope.email = "";
    $scope.send = function() {      
      //发送邮件
      users.resetPasswordRequest($scope.email).then(function(result){
        if(angular.uppercase(result) == "OK"){
          $scope.isCollapsed = !$scope.isCollapsed;
        }else{
          $scope.authError = "邮件发送失败！";
        }
      });
    };
}]);

// signin controller
app.controller('SigninFormController', ['$scope', 'users', '$state', '$window','$http', function($scope, users, $state, $window, $http) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;
      var para = { "login" : $scope.user.email, "password" : $scope.user.password };
      var api = app.global.host + '/user/login';
      $http.post(api, para).success(function(result, status, headers, config) {
          $window.localStorage.setItem("userSession", angular.toJson(result));
          app.userSession = result;
          //app.userTokan = "";
          //console.log(headers('token'));
          $state.go('app.dashboard-v1');
      }).error(function(reason, status, headers, config) {
          $scope.authError = reason.message;
      });
    };
  }]);

// signup controller
app.controller('SignupFormController', ['$scope', '$state','users', function($scope, $state, users) {
    $scope.user = {};
    $scope.authError = null;
    $scope.$watch('$viewContentLoaded',function(){  
      $scope.user = users.newEmpty();
      //设置默认用户类型为商家
      $scope.user.userTypeId = 1;
    });
    $scope.signup = function() {
      $scope.authError = null;      
      users.add($scope.user).then(function(result){
        $state.go('access.signin');
      },function(reason){        
        if(angular.isDefined(reason.summary)){
          $scope.authError = reason.summary;  
        }        
      });      
    };
    $scope.selectUserType = function(userTypeId){
      $scope.user.userTypeId = userTypeId;
    };
  }]);

// reset pwd controller
app.controller('ResetPwdController', ['$scope', '$state','users','$location', function($scope, $state, users,$location) {
    $scope.email = "";
    $scope.password = "";
    $scope.thecode = "";
    $scope.authError = "";    
    $scope.$watch('$viewContentLoaded',function(){
      $scope.thecode = $location.search().code;
    });
    $scope.resetPwd = function() {      
      //发送邮件
      users.resetPassword($scope.email,$scope.password,$scope.thecode).then(function(result){
        if(angular.uppercase(result) == "OK"){
          $state.go('access.signin');
        }else{
          $scope.authError = "密码重置失败！";
        }
      });
    };
}]);