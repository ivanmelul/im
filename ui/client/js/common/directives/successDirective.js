define(function () {
  "use strict";

  return [success];

  function success() {
    return {
      templateUrl: require.toUrl('./common/directives/success.html'),
      replace: true
    };
  }
});
