define(function (require) {
  "use strict";

  return {

    controllers: {
      login: require('./controllers/loginController')
    },

    directives: {
      login: require('./directives/loginDirective')
    },

    services: {
      login: require('./services/loginService')
    }
    
  };

});
