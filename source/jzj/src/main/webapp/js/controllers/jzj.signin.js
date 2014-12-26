'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', 'users', '$state', function($scope, users, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;
      var result = users.login($scope.user.email, $scope.user.password);
      if (result.status == 'Error') {
        $scope.authError = result.status.msg;
      }else{
        $state.go('app.dashboard-v1');
      }
    };
  }])
;