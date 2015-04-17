define(function () {
  "use strict";

  return [loading];

  function loading($timeout) {
    return {
      restrict : 'E',
      templateUrl: require.toUrl('./kairosdb/templates/loading.html'),
      scope: {
        visible:'='
      }
    };
  }
});