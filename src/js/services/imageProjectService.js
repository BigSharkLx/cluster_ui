/**
 * Created by Bigshark on 2017/12/15.
 */
"use strict";

angular.module('app.imageProject', [])
.factory('imageProjects', ['$resource', function ($resource) {
  // 需要登录后获取
var access_token=localStorage.getItem('access_token');


var headers={
   'Authorization': access_token
}
  var defaultFunction = {
    query: {
      method:'GET',
       isArray: true,
      headers: headers
    },
    get: {
      method:'GET',
       isArray: false,
      headers: headers
    },
    update: {
      method:'PUT',
      isArray: false,
      headers: headers
    },
    save : {
      method:'POST',
      isArray: false,
      headers: headers
    },
    delete:{
      method:'DELETE',
      isArray: false,
      headers: headers
    }
    };
    return $resource('/api/projects/:projectId', {projectId: '@projectId'},
    defaultFunction);
}])
    .service('imageProjectService', ['$http', function ($http) {

    }]);
