define(function (require) {
  "use strict";

  return {

    controllers: {
      flotui: require('./controllers/flotuiController')
    },

     directives: {
      flotui: require('./directives/flotuiDirective'),
      
    }
    
  };

});
