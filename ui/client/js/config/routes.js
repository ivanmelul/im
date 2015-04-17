define(function () {
  "use strict";

  return ['$routeProvider', routes];

  function routes($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: require.toUrl('./kairosdb/templates/index.html'),
      })

      .when('/dashboards',  {
        templateUrl: require.toUrl('./kairosdb/templates/index.html'),
      })

      .when('/dashboards/:title',  {
        templateUrl: require.toUrl('./kairosdb/templates/index.html'),
      });

      $routeProvider.otherwise({redirectTo: '/'});
  }

});
