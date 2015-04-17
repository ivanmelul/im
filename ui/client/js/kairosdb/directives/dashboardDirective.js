define(function () {
  "use strict";

  return [dashboard];

  function dashboard() {
    return {
      restrict : 'E',
      templateUrl: require.toUrl('./kairosdb/templates/dashboard.html'),
      scope: {
        'dashboard':'=',
        'username':'='
      }
    };
  }
});
