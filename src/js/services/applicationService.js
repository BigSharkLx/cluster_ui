angular.module('app.application',[])
.factory('Application',  ['$resource', function($resource) {
  return $resource('/api/v1/space/:spaceId/applications/:appUuid',
  {spaceId:'@spaceId',appUuid:'@appUuid'},
  {update:{method:'PUT',isArray:false}});
}])
.service('ApplicationService', ['$http', function ($http) {

}]);
