define(function () {
  "use strict";

  return [logged];

  function logged() {
    return {
      restrict : 'E',
      templateUrl: require.toUrl('./kairosdb/templates/logged.html'),
      scope: {
        'username':'='
      }
    };
  }
});
