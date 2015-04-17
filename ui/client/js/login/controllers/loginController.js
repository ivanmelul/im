define(function () {
  "use strict";

  return ['$scope', '$rootScope', 'loginService','$location', '$window', loginController];

  function loginController($scope,$rootScope, loginService, $location, $window) {
    $scope.loginService = loginService;
    $scope.message_alert = "Invalid Username or Password";
    $scope.message_type  = "error";
    $scope.showAlert = false;

    $scope.submit = function(){
      $scope.username = $("#username").val();
      $scope.password = $("#password").val();

      $scope.loginService.login({username: $scope.username, password: $scope.password}).then(function(response){
        if(response.data.user !== 'false') {
          $location.path("/dashboards/");
        }else{
          $scope.showAlert = true;
        }
      });

      return false;
    };
  }
});
