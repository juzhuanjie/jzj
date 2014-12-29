'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', 'users', '$state', '$rootScope', function($scope, users, $state, $rootScope) {
    $scope.user = {};
    $scope.authError = null;
    $scope.$watch("$viewContentLoaded",function(){
      //TODO:　just for test
      if($scope.user.email == undefined){
        $scope.user.email = "moke@bdnacn.com";
        $scope.user.password = "bdnacn";
      }
    });
    $scope.login = function() {
      $scope.authError = null;
      var result = users.login($scope.user.email, $scope.user.password);
      if (result.code != undefined) {
        $scope.authError = result.message;
      }else{
        $state.go('app.dashboard-v1');
      }
    };
  }])
;