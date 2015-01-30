'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', 'users', '$state', '$window','$http', function($scope, users, $state, $window, $http) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;
      var para = { "login" : $scope.user.email, "password" : $scope.user.password };
      $http.post('http://mc-ubuntu2.cloudapp.net/user/login', para).success(function(result, status, headers, config) {
          $window.localStorage.setItem("userSession", angular.toJson(result));
          app.userSession = result;
          //app.userTokan = "";
          //console.log(headers('token'));
          $state.go('app.dashboard-v1');
      }).error(function(reason, status, headers, config) {
          $scope.authError = reason.message;
      });
    };
  }])
;