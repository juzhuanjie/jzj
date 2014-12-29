'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$state','users', function($scope, $state, users) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      $scope.authError = null;
      var user = users.newEmpty();
      user.userLogin = $scope.user.name;
      user.email = $scope.user.email;
      user.password = $scope.user.password;
      user.userType = 1;
      users.add(user).then(function(result){
        $state.go('access.signin');
      },function(reason){        
        if(angular.isDefined(reason.summary)){
          $scope.authError = reason.summary;  
        }        
      });      
    };
  }])
 ;