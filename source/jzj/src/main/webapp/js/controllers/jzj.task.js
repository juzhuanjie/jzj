
'use strict';

/*
** 任务管理页面相关的Controller
*/

// 发布任务流程控制基础控制器
app.controller('TaskFlowCtrl',['$scope','$state','flowDatas','taskflow', function($scope,$state,flowDatas,taskflow){
	$scope.flowItem = [];
	$scope.currItem = 'app.task.item1';
	$scope.platformId = -1;
	$scope.flowData = {}; 
	$scope.$on('$viewContentLoaded',function(){		
		//如果是create,设置默认值
		$scope.platformId = 1;
		$scope.flowItem = taskflow.create($scope.platformId);
		$scope.flowData = flowDatas.create($scope.platformId);
		flowDatas.set($scope.flowData);

		//TODO: 如果是编辑，根据platform来创建相应的flow
		$scope.$broadcast('flow-ready','');
	});
	$scope.$on('change-platform',function(event, platformId){
		$scope.platformId = platformId;
		$scope.flowItem = taskflow.create($scope.platformId);
		$scope.flowData = flowDatas.create($scope.platformId);		
		flowDatas.set($scope.flowData);
	});
	$scope.$on('next-step',function(event,flowData){		
		var index = 0;
		angular.forEach($scope.flowItem,function(value,key){			
			if(value == $scope.currItem){				
				index = key+1;
			}
		});
		$scope.currItem = $scope.flowItem[index];
		flowDatas.set(flowData);
		$state.go($scope.flowItem[index]);
	});
	$scope.$on('prev-step',function(event,flowData){
		var index = 0;
		angular.forEach($scope.flowItem,function(value,key){
			if(value == $scope.currItem){
				index = key-1;
			}
		});
		$scope.currItem = $scope.flowItem[index];
		flowDatas.set(flowData);
		$state.go($scope.flowItem[index]);
	});
}]);
//选择任务类型
app.controller('TaskFlowItem1Ctrl',['$scope','flowDatas','sellerShops','taskTypes', 'platforms', function($scope,flowDatas,sellerShops,taskTypes,platforms){
	var userId = app.userSession.userId;
	$scope.selectedPlatform = -1;
	$scope.platforms = [];
	$scope.selectedShop = -1;
	$scope.shops = [];
	$scope.selectedTaksType = -1;
	$scope.tasktypes = [];
	$scope.flowData = {}; 
	$scope.$on('flow-ready',function(){
		$scope.flowData = flowDatas.get();
		$scope.platforms = platforms.getAllWithShopCount();		
		$scope.selectedPlatform = $scope.flowData.platformId;		
		loadShop();
		$scope.selectedShop = $scope.flowData.shopId;		
		$scope.tasktypes = taskTypes.get($scope.flowData.platformId);
		$scope.selectedTaksType = $scope.flowData.taskTypeId;
	});
	$scope.nextstep = function(){
		$scope.$emit('next-step', $scope.flowData);
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
	$scope.flowData = {}; 
	$scope.nextstep = function(){
		$scope.$emit('next-step', $scope.flowData);
	};
	$scope.prevstep = function(){
		$scope.$emit('prev-step', $scope.flowData);
	};
}]);
//选择刷单数量
app.controller('TaskFlowItem3Ctrl',['$scope', function($scope){
	$scope.flowData = {}; 
	$scope.nextstep = function(){
		$scope.$emit('next-step', $scope.flowData);
	};
	$scope.prevstep = function(){
		$scope.$emit('prev-step', $scope.flowData);
	};
}]);
//选择增值服务
app.controller('TaskFlowItem4Ctrl',['$scope', function($scope){
	$scope.flowData = {}; 
	$scope.nextstep = function(){
		$scope.$emit('next-step', $scope.flowData);
	};
	$scope.prevstep = function(){
		$scope.$emit('prev-step', $scope.flowData);
	};
}]);
//支付
app.controller('TaskFlowItem5Ctrl',['$scope', function($scope){
	$scope.flowData = {}; 
	$scope.nextstep = function(){
		$scope.$emit('next-step', '');
	};
	$scope.prevstep = function(){
		$scope.$emit('prev-step', '');
	};
}]);
//发布成功
app.controller('TaskFlowItem6Ctrl',['$scope', function($scope){
	$scope.flowData = {}; 
}]);