define(function () {
  "use strict";

  return ['$scope', '$rootScope', 'mongooseService', 'loginService','$location', mainController];

  function mainController($scope,$rootScope, mongooseService, loginService, $location) {

    $scope.loginService = loginService;
    $scope.isLogged = null;

    $scope.loginService.loggedin().then(function(response){
      if(response.data !== "false"){
        $scope.user = response.data; 
        $scope.isLogged = true;
      }else{         
        $scope.isLogged = false;
      }

    });


    $scope.$watch('$scope.loginService.isLogged',function(){
      console.log($scope.loginService.isLogged);
    });

  }

});
