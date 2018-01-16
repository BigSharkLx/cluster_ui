'use strict';

/* Controllers */

angular.module('app')
.controller('AppCtrl', ['$scope', '$state', '$translate', '$localStorage', '$window', '$log', 'AUTH_EVENTS', 'Session', 'notificationService', '$http',
function($scope, $state, $translate, $localStorage, $window, $log, AUTH_EVENTS, Session, notificationService, $http) {
  // add 'ie' classes to html
  var isIE = !!navigator.userAgent.match(/MSIE/i);
  isIE && angular.element($window.document.body).addClass('ie');
  isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

  // config
  $scope.app = {
    name: 'TrueCube',
    version: '2.0.1',
    // for chart colors
    color: {
      primary: '#7266ba',
      info:    '#23b7e5',
      success: '#27c24c',
      warning: '#fad733',
      danger:  '#f05050',
      light:   '#e8eff0',
      dark:    '#3a3f51',
      black:   '#1c2b36'
    },
    settings: {
      themeID: 1,
      navbarHeaderColor: 'bg-black',
      navbarCollapseColor: 'bg-white-only',
      asideColor: 'bg-black',
      headerFixed: true,
      asideFixed: false,
      asideFolded: false,
      asideDock: false,
      container: false
    },
    copyrightYear:'2017',
    companyName:'TrueCube',
    companySimpleName:'TrueCube',
    serviceEmail:'support@truepaas.com',
    companySite:'/',
    docUrl: 'https://docs.truepaas.com',
    uaaUrl: 'https://ucenter.truepaas.com',
    svcMysql: 'https://mysql-admin.truepaas.com/index.php',
    svcGlusterfs: 'https://userglusterfs.truepaas.com/loginuser'
  }

  $http.get('config.json').then(function (resp) {
    angular.extend($scope.app, resp.data);
  });

  // save settings to local storage
  if ( angular.isDefined($localStorage.settings) ) {
    $scope.app.settings = $localStorage.settings;
  } else {
    $localStorage.settings = $scope.app.settings;
  }
  $scope.$watch('app.settings', function(){
    if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
      // aside dock and fixed must set the header fixed.
      $scope.app.settings.headerFixed = true;
    }
    // save to local storage
    $localStorage.settings = $scope.app.settings;
  }, true);

  // angular translate
  $scope.lang = { isopen: false };
  $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
  $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
  $scope.setLang = function(langKey, $event) {
    // set the current lang
    $scope.selectLang = $scope.langs[langKey];
    // You can change the language during runtime
    $translate.use(langKey);
    $scope.lang.isopen = !$scope.lang.isopen;
  };

  function isSmartDevice( $window )
  {
    // Adapted from http://www.detectmobilebrowsers.com
    var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
    // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
    return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
  }

  // 当前用户
  try {
    $scope.currentUser = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):null;
  } catch(e) {
    $log.error(e);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    Session.destroy();
    $scope.setCurrentUser(null);
    notificationService.error('未登录或登录失效');
    $state.go('index');
  }

  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };

  $scope.$on(AUTH_EVENTS.notAuthenticated, function () {
    // 未登录
    $log.info('AUTH_EVENTS.notAuthenticated==>' + AUTH_EVENTS.notAuthenticated);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    Session.destroy();
    $scope.setCurrentUser(null);
    notificationService.error('未登录或登录失效');
    $state.go('index');
  });
  $scope.$on(AUTH_EVENTS.notAuthorized, function () {
    // 未授权
    toaster.pop('warning', '', '未授权');
    $log.info('AUTH_EVENTS.notAuthorized==>' + AUTH_EVENTS.notAuthorized);
  });
  $scope.$on(AUTH_EVENTS.sessionTimeout, function () {
    // 登录失效
    $log.info('AUTH_EVENTS.sessionTimeout');
    // 删除登录用户信息
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    $scope.setCurrentUser(null);
    Session.destroy();
    notificationService.error('登录超时，请重新登录');
    $state.go('index');
  });
  $scope.$on(AUTH_EVENTS.loginSuccess, function () {
    notificationService.success('登录成功');
    $log.info('AUTH_EVENTS.loginSuccess');
  });
  $scope.$on(AUTH_EVENTS.loginFailed, function () {
    notificationService.error('登录失败');
    $log.info('AUTH_EVENTS.loginFailed');
  });
  $scope.$on(AUTH_EVENTS.logoutSuccess, function () {
    notificationService.success('成功退出');
    $log.info('AUTH_EVENTS.logoutSuccess');
  });

  // 监听空间名称的修改
  $scope.$on("SpaceNameChange", function (event, msg) {//接收到来自子controller的信息后再广播给所有子controller
    $scope.$broadcast("BroadcastSpaceNameChange", msg);//给所有子controller广播
  });

  // 监听组织名称的修改
  $scope.$on("OrgNameChange", function (event, msg) {//接收到来自子controller的信息后再广播给所有子controller
    $scope.$broadcast("BroadcastOrgNameChange", msg);//给所有子controller广播
  });

}]);
