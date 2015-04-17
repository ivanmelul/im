define(function () {
  "use strict";

  return ['$scope', '$rootScope', appController];

  function appController($scope, $rootScope) {
    $scope.loggedIn = false;

    $scope.title = 'Moabsssssssss';

    $scope.$on('event:auth-loginRequired', function () {
      $rootScope.$broadcast('loading-complete');
      $scope.loggedIn = false;
    });

    $scope.$on('event:auth-loginConfirmed', function () {
      $scope.loggedIn = true;
    });
  }
});
