'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {
          
          $urlRouterProvider
              .otherwise('/access/signin');
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
              .state('app.account.profile', {
                  url: '/profile',
                  templateUrl: 'tpl/account_profile.html'
              })
              .state('app.account.cashout', {
                  url: '/cashout',
                  templateUrl: 'tpl/account_cashout.html'
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
                          return uiLoad.load( ['js/controllers/jzj.account.js','js/directives/jzj.directives.js','vendor/libs/moment.min.js'] );
                      }]
                  }
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
                          return uiLoad.load( ['js/controllers/jzj.account.js','js/directives/jzj.directives.js','vendor/libs/moment.min.js'] );
                      }]
                  }
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
      }
    ]
  );