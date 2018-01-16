/**
* Created by Bigshark on 2017/12/15.
*/
app.controller('AppListCtrl',['$rootScope', '$scope', '$log', 'Space','$http','$confirm','toaster','$modal','i18nService','$stateParams','$state','$window','Application','Image','imageProjects',function($rootScope, $scope, $log, Space,$http,$confirm,toaster,$modal,i18nService,$stateParams,$state,$window,Application,Image,imageProjects) {
  i18nService.setCurrentLang('zh-cn');
  var vm=this;
  // 拿到空间的id
  var space_id=$stateParams.space_id;

  // 获取空间名称
  var getSpaceDetail=function(){
    Space.get({guid:space_id}).$promise.then(function(data){
      vm.spaceName=data.metadata.name;
    })
  }
  getSpaceDetail();

  var optCellTemplate = '<div class="ui-grid-cell-contents btn-group">' +
  '<button type="button" class="btn btn-sm btn-primary m-r-xs" ng-click="grid.appScope.detailAppList(row.entity)"><i class="fa fa-reorder fa-fw"></i>详情</button>'+
  '<button type="button" class="btn btn-sm btn-success m-r-xs" ng-click="grid.appScope.editAppList(row.entity)"><i class="fa fa-pencil-square-o fa-fw"></i>修改</button>' +
  '<button type="button" class="btn btn-sm btn-danger m-r-xs" ng-click="grid.appScope.delAppList(row.entity)"><i class="fa fa-trash-o fa-fw"></i>删除</button>'+
  '</div>';
  // 分页配置
  var paginationOptions = {
    pageNo: 1,
    pageSize: 10,
    sort: []
  };
  vm.gridOptionsApplist = {
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    paginationPageSize: paginationOptions.pageSize,
    paginationPageSizes: [5, 10, 20, 30],
    useExternalPagination: true,
    useExternalSorting: true,
    rowHeight: 46,
    columnDefs: [
      { name: 'app_name', enableFiltering: false, displayName: '应用名称'},
      { name: 'type', enableFiltering: false, displayName: '应用类型'},
      { name: 'description', enableFiltering: false, displayName: '描述'},
      { name: 'private', enableFiltering: false, displayName: 'private'},
      { name: 'guid', enableFiltering:false,displayName:'操作',width:"210", cellTemplate:optCellTemplate}
    ],
    onRegisterApi: function(gridApi) {
      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length === 0) {
          paginationOptions.sort = [];
        } else {
          angular.forEach(sortColumns, function (item) {
            paginationOptions.sort.push({
              name:item.field,
              direction:item.sort.direction
            });
          });
        }
        getApplist();
      });
      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
        paginationOptions.pageNo = newPage;
        paginationOptions.pageSize = pageSize;
        getApplist();
      });
    }
  };
  // 获取应用数据
  var getApplist=function(){
    vm.appList=[];
    Application.get({spaceId:space_id}).$promise.then(res=>{
      var data = res.deployments;
      if(data){
        for(var i in data) {
          vm.appList.push({
            app_name:data[i].app_name,
            description:data[i].description,
            private:data[i].private,
            type:data[i].type,
            app_uuid:data[i].app_uuid
          });
        }
        vm.totalApps=data.length;
        vm.gridOptionsApplist.totalItems = data.length;
      }
      vm.gridOptionsApplist.data = vm.appList;
    })
  }
  // 首次加载
  getApplist();

  // 刷新grid
  vm.refreshGrid = function () {
    getApplist();
  };
  // 新增应用

  vm.addApps=function(){
    var modalInstance = $modal.open({
      templateUrl: 'tpl/modal/appList/addApp_modal.html',
      controller: 'AddAppCtrl as addApp',
      resolve: {
        deps: ['$ocLazyLoad',
        function ($ocLazyLoad) {
          return $ocLazyLoad.load('angularFileUpload');
        }],
        item:function(){
          return space_id
        }
      }
    });
    modalInstance.result.then(function (result) {
      if (result === 'success') {
        getApplist();
        return toaster.pop('success', '', '新增应用成功');
      }
      return toaster.pop('error', '', '新增应用失败');
    });
  }

// 应用详情
$scope.detailAppList=function(entity){
  var modalInstance = $modal.open({
    templateUrl: 'tpl/modal/appList/detailApp_modal.html',
    controller: 'detailAppCtrl as detailApp',
    resolve: {
      item:function(){
        return {
          spaceId:space_id,
          app_uuid:entity.app_uuid
        }
      }
    }
  });
}
// 修改应用
// $scope.editAppList=function(){
//   var modalInstance = $modal.open({
//     templateUrl: 'tpl/modal/appList/addApp_modal.html',
//     controller: 'AddAppCtrl as addApp',
//     resolve: {
//       deps: ['$ocLazyLoad',
//       function ($ocLazyLoad) {
//         return $ocLazyLoad.load('angularFileUpload');
//       }],
//       item:function(){
//         return space_id
//       }
//     }
//   });
//   modalInstance.result.then(function (result) {
//     if (result === 'success') {
//       getApplist();
//       return toaster.pop('success', '', '新增应用成功');
//     }
//     return toaster.pop('error', '', '新增应用失败');
//   });
// }

