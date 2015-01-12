
'use strict';

/*
** 任务管理页面相关的Controller
*/

// 发布任务流程控制基础控制器
app.controller('TaskFlowCtrl',['$scope','$state','flowDatas','$stateParams','$location','tasks', function($scope,$state,flowDatas,$stateParams,$location,tasks){
	$scope.flowItem = [];
	$scope.prevItem = '';
	$scope.currItem = 'app.task.item1';
	$scope.currItemIndex = 0;
	$scope.platformId = -1;
	$scope.flowData = {}; 
	$scope.isFirstPost = true;
	$scope.$on('$viewContentLoaded',function(){						
		if($location.path() == '/app/taskflow/new'){
			//如果是create,设置默认值
			$scope.platformId = 1;			
			$scope.flowData = flowDatas.create($scope.platformId);
			$scope.flowItem = $scope.flowData.taskDetail.flowItem;
			$scope.currItemIndex = 0;
			$state.go($scope.flowItem[0]);
		}else{			
			var id = $stateParams.id;
			if(id != 'new' && $scope.isFirstPost){
				$scope.isFirstPost = false;
				tasks.get(id).then(function(result){
					$scope.platformId = result.platformId;			
					$scope.flowData = result;
					$scope.flowData.taskDetail = angular.fromJson(result.taskDetail);
					$scope.flowItem = $scope.flowData.taskDetail.flowItem;
					$scope.currItem = $scope.flowData.taskDetail.currItem;
					$state.go($scope.currItem);
				});
			}
		}
		$scope.$broadcast('flow-ready',$scope.flowData);
	});
	$scope.$on('change-platform',function(event, platformId){
		$scope.platformId = platformId;		
		$scope.flowData = flowDatas.create($scope.platformId);	
		$scope.flowItem = $scope.flowData.taskDetail.flowItem;
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
		$scope.flowData.taskDetail.currItem = $scope.currItem;
		$scope.flowData.taskDetail = angular.toJson($scope.flowData.taskDetail);
		//SET status is 未发布
		$scope.flowData.status = 2;
		if($scope.flowData.taskId > 0){			
			tasks.save($scope.flowData.taskId,$scope.flowData).then(function(result){
				$scope.flowData = result;
				$scope.flowData.taskDetail = angular.fromJson($scope.flowData.taskDetail);
				$state.go($scope.flowItem[index]);
			});
		}else{
			tasks.add($scope.flowData).then(function(result){
				$scope.flowData = result;
				$scope.flowData.taskDetail = angular.fromJson($scope.flowData.taskDetail);
				$state.go($scope.flowItem[index]);
			});
		}		
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
		$scope.flowData.taskDetail.currItem = $scope.currItem;
		$state.go($scope.flowItem[index]);
	});
	$scope.$on('pay-ok',function(event,data){
		$scope.flowData = data.flowData; 
		//重置会step1
		$scope.flowData.taskDetail.currItem = 'app.task.item1';
		$scope.flowData.taskDetail = angular.toJson($scope.flowData.taskDetail);
		//发布成功，加到已发布状态列表里
		$scope.flowData.status = 5;
		tasks.save($scope.flowData.taskId,$scope.flowData).then(function(result){
			$scope.flowData = result;
			$scope.flowData.taskDetail = angular.fromJson($scope.flowData.taskDetail);
			//TODO: 处理支付事件
		});
	});
	$scope.$on('pay-cancel',function(event,data){
		$scope.flowData = data.flowData; 
		//重置会step1
		$scope.flowData.taskDetail.currItem = 'app.task.item1';
		$scope.flowData.taskDetail = angular.toJson($scope.flowData.taskDetail);
		//发布成功，加到已发布状态列表里
		$scope.flowData.status = 2;
		tasks.save($scope.flowData.taskId,$scope.flowData).then(function(result){
			$scope.flowData = result;
			$scope.flowData.taskDetail = angular.fromJson($scope.flowData.taskDetail);
			//TODO: 处理支付事件
		});
		$location.url('/app/tasklist/2');
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
		$scope.tasktypes = taskTypes.query($scope.flowData.platformId);
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
	$scope.changeShop = function(shopId,shopName){
		$scope.selectedShop = shopId;
		$scope.flowData.shopId = shopId;
		$scope.flowData.taskDetail.shopName = shopName;
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
app.controller('TaskFlowItem2Ctrl',['$scope','products', function($scope,products){
	$scope.thisItem = "app.task.item2";
	$scope.flowData = {};
	$scope.product = {};
	$scope.$on('flow-ready',function(event,flowData){
		$scope.flowData = flowData;
		if(angular.isObject(flowData.productId)){			
			$scope.product = flowData.productId;	
			$scope.product.productDesc = angular.fromJson(flowData.productId.productDesc);
		}else{
			$scope.product = products.newEmpty();	
			$scope.product.shopId = flowData.shopId;		
		}				
	});
	$scope.saveProduct = function(){
		$scope.product.productDesc = angular.toJson($scope.product.productDesc);
		if($scope.product.productId > 0){			
			products.save($scope.product.productId,$scope.product).then(function(result){
				$scope.product = result;
				$scope.product.productDesc = angular.fromJson(result.productDesc);
				$scope.flowData.productId = $scope.product;
			});
		}else{
			products.add($scope.product).then(function(result){
				$scope.product = result;
				$scope.product.productDesc = angular.fromJson(result.productDesc);
				$scope.flowData.productId = $scope.product;
			});
		}
	};
	$scope.nextstep = function(){
		$scope.product.productDesc = angular.toJson($scope.product.productDesc);
		$scope.flowData.productId = $scope.product;
		$scope.$emit('next-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });		
	};
	$scope.prevstep = function(){
		$scope.product.productDesc = angular.toJson($scope.product.productDesc);
		$scope.flowData.productId = $scope.product;
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
	$scope.pcOrderQuantity = 0;
	$scope.padOrderQuantity = 0;
	$scope.totalPoint = 0;
	$scope.countPoint = function(){
		$scope.pcOrderQuantity = ($scope.flowData.taskDetail.pcOrderQuantity == "" || $scope.flowData.taskDetail.pcOrderQuantity < 0 )? 0 : $scope.flowData.taskDetail.pcOrderQuantity;
		$scope.padOrderQuantity = ($scope.flowData.taskDetail.padOrderQuantity == "" || $scope.flowData.taskDetail.padOrderQuantity < 0) ? 0 : $scope.flowData.taskDetail.padOrderQuantity;
		$scope.totalPoint = ($scope.pcOrderQuantity * 16.6) + ($scope.padOrderQuantity * 17.1);
	};
}]);
//选择增值服务
app.controller('TaskFlowItem4Ctrl',['$scope', function($scope){
	$scope.thisItem = "app.task.item4";
	$scope.flowData = {}; 
	$scope.fastDoneOption = { "10" : false, "20" : false, "30" : false };
	$scope.$on('flow-ready',function(event,flowData){
		$scope.flowData = flowData;		
		console.log($scope.flowData);
		$scope.setFaskDone($scope.flowData.taskDetail.fastDonePoint);
	});
	$scope.nextstep = function(){
		$scope.$emit('next-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
	$scope.prevstep = function(){
		$scope.$emit('prev-step', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
	$scope.suiltPoint = 16.6;
	$scope.fastRefundPoint = 0;
	$scope.fastDonePoint = 0;
	$scope.addtionPoint = 0;
	$scope.priorityReviewPoint = 0;
	$scope.extPeriodPoint = 0;
	$scope.qualityPraisePoint = 0;
	$scope.countTotal = function(){
		if($scope.flowData.taskDetail.agreeFastRefunds){
			$scope.fastRefundPoint = 1 * $scope.flowData.productId.productPrice * 0.006;
			$scope.flowData.taskDetail.totalPoint += (1 * parseFloat($scope.flowData.productId.productPrice) * 0.006);
		}
		if($scope.flowData.taskDetail.fastDonePoint > 0){
			$scope.fastDonePoint = $scope.flowData.taskDetail.fastDonePoint;
			$scope.flowData.taskDetail.totalPoint += parseFloat($scope.flowData.taskDetail.fastDonePoint);
		}
		if($scope.flowData.taskDetail.agreeAddtionPoint){
			$scope.addtionPoint = $scope.flowData.taskDetail.addtionPoint;
			$scope.flowData.taskDetail.totalPoint +=  parseFloat($scope.flowData.taskDetail.addtionPoint);
		}
		if($scope.flowData.taskDetail.agreePriorityReview){
			$scope.priorityReviewPoint = 5;
			$scope.flowData.taskDetail.totalPoint += 5;
		}
		if($scope.flowData.taskDetail.extensionShopingPeriod > 0){
			$scope.extPeriodPoint = $scope.flowData.taskDetail.extensionShopingPeriod;
			$scope.flowData.taskDetail.totalPoint += parseFloat($scope.flowData.taskDetail).extensionShopingPeriod;
		}
		if($scope.flowData.taskDetail.agreeQualityPraise){
			$scope.qualityPraisePoint = 1 * $scope.flowData.totalTasks;
			$scope.flowData.taskDetail.totalPoint += 1 * $scope.flowData.totalTasks;
		}
		$scope.flowData.taskDetail.totalCash = parseInt($scope.flowData.totalTasks) * parseFloat($scope.flowData.productId.productPrice);
	};
	
	$scope.setFaskDone = function(point){
		angular.forEach($scope.fastDoneOption,function(value, key){
			if(point == key){
				$scope.fastDoneOption[key] = true;
			}else{
				$scope.fastDoneOption[key] = false;
			}
		});
		$scope.flowData.taskDetail.fastDonePoint = point;
		$scope.countTotal();
	};
	$scope.extShopingPeriodOption = { "2" : false, "3" : false };
	$scope.setShopingPeriod = function(time){
		angular.forEach($scope.extShopingPeriodOption,function(value, key){
			if(time == key){
				$scope.extShopingPeriodOption[key] = true;
			}else{
				$scope.extShopingPeriodOption[key] = false;
			}
		});
		$scope.flowData.taskDetail.extensionShopingPeriod = time;
		$scope.countTotal();
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
app.controller('TaskFlowItem6Ctrl',['$scope','$timeout', function($scope,$timeout){
	$scope.thisItem = "app.task.item6";
	$scope.flowData = {}; 
	$scope.timespan = 5;
	$scope.$on('flow-ready',function(event,flowData){
		$scope.flowData = flowData;
		timeout5();
	});
	var timeout5 = function(){
		$timeout(function(){
			$scope.timespan--;
			if($scope.timespan <= 0){
				$scope.payOk();
			}else{
				timeout5();
			}
		},1000);
	};
	$scope.payOk = function(){
		$scope.$emit('pay-ok', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
	$scope.payCancel = function(){
		$scope.$emit('pay-cancel', { "item" : $scope.thisItem, "flowData" : $scope.flowData });
	};
}]);
//待处理的任务
app.controller('PeddingTaskCtrl',['$scope','$stateParams','platforms',function($scope,$stateParams,platforms){
	$scope.platformName = "";
	$scope.$watch('$viewContentLoaded',function(){
		var platformId = $stateParams.platformId;
		$scope.platformName = platforms.getPlatformName(platformId);
	});
}]);
//查询任务
app.controller('TaskListCtrl',['$scope','$stateParams','taskStatuss','tasks',function($scope,$stateParams,taskStatuss,tasks){
	$scope.statusId = 1;
	$scope.statusName = "";
	$scope.taskList = [];
	$scope.taskStats = { all : 8, doing : 2, finish : 6 };
	$scope.$watch('$viewContentLoaded',function(){
		$scope.statusId = $stateParams.status;
		var statuss = taskStatuss.getAll();
		angular.forEach(statuss,function(value){
			if(value.id == $scope.statusId){
				$scope.statusName = value.name;
			}
		});
		queryTasksByStatusId($scope.statusId);
		//TODO:统计不同状态下任务的数量
		$scope.taskStats = { all : 8, doing : 2, finish : 6 };		
	});
	$scope.filterByStatusId = function(statusId){
		//TODO:根据状态来过滤task
		$scope.taskList = queryTasksByStatusId(statusId);		
	};
	$scope.filterByCondition = function(condition){
		//TODO:根据状态来过滤task
		$scope.taskList = queryTasksByCondition(condition);		
	};
	//TODO:查询所有任务
	var queryTasks = function(platformId){
		return [];
	};
	//TODO:查询进行中的任务
	var queryTasksByStatusId = function(statusId){
		tasks.query(statusId).then(function(result){
			$scope.taskList = result;
		});
	};
	//TODO:查询已完成的任务
	var queryTasksByCondition = function(condition){
		return [];
	};
	$scope.getShopName = function(json){
		return angular.fromJson(json).shopName;
	};
	$scope.getTaskTotalCach = function(json){
		return angular.fromJson(json).totalCash;
	};
	$scope.getTaskTotalPoint = function(json){
		return angular.fromJson(json).totalPoint;
	};
}]);
//筛选控制器
app.controller('TaskFilterCtrl',['$scope','$stateParams','platforms','sellerShops','taskTypes','terminals',function($scope,$stateParams,platforms,sellerShops,taskTypes,terminals){
	var userId = app.userSession.userId;
	$scope.platforms = [];
	$scope.shops = [];
	$scope.taskTypes = [];
	$scope.terminals = [];
	$scope.condition = {
		platform : -1,
		shop : -1,
		taskType : -1,
		terminal : -1
	};
	$scope.$watch('$viewContentLoaded',function(){
		//初始化平台下拉列表
		$scope.platforms = platforms.getAll();
		//初始化店铺
		if(angular.isUndefined($stateParams.platformId)){
			initSellerShopList();
		}else{
			initSellerShopListByPlatformId($stateParams.platformId);
		}		
		//初始化任务类型
		$scope.taskTypes = taskTypes.getAll();	
		//初始化终端
		$scope.terminals = terminals.getAll();
	});
	$scope.query = function(){
		//传递事件触发查询任务
		$scope.$emit('filter-task', $scope.condition);
	};
	var initSellerShopList = function(){
	    sellerShops.getAllShops(userId).then(function(result){
	      $scope.shops = result;
	    });
	};
	var initSellerShopListByPlatformId = function(platformId){
		sellerShops.query(userId,platformId).then(function(result){
	      $scope.shops = result;
	    });
	};
}]);