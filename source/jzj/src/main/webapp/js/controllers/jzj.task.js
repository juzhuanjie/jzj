
'use strict';

/*
** 任务管理页面相关的Controller
*/

// 发布任务流程控制基础控制器
app.controller('TaskFlowCtrl',['$scope','$state','flowDatas','taskflow','$stateParams','$location', function($scope,$state,flowDatas,taskflow,$stateParams,$location){
	$scope.flowItem = [];
	$scope.prevItem = '';
	$scope.currItem = 'app.task.item1';
	$scope.currItemIndex = 0;
	$scope.platformId = -1;
	$scope.flowData = {}; 
	$scope.$on('$viewContentLoaded',function(){						
		if($location.path() == '/app/taskflow/new'){
			//如果是create,设置默认值
			$scope.platformId = 1;
			$scope.flowItem = taskflow.create($scope.platformId);
			$scope.flowData = flowDatas.create($scope.platformId);
			$scope.currItemIndex = 0;
			$state.go($scope.flowItem[0]);
		}else{			
			var id = $stateParams.id;
			if(id != 'new'){
				
			}
			//TODO: 根据ID去获取数据，初始化平台信息，flowItem信息，flowData信息，currItemIndex信息，跳转到最后一步
			// $scope.platformId = 1;
			// $scope.flowItem = taskflow.create($scope.platformId);
			// $scope.flowData = flowDatas.create($scope.platformId);
			// $scope.currItemIndex = 0;
			// $state.go($scope.flowItem[0]);
		}
		$scope.$broadcast('flow-ready',$scope.flowData);
	});
	$scope.$on('change-platform',function(event, platformId){
		$scope.platformId = platformId;
		$scope.flowItem = taskflow.create($scope.platformId);
		$scope.flowData = flowDatas.create($scope.platformId);		
	});
	$scope.$on('next-step',function(event,data){		
		var index = 0;
		angular.forEach($scope.flowItem,function(value,key){			
			if(value == data.item){				
				index = key+1;
			}
		});
		$scope.currItemIndex = index;
		$scope.prevItem = $scope.currItem;
		$scope.currItem = $scope.flowItem[index];
		$scope.flowData = data.flowData; 
		$state.go($scope.flowItem[index]);
	});
	$scope.$on('prev-step',function(event,data){
		var index = 0;
		angular.forEach($scope.flowItem,function(value,key){
			if(value == data.item){
				index = key-1;
			}
		});
		$scope.currItemIndex = index;
		$scope.prevItem = $scope.currItem;
		$scope.currItem = $scope.flowItem[index];
		$scope.flowData = data.flowData; 
		$state.go($scope.flowItem[index]);
	});
}]);
//选择任务类型
app.controller('TaskFlowItem1Ctrl',['$scope','flowDatas','sellerShops','taskTypes', 'platforms', function($scope,flowDatas,sellerShops,taskTypes,platforms){
	var userId = app.userSession.userId;
	$scope.thisItem = "app.task.item1";
	$scope.selectedPlatform = -1;
	$scope.platforms = [];
	$scope.selectedShop = -1;
	$scope.shops = [];
	$scope.selectedTaksType = -1;
	$scope.tasktypes = [];
	$scope.flowData = {}; 
	$scope.$on('flow-ready',function(event,flowData){
		$scope.flowData = flowData;
		$scope.platforms = platforms.getAllWithShopCount();		
		$scope.selectedPlatform = $scope.flowData.platformId;		
		loadShop();
		$scope.selectedShop = $scope.flowData.shopId;				
		$scope.tasktypes = taskTypes.get($scope.flowData.platformId);
		$scope.selectedTaksType = $scope.flowData.taskTypeId;
	});
	$scope.nextstep = function(){
		$scope.$emit('next-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
	$scope.changePlatform = function(platformId){
		$scope.selectedPlatform = platformId;
		$scope.flowData.platformId = platformId;
		loadShop();
		$scope.$emit('change-platform', platformId);
	};
	$scope.changeShop = function(shopId){
		$scope.selectedShop = shopId;
		$scope.flowData.shopId = shopId;
	};
	$scope.changeTaskType = function(taskTypeId){
		$scope.selectedTaksType = taskTypeId;
		$scope.flowData.taskTypeId = taskTypeId;
	};
	var loadShop = function(){
		sellerShops.query(userId, $scope.flowData.platformId).then(function(result){
	      $scope.shops = result;
	    });
	};
}]);
//填写商品信息
app.controller('TaskFlowItem2Ctrl',['$scope', function($scope){
	$scope.thisItem = "app.task.item2";
	$scope.flowData = {};
	$scope.$on('flow-ready',function(event,flowData){
		$scope.flowData = flowData;
	});
	$scope.nextstep = function(){
		$scope.$emit('next-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
	$scope.prevstep = function(){
		$scope.$emit('prev-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
}]);
//选择刷单数量
app.controller('TaskFlowItem3Ctrl',['$scope', function($scope){
	$scope.thisItem = "app.task.item3";
	$scope.flowData = {}; 
	$scope.$on('flow-ready',function(event,flowData){
		$scope.flowData = flowData;
	});
	$scope.nextstep = function(){
		$scope.$emit('next-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
	$scope.prevstep = function(){
		$scope.$emit('prev-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
}]);
//选择增值服务
app.controller('TaskFlowItem4Ctrl',['$scope', function($scope){
	$scope.thisItem = "app.task.item4";
	$scope.flowData = {}; 
	$scope.$on('flow-ready',function(event,flowData){
		$scope.flowData = flowData;
	});
	$scope.nextstep = function(){
		$scope.$emit('next-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
	$scope.prevstep = function(){
		$scope.$emit('prev-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
}]);
//支付
app.controller('TaskFlowItem5Ctrl',['$scope', function($scope){
	$scope.thisItem = "app.task.item5";
	$scope.flowData = {}; 
	$scope.$on('flow-ready',function(event,flowData){
		$scope.flowData = flowData;
	});
	$scope.nextstep = function(){
		$scope.$emit('next-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
	$scope.prevstep = function(){
		$scope.$emit('prev-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
}]);
//发布成功
app.controller('TaskFlowItem6Ctrl',['$scope', function($scope){
	$scope.flowData = {}; 
}]);