define(function () {
  "use strict";

  return [kairosui];

  function kairosui() {
    return {
      restrict : 'E',
      templateUrl: require.toUrl('./kairosdb/templates/kairosui.html'),
      scope: {
        'metric':'=',
        'endpoint':'='
      }
    };
  }
});
