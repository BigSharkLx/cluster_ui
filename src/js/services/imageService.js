/**
 * Created by Bigshark on 2017/12/15.
 */
"use strict";

angular.module('app.image', [])
.factory('Image', ['$resource', function ($resource) {
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
    return $resource('/api/repositories/:project_name/:image_name', {project_name: '@project_name',image_name:'@image_name'},
    defaultFunction);
}])
    .service('imageService', ['$http', function ($http) {

    }]);
