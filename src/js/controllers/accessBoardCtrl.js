/**
 * Created by Domoke on 2017/7/28.
 */
//"use strict";
app.controller('AccessBoardCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$location',  'Session', 'AUTH_EVENTS', function ($scope, $rootScope, $state, $stateParams, $log, $location, Session, AUTH_EVENTS) {
    var hash = $location.path().substr(1);
    var splitted = hash.split('&');
    var params = {};

    for (var i = 0; i < splitted.length; i++) {
        var param  = splitted[i].split('=');
        var key    = param[0];
        var value  = param[1];
        params[key] = value;
    }
    // 处理登录后的跳转问题
    try {
        if(params.access_token) {
            var tempArr = params.access_token.split('.');
            if(tempArr.length < 3) {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                $state.go('index');
                return ;
            }
            var user_str= window.atob(tempArr[1]);
            var user = JSON.parse(user_str);
            if(user.user_id !== localStorage.getItem('userGuid')) {
                localStorage.clear();
            }
            localStorage.setItem('access_token', params.access_token);
            localStorage.setItem('user', user_str);
            localStorage.setItem('userGuid', user.user_id);
            localStorage.setItem('tp_version', $scope.app.version);
            //user.nick_name = user.nick_name?user.nick_name:user.user_name.split('@')[0];
            $scope.setCurrentUser(user);
            Session.create(user.user_id);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            if(localStorage.getItem('url')){
                window.location.href = localStorage.getItem('url');
            } else {
                $state.go('app.dashboard');
            }
        } else {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            $state.go('index');
        }

    } catch (e) {
        $log.error(e);
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        $state.go('index');
    }

}]);
