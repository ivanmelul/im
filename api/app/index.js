"use strict";

var express = require('express');
var passport = require('passport');
var _ = require('underscore');
var defaults = _.defaults;
var makeBearerStrategy = require('./middleware/auth/bearer');
var makeLdapStrategy = require('./middleware/auth/ldapauth');

module.exports = makeApp;

function makeApp(config) {
  var app = express();
  var models = {};

  // configuration

  app.set('port', config.server.port);

  app.configure('test', function () {
    app.set('models', models); // so integration tests can get them
  });

  app.configure('development', function () {
    app.use(express.logger('dev'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function () {
    app.use(express.logger());
    app.use(express.errorHandler({ showMessage: true, showStack: false }));
  });

  app.use(express.compress());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.json());
  app.use(express.urlencoded());

  // set up passport

  passport.use(makeBearerStrategy(config.auth.tokenSecret));
  passport.use(makeLdapStrategy(config.auth.ldap));

  var authenticateUser = passport.authenticate('ldapauth', { session: false });
  var authenticateSession = passport.authenticate('bearer', { session: false });

  app.use(passport.initialize());

  app.use(app.router);

  // set up routes

  var routes = require('./routes').create(config);

  app.post('/auth', authenticateUser, routes.auth.post);

  app.get('/', function (req, res) {
    res.send('Moab.v1.server API');
  });

  return app;
}
