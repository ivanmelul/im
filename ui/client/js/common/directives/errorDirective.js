define(function () {
  "use strict";

  return [error];

  function error() {
    return {
      templateUrl: require.toUrl('/common/directives/error.html'),
      replace: true
    };
  }
});
