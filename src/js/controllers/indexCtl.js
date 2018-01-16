//document.getElementById("console").style.display="none";
//document.getElementById("console").style.display="block";
app.controller('closeTour',function($scope){
    $scope.hidediv = function () {
        document.getElementById("bg").style.display ="none";
        document.getElementById("show").style.display ="none";
    }

});

app.controller('VisibleController',function($scope,$http,AuthService){
    if (AuthService.isAuthenticated()) {
        $scope.visible=true;
    }else{
        $scope.visible=false;
    }

    $scope.create_account=function(){
        window.location.href= $scope.app.uaaUrl + '/create_account?client_id=cf&redirect_uri=' + encodeURIComponent(window.location.protocol + "//" + window.location.host);
    };
});

app.controller('BackToAppController',function($scope, AuthService){
    $scope.backToApp=function(){
        var url = localStorage.getItem('url');
        if (AuthService.isAuthenticated()) {
            if(localStorage.getItem('url')){
                window.location.href=localStorage.getItem('url');
            } else {
                window.location.href='#/app/dashboard';
            }
        }else{
            window.location.href = $scope.app.uaaUrl + '/oauth/authorize?response_type=token&client_id=cf&prompt=none&redirect_uri=' + encodeURIComponent(window.location.protocol + "//" + window.location.host);
        }
    };
});

app.controller('firstLogin',function($scope,$state){
    $scope.backToHome=function(){
        localStorage.setItem('url',window.location.href);
    };
});

app.controller('newUserCtl',function($scope,userService){
    var userGuid = localStorage.getItem('userGuid');
    userService.getUserOrgs(userGuid).then(function (resp) {
        if(resp.data.resources.length===0){
            $scope.visible=true;
        }else $scope.visible=false;
    });
});


app.controller('modalTour',function($scope){
    $scope.showdiv = function () {
        document.getElementById("bg").style.display ="block";
        document.getElementById("show").style.display ="block";
    }

});
