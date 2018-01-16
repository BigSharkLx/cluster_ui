/**
 * Created by Bigshark on 2017/12/15.
 */
"use strict";

angular.module('app.node', [])
    .factory('Node', ['$resource', function ($resource) {

        return $resource('/api/v1/node/:nodeName', {nodeName: '@nodeName'},{
        update:{method:'PUT',isArray:false}
        });
    }])
    .service('NodeService', ['$http', function ($http) {

    }]);
