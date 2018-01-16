/**
 * Created by Bigshark on 2017/12/15.
 */

app.controller('SpaceListCtrl',['$rootScope', '$scope', '$log', 'Space','$http','$confirm','toaster','$modal','i18nService','$stateParams','$state','$window',function($rootScope, $scope, $log, Space,$http,$confirm,toaster,$modal,i18nService,$stateParams,$state,$window) {
    i18nService.setCurrentLang('zh-cn');
var vm=this;


// 用户id（要获取）
var user_id=localStorage.getItem('userGuid');


  var optCellTemplate = '<div class="ui-grid-cell-contents btn-group">' +
          '<button type="button" class="btn btn-sm btn-success m-r-xs" ng-click="grid.appScope.editSpaceList(row.entity)"><i class="fa fa-pencil-square-o fa-fw"></i>修改</button>' +
          '<button type="button" class="btn btn-sm btn-danger m-r-xs" ng-click="grid.appScope.deleteSpace(row.entity)"><i class="fa fa-trash-o fa-fw"></i>删除</button>'+
          '</div>';
          // 分页配置
          var paginationOptions = {
              pageNo: 1,
              pageSize: 10,
              sort: []
          };
          vm.gridOptionsSpacelist = {
              enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
              paginationPageSize: paginationOptions.pageSize,
              paginationPageSizes: [5, 10, 20, 30],
              useExternalPagination: true,
              useExternalSorting: true,
              rowHeight: 46,
              columnDefs: [
                  { name: 'name', enableFiltering: false, displayName: '空间名称'},
                  { name: 'create_time', enableFiltering: true, displayName: '创建时间' },
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
                      getSpacesList();
                  });
                  gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                      paginationOptions.pageNo = newPage;
                      paginationOptions.pageSize = pageSize;
                      getSpacesList();
                  });
              }
          };
          // 获取应用数据
var getSpacesList=function(){
  vm.spaceList=[];
Space.getSpace({
  guid:user_id
}).$promise.then(res=>{
  if(res.namespaces){
    var data = res.namespaces;
    for(var i in data) {
      vm.spaceList.push({
        name:data[i].name,
        create_time:data[i].created,
        uuid:data[i].uuid
      });
    }
    vm.gridOptionsSpacelist.data = vm.spaceList;
    vm.gridOptionsSpacelist.totalItems = data.length;
  }

  },function(err){
    console.log(err);
    toaster.pop('error', '', '获取用户空间失败');
  })
}
// 首次加载
getSpacesList();

// 刷新grid
vm.refreshGrid = function () {
  getSpacesList();
};
// 新增空间
vm.addSpace = function () {
    var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/spaceList/addSpace_modal.html',
        controller: 'AddSpaceCtrl as addSpace',
        resolve: {
            deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                    return $ocLazyLoad.load('angularFileUpload');
                }]
        }
    });
    modalInstance.result.then(function (result) {
        if (result === 'success') {
            return toaster.pop('success', '', '新增空间成功');
        }
        return toaster.pop('error', '', '新增空间失败');
    });
};
// 修改空间
$scope.editSpaceList = function (entity) {
    var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/spaceList/editSpace_modal.html',
        controller: 'EditSpaceCtrl as editSpace',
        resolve: {
            deps: ['$ocLazyLoad',
                function ($ocLazyLoad) {
                    return $ocLazyLoad.load('angularFileUpload');
                }],
                item:function(){
                  return {
                    name:entity.name,
                    uuid:entity.uuid
                  }
                }
        }
    });
    modalInstance.result.then(function (result) {
        if (result === 'success') {
            return toaster.pop('success', '', '修改空间成功');
        }
        return toaster.pop('error', '', '修改空间失败');
    });
};


// 删除空间
$scope.deleteSpace=function(entity){
  //使用confirm确认是否删除
  $confirm({
    text: '确认要删除[  ' + '空间' +entity.name+'   ]吗?',
    title: "确认删除",
    ok: "确认",
    cancel: '取消'
  }).then(function () {
    Space.delete({guid:entity.uuid}).$promise.then(function(data){
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
$scope.$watch('searchSpace', function (newVal, oldVal) {
  if (newVal === oldVal)
  return;
  vm.gridOptionsSpacelist.data = vm.spaceList.filter(function (data) {
    if (data.name) {
      if ((data.name.toLowerCase().indexOf($scope.searchSpace.toLowerCase()) > -1)||(data.create_time.toLowerCase().indexOf($scope.searchSpace.toLowerCase())>-1)){
        return true;
      }
      else {
        return false;
      }
    }
  });
});



}])

// 新增空间
app.controller('AddSpaceCtrl', ['$scope', '$modalInstance', 'toaster', '$log','Space','$window', function ($scope, $modalInstance, toaster, $log,Space,$window) {
    // view model
    var vm = this;
vm.user_id=localStorage.getItem('userGuid');

    // 默认数据
    vm.cpu=1;
    vm.memory='1G';
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
        Space.save({
            name: vm.name,
            user_id:vm.user_id,
            cpu: vm.cpu,
            memory: vm.memory
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

// 修改空间
app.controller('EditSpaceCtrl', ['$scope', '$modalInstance', 'toaster', '$log','Space','$window','item', function ($scope, $modalInstance, toaster, $log,Space,$window,item) {
    // view model
    var vm = this;
vm.user_id=localStorage.getItem('userGuid');

    vm.name=item.name;
    vm.uuid=item.uuid;
    // 默认数据
    vm.submitted = false;
// 拿到空间详细信息
Space.get({guid:vm.uuid}).$promise.then(function(resp){
  console.log(resp.spec.hard.cpu);
  vm.cpu=resp.spec.hard.cpu||1;
  vm.memory=resp.spec.hard.memory||'1G';
})



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
        Space.update({guid:vm.uuid},{
            name: vm.name,
            user_id:vm.user_id,
            cpu: vm.cpu,
            memory: vm.memory
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
