'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', 'users', '$state', '$window', function($scope, users, $state, $window) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;
      users.login($scope.user.email, $scope.user.password).then(function(result){
        $window.localStorage.setItem("userSession", angular.toJson(result));
        app.userSession = result;
        $state.go('app.dashboard-v1');
      },function(reason){
        $scope.authError = reason.message;
      });
    };
  }])
;