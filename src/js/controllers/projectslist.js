/**
 * Created by Bigshark on 2017/12/15.
 */
app.controller('ProjectsListCtrl',['$rootScope', '$scope', '$log', 'imageProjects','$http','$confirm','toaster','$modal','i18nService','$stateParams','$state','$window',function($rootScope, $scope, $log, imageProjects,$http,$confirm,toaster,$modal,i18nService,$stateParams,$state,$window) {
    i18nService.setCurrentLang('zh-cn');
var vm=this;

  var optCellTemplate = '<div class="ui-grid-cell-contents btn-group">' +
          '<button type="button" class="btn btn-sm btn-success m-r-xs" ng-click="grid.appScope.editimagesList(row.entity)"><i class="fa fa-pencil-square-o fa-fw"></i>修改</button>' +
          '<button type="button" class="btn btn-sm btn-danger m-r-xs" ng-click="grid.appScope.deleteImage(row.entity)"><i class="fa fa-trash-o fa-fw"></i>删除</button>'+
          '</div>';
          // 分页配置
          var paginationOptions = {
              pageNo: 1,
              pageSize: 10,
              sort: []
          };
          vm.gridOptionsimagesList = {
              enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
              paginationPageSize: paginationOptions.pageSize,
              paginationPageSizes: [5, 10, 20, 30],
              useExternalPagination: true,
              useExternalSorting: true,
              rowHeight: 46,
              columnDefs: [
                  { name: 'name', enableFiltering: false, displayName: '镜像仓库名称'},
                  { name: 'update_time', enableFiltering: true, displayName: '最近更新时间' },
                  { name: 'public', enableFiltering: true, displayName: '是否公有仓库' },
                  { name: 'guid', enableFiltering:false,displayName:'操作',width:"200", cellTemplate:optCellTemplate}
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
                      getImagesList();
                  });
                  gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                      paginationOptions.pageNo = newPage;
                      paginationOptions.pageSize = pageSize;
                      getImagesList();
                  });
              }
          };
          // 获取镜像仓库列表
var getImagesList=function(){
  vm.imagesList=[];
imageProjects.query().$promise.then(res=>{
  if(res){
    var data = res;
    for(var i in data) {
      if(!data[i].project_id){
        continue
      }
      vm.imagesList.push({
        name:data[i].name,
        update_time:data[i].update_time,
        project_id:data[i].project_id,
        public:data[i].metadata.public==='true'?'是':'否'
      });
    }
    vm.gridOptionsimagesList.data = vm.imagesList;
    vm.gridOptionsimagesList.totalItems = data.length;
  }

  },function(err){
    console.log(err);
    toaster.pop('error', '', '获取用户镜像仓库失败');
  })
}
// 首次加载
getImagesList();

// 刷新grid
vm.refreshGrid = function () {
  getImagesList();
};
// 新增镜像仓库
vm.addImages = function () {
    var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/imagesList/addImages_modal.html',
        controller: 'AddImageCtrl as addImage',
        resolve: {
            deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                    return $ocLazyLoad.load('angularFileUpload');
                }]
        }
    });
    modalInstance.result.then(function (result) {
        if (result === 'success') {
            return toaster.pop('success', '', '新增镜像仓库成功');
        }
        return toaster.pop('error', '', '新增镜像仓库失败');
    });
};
// 修改镜像仓库
$scope.editimagesList = function (entity) {
    var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/imagesList/editImages_modal.html',
        controller: 'EditImageCtrl as editImage',
        resolve: {
            deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                    return $ocLazyLoad.load('angularFileUpload');
                }],
                item:function(){
                  return {
                    name:entity.name,
                    project_id:entity.project_id,
                    public:entity.public
                  }
                }
        }
    });
    modalInstance.result.then(function (result) {
        if (result === 'success') {
            return toaster.pop('success', '', '修改镜像仓库成功');
        }
        return toaster.pop('error', '', '修改镜像仓库失败');
    });
};


// 删除镜像仓库
$scope.deleteImage=function(entity){
  //使用confirm确认是否删除
  $confirm({
    text: '确认要删除[  ' + '镜像仓库' +entity.name+'   ]吗?',
    title: "确认删除",
    ok: "确认",
    cancel: '取消'
  }).then(function () {
    console.log(entity.project_id);
    imageProjects.delete({projectId:entity.project_id}).$promise.then(function(data){
      //删除成功提示
      toaster.pop('success', '', '删除成功！');
      $window.location.reload();
    },function(err){
      console.log(err);
      toaster.pop('error', '', '删除失败！');
    });
  });
}


//搜索
$scope.$watch('searchImage', function (newVal, oldVal) {
  if (newVal === oldVal)
  return;
  vm.gridOptionsimagesList.data = vm.imagesList.filter(function (data) {
    if (data.name) {
      if ((data.name.toLowerCase().indexOf($scope.searchImage.toLowerCase()) > -1)||(data.create_time.toLowerCase().indexOf($scope.searchImage.toLowerCase())>-1)){
        return true;
      }
      else {
        return false;
      }
    }
  });
});



}])

// 新增镜像仓库
app.controller('AddImageCtrl', ['$scope', '$modalInstance', 'toaster', '$log','imageProjects','$window', function ($scope, $modalInstance, toaster, $log,imageProjects,$window) {
    // view model
    var vm = this;

    // 默认数据
    vm.public='false';
    vm.submitted = false;

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
        imageProjects.save({},{
            project_name: vm.name,
            metadata:{
              public:vm.public
            }
        }).$promise.then(function (resp) {
            $modalInstance.close('success');
            $window.location.reload();
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

// 修改镜像仓库
app.controller('EditImageCtrl', ['$scope', '$modalInstance', 'toaster', '$log','imageProjects','$window','item', function ($scope, $modalInstance, toaster, $log,imageProjects,$window,item) {
    // view model
    var vm = this;
    vm.name=item.name;
    vm.projectId=item.project_id;
    vm.public=item.public==='是'?'true':'false';
    // 默认数据
    vm.submitted = false;

    // 修改空间确定
    vm.ok = function (myForm) {
        myForm.$setDirty();
        if (!myForm.$valid) {
            toaster.pop('error', '', '信息填写不正确');
            return;
        }
        // 防止重复提交
        vm.submitted = true;
        // // 修改空间
        imageProjects.update({projectId:vm.projectId},{
            metadata:{
              public:vm.public
            }
        }).$promise.then(function (resp) {
            $modalInstance.close('success');
            $window.location.reload();
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
