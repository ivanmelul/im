define(function () {
  "use strict";

  return [panel];

  function panel() {
    return {
      restrict : 'E',
      templateUrl: require.toUrl('./kairosdb/templates/panel.html'),
      scope: {
        'editable':'=',
        'panelindex':'=',
        'panel':'=',
        'theme':'=',
      }
    };
  }
});
