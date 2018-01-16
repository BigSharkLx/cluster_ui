/**
* Created by Bigshark on 2017/12/15.
*/
app.controller('ImageListCtrl',['$rootScope', '$scope', '$log', 'Image','$http','$confirm','toaster','$modal','i18nService','$stateParams','$state','$window','imageProjects',function($rootScope, $scope, $log, Image,$http,$confirm,toaster,$modal,i18nService,$stateParams,$state,$window,imageProjects) {
  i18nService.setCurrentLang('zh-cn');
  var vm=this;
  // 拿到镜像仓库的id
  var project_id=$stateParams.project_id;

  // 获取镜像名称
  var getimageDetail=function(){
    imageProjects.get({projectId:project_id}).$promise.then(function(data){
      vm.projectName=data.name;
    })
  }
  getimageDetail();

  var optCellTemplate = '<div class="ui-grid-cell-contents btn-group">' +
  '<button type="button" class="btn btn-sm btn-danger m-r-xs" ng-click="grid.appScope.delImageList(row.entity)"><i class="fa fa-trash-o fa-fw"></i>删除</button>'+
  '</div>';
  // 分页配置
  var paginationOptions = {
    pageNo: 1,
    pageSize: 10,
    sort: []
  };
  vm.gridOptionsImageList = {
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    paginationPageSize: paginationOptions.pageSize,
    paginationPageSizes: [5, 10, 20, 30],
    useExternalPagination: true,
    useExternalSorting: true,
    rowHeight: 46,
    columnDefs: [
      { name: 'name', enableFiltering: false, displayName: '镜像名称'},
      { name: 'description', enableFiltering: false, displayName: '描述'},
      { name: 'pull_count', enableFiltering: false, displayName: '下载次数'},
      { name: 'star_count', enableFiltering: false, displayName: '被赞次数'},
      { name: 'update_time', enableFiltering: false, displayName: '最近更新时间'},
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
        getImageList();
      });
      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
        paginationOptions.pageNo = newPage;
        paginationOptions.pageSize = pageSize;
        getImageList();
      });
    }
  };
  // 获取镜像数据
  var getImageList=function(){
    vm.ImageList=[];
    Image.query({project_id:project_id}).$promise.then(res=>{
      var data = res;
      if(data.length!==0){
        for(var i in data) {
          if(!data[i].project_id){
            continue;
          }
          vm.ImageList.push({
            name:data[i].name,
            description:data[i].description||'无',
            pull_count:data[i].pull_count,
            star_count:data[i].star_count,
            update_time:data[i].update_time,
            project_id:data[i].project_id
          });
        }
        vm.gridOptionsImageList.totalItems = data.length;
      }
      vm.gridOptionsImageList.data = vm.ImageList;
    })
  }
  // 首次加载
  getImageList();

  // 刷新grid
  vm.refreshGrid = function () {
    getImageList();
  };

// 删除镜像
$scope.delImageList=function(entity){
  //使用confirm确认是否删除
  $confirm({
    text: '确认要删除[  ' + '镜像' +entity.name+'   ]吗?',
    title: "确认删除",
    ok: "确认",
    cancel: '取消'
  }).then(function () {
    Image.delete({
      image_name:entity.name
    }).$promise.then(function(data){
      //删除成功提示
      toaster.pop('success', '', '删除成功！');
      getImageList();
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
    vm.gridOptionsImageList.data = vm.ImageList.filter(function (data) {
      if (data.name) {
        if ((data.name.toLowerCase().indexOf($scope.searchImage.toLowerCase()) > -1)||(data.description.toLowerCase().indexOf($scope.searchImage.toLowerCase()) > -1)||(data.update_time.toLowerCase().indexOf($scope.searchImage.toLowerCase()) > -1)){
          return true;
        }
        else {
          return false;
        }
      }
    });
  });
}])
