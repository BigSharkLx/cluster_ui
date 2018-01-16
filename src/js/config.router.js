'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    ['$rootScope', '$state', '$stateParams','AuthService', '$templateCache', 'AUTH_EVENTS',
      function ($rootScope,   $state,   $stateParams, AuthService, $templateCache, AUTH_EVENTS) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;

          $rootScope.$on('$stateChangeStart', function (event, next, current) {
                    if (typeof(current) !== 'undefined') {
                        $templateCache.remove(current.templateUrl);
                    }
                });

                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

                    // 登录拦截
                    if ((toState.name === '404') || (toState.name === 'index') || (toState.name === 'access_token')) {
                        return;
                    } else {
                        if (!AuthService.isAuthenticated()) {
                            event.preventDefault();
                            // 未登录
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        }
                    }
                });
      }
    ]
  )
  .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
  ])
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG) {

          $urlRouterProvider
              .otherwise('/index');
          $stateProvider
          .state('access_token', {
                        url: '/token_type=:access_token',
                        templateUrl: 'tpl/access_board.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                        return $ocLazyLoad.load(['js/controllers/accessBoardCtrl.js']);
                                }]
                        }
                    })
          .state('app', {
            abstract: true,
            url: '/app',
            templateUrl: 'tpl/app.html',
            resolve: {
              deps: ['$ocLazyLoad',
              function ($ocLazyLoad) {
                return $ocLazyLoad.load('toaster').then(
                  function () {
                    return $ocLazyLoad.load(['js/controllers/indexCtrl.js']);
                  }
                );
              }]
            }
              })
              .state('index', {
                        url: '/index',
                        templateUrl: 'tpl/landing_page.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                      return $ocLazyLoad.load(['js/controllers/indexCtl.js']);
                                }]
                        }
                    })
              .state('app.dashboard', {
                  url: '/dashboard',
                  templateUrl: 'tpl/app_dashboard.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['js/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.spaceslist', {
                  url: '/spaceslist',
                  templateUrl: 'tpl/spaces_list.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['js/controllers/spacesList.js']);
                    }]
                  }
              })
              .state('app.projectslist', {
                  url: '/projectslist',
                  templateUrl: 'tpl/projects_list.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['js/controllers/projectslist.js']);
                    }]
                  }
              })
              .state('app.apps',{
                    url: '/apps',
                    template: '<div ui-view  ></div>',
                    abstract: true
                })
              .state('app.apps.list', {
                  url: '/:space_id/list',
                  templateUrl: 'tpl/app_list.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load(['js/controllers/appListCtrl.js']);
                          }]
                  }
              })
              .state('app.apps.detail', {
                  url: '/detail',
                  templateUrl: 'tpl/app_detail.html',
              })
              .state('app.images',{
                    url: '/images',
                    template: '<div ui-view  ></div>',
                    abstract: true
                })
              .state('app.images.list', {
                  url: '/:project_id/list',
                  templateUrl: 'tpl/image_list.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load(['js/controllers/imageListCtrl.js']);
                          }]
                  }
              })
              .state('app.images.detail', {
                  url: '/detail',
                  templateUrl: 'tpl/image_detail.html',
              })
              .state('app.projects',{
                    url: '/projects',
                    template: '<div ui-view  ></div>',
                    abstract: true
                })
              .state('app.projects.list', {
                  url: '/list',
                  templateUrl: 'tpl/project_list.html',
              })
              .state('app.projects.detail', {
                  url: '/detail',
                  templateUrl: 'tpl/project_detail.html',
              })
              .state('app.stacks',{
                    url: '/stacks',
                    template: '<div ui-view  ></div>',
                    abstract: true
                })
              .state('app.stacks.list', {
                  url: '/list',
                  templateUrl: 'tpl/stack_list.html',
              })
              .state('app.stack.detail', {
                  url: '/detail',
                  templateUrl: 'tpl/stack_detail.html',
              })
              .state('app.nodes',{
                    url: '/nodes',
                    template: '<div ui-view  ></div>',
                    abstract: true
                })
              .state('app.nodes.list', {
                  url: '/list',
                  templateUrl: 'tpl/node_list.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load(['js/controllers/clusterListCtrl.js']);
                          }]
                  }
              })
              .state('app.nodes.detail', {
                  url: '/detail',
                  templateUrl: 'tpl/node_detail.html',
              })

              .state('app.store',{
                    url: '/store',
                    templateUrl: 'tpl/app_store.html',
                })
              .state('app.store.detail', {
                  url: '/detail',
                  templateUrl: 'tpl/store_detail.html',
              })
              .state('app.ui', {
                  url: '/ui',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
      }
    ]
  );
