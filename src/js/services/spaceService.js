/**
 * Created by Bigshark on 2017/12/15.
 */
"use strict";

angular.module('app.space', [])
    .factory('Space', ['$resource', function ($resource) {

        return $resource('/api/v1/spaces/:guid', {guid: '@guid'},{
        update:{method:'PUT',isArray:false},
        getSpace:{url:'/api/v1/spaces/users/:guid',method:'GET'}
        });
    }])
    .service('SpaceService', ['$http', function ($http) {

    }]);
