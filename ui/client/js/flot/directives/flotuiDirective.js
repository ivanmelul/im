define(function () {
  "use strict";

  return [flotui];

  function flotui() {
    return {
      restrict : 'E',
      templateUrl: require.toUrl('./flot/templates/graph.html'),
      scope: {
        'results':'=',
        'panelindex':'=',
        'colors':'=',
        'theme':'='
      },
      link: function($scope, elem, attrs) {

      } 
    };
  }
});