/**
 * Created by Bigshark on 2017/12/15.
 */
"use strict";
app.controller('indexController', ['$scope', '$rootScope', '$state', '$log','Space','toaster','imageProjects', function($scope, $rootScope, $state, $log,Space,toaster,imageProjects) {
    var vm = this;

// 获取用户名称
vm.user_name=JSON.parse(localStorage.getItem('user')).user_name;
var user_id=localStorage.getItem('userGuid');
// 获取用户的所有空间

var getSpaces = function () {
  vm.spaceList = [];
  Space.getSpace({
    guid:user_id
  }).$promise.then(function (data) {
vm.spaceList=data.namespaces;
  },function(err){
    console.log(err);
    toaster.pop('error', '', '获取用户空间失败');
  });
};
getSpaces();

// 获取用户的所有镜像仓库

var getImageProjects = function () {
  vm.imageProjectsList = [];
  imageProjects.query().$promise.then(function (data) {
vm.imageProjectsList=data;
  },function(err){
    console.log(err);
    toaster.pop('error', '', '获取用户空间失败');
  });
};
getImageProjects();
}]);
app.controller('LogoutCtl', ['$scope', '$rootScope', '$state', '$log', '$stateParams', 'Session', 'AUTH_EVENTS', function ($scope, $rootScope, $state, $log, $stateParams, Session, AUTH_EVENTS) {

    // 退出登录
    $scope.logout = function () {
        Session.destroy();
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('userGuid');
        localStorage.removeItem('url');
        $scope.setCurrentUser(null);
        window.location.href = $scope.app.uaaUrl + "/logout.do"
    };
}]);
