define(function (require) {
  "use strict";

  var login = require('./login/index');
  var common = require('./common/index');
  var routes = require('./config/routes');
  var kairosdb = require('./kairosdb/index');
  var flotApp = require('./flot/index');
  var endPoints = require('./kairosdb/endpoints');

  return function (appName) {

    angular.module('services', [])
      .service('loginService', login.services.login)
      .service('apiService', common.services.api)
      .service('mongooseService',kairosdb.services.mongoose)      
      .service('kairosuiService',kairosdb.services.kairosui);

    angular.module('controllers', [])
      .controller('loginController', login.controllers.login)
      .controller('mainController', common.controllers.main)
      .controller('appController', common.controllers.app)
      .controller('kairosuiController', kairosdb.controllers.kairosui)
      .controller('kairospanelController', kairosdb.controllers.kairospanel)
      .controller('kairosdashboardController', kairosdb.controllers.kairosdashboard)
      .controller('kairosnavbarController', kairosdb.controllers.kairosnavbar)  
      .controller('flotuiController', flotApp.controllers.flotui);

    angular.module('directives', [])
      .directive('login',login.directives.login)
      .directive('skip',kairosdb.directives.skip)
      .directive('loading',kairosdb.directives.loading)
      .directive('savedAlert',kairosdb.directives.savedAlert)
      .directive('logged',kairosdb.directives.logged)
      .directive('dashboard',kairosdb.directives.dashboard)
      .directive('panel',kairosdb.directives.panel)
      .directive('kairosui',kairosdb.directives.kairosui)
      .directive('kairosuiAggregators',kairosdb.directives.kairosuiAggregators)
      .directive('kairosuiGroupby',kairosdb.directives.kairosuiGroupby)
      .directive('flotui',flotApp.directives.flotui);


    var app = angular.module(appName, [
      'ngRoute',
      'ngCookies',
      'controllers',
      'services',
      'directives',
      'ui.bootstrap',
      'ui.directives',
      'angular-flot',
      'http-auth-interceptor',
      'ngClipboard'
    ]);

    app.config(routes);
    app.value("endpoints",endPoints);
    app.config(['ngClipProvider', function(ngClipProvider) {
      ngClipProvider.setPath("bower/zeroclipboard/dist/ZeroClipboard.swf");
    }]);

    app.directive('moabError', common.directives.error);
    app.directive('moabSuccess', common.directives.success);

    return app;

  };

});