// 删除应用
$scope.delAppList=function(entity){
  //使用confirm确认是否删除
  $confirm({
    text: '确认要删除[  ' + '应用' +entity.app_name+'   ]吗?',
    title: "确认删除",
    ok: "确认",
    cancel: '取消'
  }).then(function () {
    Application.delete({spaceId:space_id,appUuid:entity.app_uuid}).$promise.then(function(data){
      //删除成功提示
      toaster.pop('success', '', '删除成功！');
      getApplist();
    },function(err){
      console.log(err);
      toaster.pop('error', '', '删除失败！');
    });
  });
}




  //搜索
  $scope.$watch('searchApp', function (newVal, oldVal) {
    if (newVal === oldVal)
    return;
    vm.gridOptionsApplist.data = vm.appList.filter(function (data) {
      if (data.app_name) {
        if ((data.app_name.toLowerCase().indexOf($scope.searchApp.toLowerCase()) > -1)||(data.description.toLowerCase().indexOf($scope.searchApp.toLowerCase()) > -1)||(data.type.toLowerCase().indexOf($scope.searchApp.toLowerCase()) > -1)){
          return true;
        }
        else {
          return false;
        }
      }
    });
  });
}])

// 新增应用
app.controller('AddAppCtrl', ['$scope', '$modalInstance', 'toaster', '$log','Space','$window','Application','item', 'Image', 'imageProjects', function ($scope, $modalInstance, toaster, $log,Space,$window,Application,item,Image,imageProjects) {
  // view model
  var vm = this;
  vm.user_id=localStorage.getItem('userGuid');
  vm.namespace=item;

imageProjects.query().$promise.then(function(res){
  vm.totalData=[];
for(let i of res){
Image.query({project_id:i.project_id}).$promise.then(function(data){
    var imageList=[];
for(let j of data){
  if(data.length!==0){
    imageList.push(j.name);
  }
}
vm.totalData.push({
project:i.name,
images:imageList
})
vm.project=vm.totalData[0];
vm.containerImage=vm.project.images[0]
})
}
})

vm.projectChange = function(){
          vm.containerImage=vm.project.images[0];
      };

  // 默认数据
  vm.private='false';
  vm.isExternal='false';
  vm.runAsPrivileged='false';
  vm.type='replication controller';
  vm.imagePullSecret=null;
  vm.containerCommand=null;
  vm.containerCommandArgs = null;
  vm.arr=[];
  vm.memoryRequirement=200;
  vm.cpuRequirement=100;
  vm.replicas=1;

  // 新增空间确定
  vm.ok = function (myForm) {
    myForm.$setDirty();
    if (!myForm.$valid) {
      toaster.pop('error', '', '信息填写不正确');
      return;
    }
    // 防止重复提交
    vm.submitted = true;
    // // 新增空间
    Application.save({
      "name": vm.name,
      "user_id":vm.user_id ,
      "description": vm.description,
      "type": vm.type,
      "private": vm.private==='false'?false:true,
      "containerImage": vm.containerImage,
      "imagePullSecret": vm.imagePullSecret,
      "containerCommand": vm.containerCommand,
      "containerCommandArgs": vm.containerCommandArgs,
      "replicas": vm.replicas,
      "portMappings": [],
      "variables": [],
      "isExternal": vm.isExternal==='false'?false:true,
      "namespace": vm.namespace,
      "memoryRequirement": vm.memoryRequirement+'M',
      "cpuRequirement": vm.cpuRequirement+'m',
      "labels":[{
        "key":"app",
        "value":vm.app_value
      },{
        "key":"version",
        "value":vm.version_value
      }],
      "runAsPrivileged": vm.runAsPrivileged==='false'?false:true
    }).$promise.then(function (resp) {
      $modalInstance.close('success');
    }, function (err) {
      vm.submitted = false;
      $log.error(err);
      $modalInstance.close('error');
    });
  }

  // 取消
  vm.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);

// 应用详情
app.controller('detailAppCtrl', ['$scope', '$modalInstance', 'toaster', '$log','Space','$window','Application','item', function ($scope, $modalInstance, toaster, $log,Space,$window,Application,item) {
  // view model
  var vm = this;
Application.get({spaceId:item.spaceId,appUuid:item.app_uuid}).$promise.then(function(res){
angular.extend(vm,res);
})
  // 关闭
  vm.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);
