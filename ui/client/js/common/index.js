define(function (require) {
  "use strict";

  return {
    controllers: {
      main: require('./controllers/mainController'),
      app: require('./controllers/appController')
    },

    directives: {
      error: require('./directives/errorDirective'),
      success: require('./directives/successDirective')
    },

    services: {
      api: require('./services/apiService')
    }
  };

});
