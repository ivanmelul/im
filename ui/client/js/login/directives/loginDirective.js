define(function () {
  "use strict";

  return [login];

  function login() {
    return {
      restrict : 'E',
      templateUrl: require.toUrl('./login/templates/login.html'),
      scope: {
        'username':'=',
        'password':'='
      }
    };
  }
});
