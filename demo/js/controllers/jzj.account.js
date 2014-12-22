'use strict';

app.controller('AccountCtrl', ['$scope', '$modal', function($scope, $modal) {
    
    $scope.openHeadImage = function (size) {
      
    };

    $scope.setHeadImage = function (size) {
      
    };

    $scope.openLoginPwd = function(size){
        var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return {};
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      });
    };

    $scope.setLoginPwd = function(size){

    };

    $scope.openPayPwd = function(size){

    };

    $scope.setPayPwd = function(size){

    };

    $scope.openQQ = function(size){

    };

    $scope.setQQ = function(size){

    };

    $scope.openEmail = function(size){

    };

    $scope.setEmail = function(size){

    };

    $scope.openPhone = function(size){

    };

    $scope.setPhone = function(size){

    };

  }]);


app.controller('ModalDemoCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }]);

  app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }])
  ; 
