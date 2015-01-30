'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams', '$window','$location',
      function ($rootScope,   $state,   $stateParams,  $window, $location) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
          function init(){
            //从浏览器缓存里获取用户session
            if (angular.isObject(angular.fromJson($window.localStorage.getItem("userSession")))) {
              app.userSession = angular.fromJson($window.localStorage.getItem("userSession"));
            }else{
              app.userSession = null;
            }            
          };  
          //在注册一个路由事件，监听ui-route stats的改变
          $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //如果没有登录就跳到登录页面
            if(toState.name != "access.signin"  && (angular.isUndefined(app.userSession) || app.userSession == null)){
              //event.preventDefault(); 
              //$location.path("/access/signin");
              toState.name = "access.signin";
              toState.url = "/access/signin";
              $location.path("/access/signin");
            }
          });          
          init();
      }
    ]
  )
  .config(
    [ '$httpProvider',  function ($httpProvider) {          
        $httpProvider.interceptors.push('sessionInjector');
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {
          
          $urlRouterProvider
              .otherwise('/app/dashboard-v1');
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: 'tpl/app.html'               
              })
              .state('app.dashboard-v1', {
                  url: '/dashboard-v1',
                  templateUrl: 'tpl/app_dashboard_v1.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['js/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.account', {
                  url: '/account',
                  template: '<div ui-view></div>',
                  resolve: {
                    deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('angularFileUpload').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/jzj.account.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.account.user', {
                  url: '/user',
                  templateUrl: 'tpl/account_profile.html'
              })
              .state('app.account.userbank', {
                  url: '/userbank',
                  templateUrl: 'tpl/account_userbank.html'
              })
              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })
              .state('access.signin', {
                  url: '/signin',
                  templateUrl: 'tpl/page_signin.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/jzj.signin.js'] );
                      }]
                  }
              })
              .state('access.signup', {
                  url: '/signup',
                  templateUrl: 'tpl/page_signup.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/jzj.signup.js'] );
                      }]
                  }
              })
              .state('access.forgotpwd', {
                  url: '/forgotpwd',
                  templateUrl: 'tpl/page_forgotpwd.html'
              })
              .state('access.404', {
                  url: '/404',
                  templateUrl: 'tpl/page_404.html'
              })
              // buyer
              .state('app.buyer', {
                  abstract: true,
                  url: '/buyer',
                  templateUrl: 'tpl/buyer.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/jzj.account.js','js/directives/jzj.directives.js','vendor/libs/moment.min.js','vendor/libs/city.min.js'] );
                      }]
                  }
              })
              .state('app.buyer.account', {
                  url: '/account',
                  templateUrl:'tpl/buyer_bind_account.html'
              })
              .state('app.buyer.taobao', {
                  url: '/taobao',
                  templateUrl:'tpl/buyer_bind_taobao.html'
              })
              .state('app.buyer.tmall', {
                  url: '/tmall',
                  templateUrl:'tpl/buyer_bind_tmall.html'
              })
              .state('app.buyer.jd', {
                  url: '/jd',
                  templateUrl:'tpl/buyer_bind_jd.html'
              })
              .state('app.buyer.yhd', {
                  url: '/yhd',
                  templateUrl:'tpl/buyer_bind_yhd.html'
              })
              .state('app.buyer.dangdang', {
                  url: '/dangdang',
                  templateUrl:'tpl/buyer_bind_dangdang.html'
              })
              .state('app.buyer.amazon', {
                  url: '/amazon',
                  templateUrl:'tpl/buyer_bind_amazon.html'
              })
              // seller
              .state('app.seller', {
                  abstract: true,
                  url: '/seller',
                  templateUrl: 'tpl/seller.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/jzj.account.js','js/directives/jzj.directives.js','vendor/libs/moment.min.js','vendor/libs/city.min.js'] );
                      }]
                  }
              })
              .state('app.seller.shop', {
                  url: '/shop',
                  templateUrl:'tpl/seller_bind_shop.html'
              })
              .state('app.seller.taobao', {
                  url: '/taobao',
                  templateUrl:'tpl/seller_bind_taobao.html'
              })
              .state('app.seller.tmall', {
                  url: '/tmall',
                  templateUrl:'tpl/seller_bind_tmall.html'
              })
              .state('app.seller.jd', {
                  url: '/jd',
                  templateUrl:'tpl/seller_bind_jd.html'
              })
              .state('app.seller.yhd', {
                  url: '/yhd',
                  templateUrl:'tpl/seller_bind_yhd.html'
              })
              .state('app.seller.dangdang', {
                  url: '/dangdang',
                  templateUrl:'tpl/seller_bind_dangdang.html'
              })
              .state('app.seller.amazon', {
                  url: '/amazon',
                  templateUrl:'tpl/seller_bind_amazon.html'
              })

              
              .state('app.task', {
                  url: '/taskflow/:id',
                  templateUrl: 'tpl/task_flow.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/jzj.task.js'] );
                      }]
                  }              
              })
              .state('app.task.item1', {
                  url: '/item1',
                  templateUrl: 'tpl/task_item_1.html'                  
              })
              .state('app.task.item2', {
                  url: '/item2',
                  templateUrl: 'tpl/task_item_2.html'                  
              })
              .state('app.task.item3', {
                  url: '/item3',
                  templateUrl: 'tpl/task_item_3.html'                  
              })
              .state('app.task.item4', {
                  url: '/item4',
                  templateUrl: 'tpl/task_item_4.html'                  
              })
              .state('app.task.item5', {
                  url: '/item5',
                  templateUrl: 'tpl/task_item_5.html'                  
              })
              .state('app.task.item6', {
                  url: '/item6',
                  templateUrl: 'tpl/task_item_6.html'                  
              })
              .state('app.tasklist', {
                  url: '/tasklist/:status',
                  templateUrl: 'tpl/task_list.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/jzj.task.js'] );
                      }]
                  }                   
              })
              .state('app.tasklist.filter', {
                  url: '/filter/:filter',
                  templateUrl: 'tpl/task_list.html'                  
              })
              .state('app.peddingtask', {
                  url: '/peddingtask/:platformId',
                  templateUrl: 'tpl/pedding_task.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/jzj.task.js'] );
                      }]
                  }                   
              })
              .state('app.financial', {
                  url: '/financial',
                  template: '<div ui-view></div>',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/jzj.financial.js'] );
                      }]
                  }              
              })                        
              .state('app.financial.recharge_history', {
                  url: '/recharge_history',
                  templateUrl: 'tpl/recharge_history.html'                  
              })              
              .state('app.financial.cashout_history', {
                  url: '/cashout_history',
                  templateUrl: 'tpl/cashout_history.html'                  
              })
              .state('app.financial.points2cash_history', {
                  url: '/points2cash_history',
                  templateUrl: 'tpl/points2cash_history.html'                  
              })  
              .state('app.financial.trans_history', {
                  url: '/trans_history',
                  templateUrl: 'tpl/trans_history.html'                  
              })
              .state('app.financial.rechange', {
                  url: '/rechange',
                  templateUrl: 'tpl/rechange.html'                  
              })
              .state('app.financial.cashout', {
                  url: '/cashout',
                  templateUrl: 'tpl/cashout.html'                  
              })

      }
    ]
  );
