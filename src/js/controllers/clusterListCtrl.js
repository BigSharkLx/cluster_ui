app.controller('ClusterListCtrl',['$rootScope', '$scope', '$log', 'Node','i18nService','toaster','$modal', function($rootScope, $scope, $log, Node,i18nService,toaster,$modal) {

  i18nService.setCurrentLang('zh-cn');

var vm=this;
// 操作
var optCellTemplate = '<div class="ui-grid-cell-contents btn-group">' +
        '<button type="button" class="btn btn-sm btn-success m-r-xs" ng-click="grid.appScope.detailNodeList(row.entity)"><i class="fa fa-reorder fa-fw"></i>详情</button>'
        '</div>';
// 标签
var labelCellTemplate=`<td>
  <span class="label bg-light">beta.kubernetes.io/arch: {{row.entity.labels["beta.kubernetes.io/arch"]}}</span>
  <span class="label bg-light">beta.kubernetes.io/os: {{row.entity.labels["beta.kubernetes.io/os"]}}</span>
  <span class="label bg-light">kubernetes.io/hostname: {{row.entity.labels["kubernetes.io/hostname"]}}</span>
</td>`;
        // 分页配置
        var paginationOptions = {
            pageNo: 1,
            pageSize: 10,
            sort: []
        };
        vm.gridOptionsNodeList = {
            enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
            paginationPageSize: paginationOptions.pageSize,
            paginationPageSizes: [5, 10, 20, 30],
            useExternalPagination: true,
            useExternalSorting: true,
            rowHeight: 46,
            columnDefs: [
                { name: 'name', enableFiltering: false, displayName: '主机名称'},
                { name: 'labels', enableFiltering: true, displayName: '标签',cellTemplate:labelCellTemplate,width:"520" },
                { name: 'ready', enableFiltering: true, displayName: '状态' },
                { name: 'creationTimestamp', enableFiltering: true, displayName: '创建时间' },
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
                    getNodeList();
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    paginationOptions.pageNo = newPage;
                    paginationOptions.pageSize = pageSize;
                    getNodeList();
                });
            }
        };


// 转化ready
        function transformReady(ready){
          switch(ready){
            case 'True':
                return '运行中';
            default:
                return '未准备好';
          }
        }



        // 获取主机列表
var getNodeList=function(){
vm.NodeList=[];
Node.get().$promise.then(res=>{
  if(res.nodes){
    var data = res.nodes;
    for(var i in data) {
      vm.NodeList.push({
        name:data[i].objectMeta.name,
        labels:{
          "beta.kubernetes.io/arch":data[i].objectMeta.labels['beta.kubernetes.io/arch'],
          "beta.kubernetes.io/os":data[i].objectMeta.labels['beta.kubernetes.io/os'],
          "kubernetes.io/hostname":data[i].objectMeta.labels['kubernetes.io/hostname']
        },
        ready:transformReady(data[i].ready),
        creationTimestamp:data[i].objectMeta.creationTimestamp
      });
    }
  }
              vm.gridOptionsNodeList.data = vm.NodeList;
              vm.gridOptionsNodeList.totalItems = res.listMeta.totalItems;
              vm.totalNodes=res.listMeta.totalItems;
},function(err){
  console.log(err);
  toaster.pop('error', '', '获取主机列表失败');
})
}
//首次加载
getNodeList();

vm.refreshGrid=function(){
  getNodeList();
}

// 主机详情
$scope.detailNodeList=function(entity){
  var modalInstance = $modal.open({
    templateUrl: 'tpl/modal/NodeList/detailNode_modal.html',
    controller: 'detailNodeCtrl as detailNode',
    resolve: {
      item:function(){
        return entity.name
      }
    }
  });
}




// 搜索
$scope.$watch('searchNode', function (newVal, oldVal) {
  if (newVal === oldVal)
  return;
  vm.gridOptionsNodeList.data = vm.NodeList.filter(function (data) {
    if (data.name) {
      if ((data.name.toLowerCase().indexOf($scope.searchNode.toLowerCase()) > -1)||(data.creationTimestamp.toLowerCase().indexOf($scope.searchNode.toLowerCase())>-1)){
        return true;
      }
      else {
        return false;
      }
    }
  });
});




}])


// 应用详情
app.controller('detailNodeCtrl', ['$scope', '$modalInstance', 'toaster', '$log','Space','$window','Node','item', function ($scope, $modalInstance, toaster, $log,Space,$window,Node,item) {
  // view model
  var vm = this;
Node.get({nodeName:item}).$promise.then(function(res){
angular.extend(vm,res);
})
  // 关闭
  vm.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);
