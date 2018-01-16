angular.module('app.auth',[])
    .factory('AuthInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS', function ($rootScope, $q, AUTH_EVENTS) {
        if (!$rootScope.activeCalls) {
            $rootScope.activeCalls = 0;
        }
        return {
            request : function (config) {
                $rootScope.activeCalls += 1;
                config.headers = config.headers || {};
                if (localStorage.getItem('access_token')) {
                    config.headers.Authorization =localStorage.getItem('access_token');
                }
                return config;
            },
            requestError: function (rejection) {
                $rootScope.activeCalls -= 1;
                return rejection;
            },
            response: function (response) {
                $rootScope.activeCalls -= 1;
                return response;
            },
            responseError: function (response) {
                $rootScope.activeCalls -= 1;
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized,
                    419: AUTH_EVENTS.sessionTimeout,
                    440: AUTH_EVENTS.sessionTimeout
                }[response.status], response);
                return $q.reject(response);
            }
        };
    }])
    .service('Session', function () {
        this.create = function (userId) {
            this.userId = userId;
        };
        this.destroy = function () {
            this.userId = null;
        };
        return this;
    })
    .factory('AuthService', ['$http', 'Session', function ($http, Session) {
      console.log("init authService");
        if(localStorage.getItem('user')) {
            try {
                var user = JSON.parse(localStorage.getItem('user'));
                Session.create(user.user_id);
            } catch (e){
                localStorage.removeItem('user');
            }
        }
        var authService = {};
        // 是否登录
        authService.isAuthenticated = function () {
            return !!Session.userId;
        };
        // 是否授权
        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
            authorizedRoles.indexOf(Session.userRole) !== -1);
        };
        return authService;
    }]);
