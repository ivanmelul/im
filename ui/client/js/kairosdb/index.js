define(function (require) {
  "use strict";

  return {

    controllers: {
      kairosnavbar: require('./controllers/kairosnavbarController'),
      kairosui: require('./controllers/kairosuiController'),
      kairospanel: require('./controllers/kairospanelController'),
      kairosdashboard: require('./controllers/kairosdashboardController')
    },

    directives: {
      loading: require('./directives/loadingDirective'),
      savedAlert: require('./directives/savedAlertDirective'),
      panel: require('./directives/panelDirective'),
      dashboard: require('./directives/dashboardDirective'),
      logged: require('./directives/loggedDirective'),
      kairosui: require('./directives/kairosuiDirective'),
      kairosuiGroupby: require('./directives/kairosuiGroupbyDirective'),
      kairosuiAggregators: require('./directives/kairosuiAggregatorsDirective'),
      skip: require('./directives/skipDefault')
    },

    services: {
      mongoose: require('./services/mongooseService'),
      kairosui: require('./services/kairosuiService'),
    }
    
  };

});
