"use strict";

var passport = require('passport');
var express = require('express');
var config = require('../etc/config');
var path = require('path');

module.exports = makeApp;

function makeApp(config) {
  var app = express();

  app.configure(function() {
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session({ cookie: { maxAge: 60000 }}));
    app.use(passport.initialize());
    app.use(passport.session());
  });

  app.configure('development', function () {
    app.use(express.logger('dev'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function () {
    app.use(express.logger());
    app.use(express.errorHandler({ showMessage: true, showStack: false }));
  });

  app.set('port', config.server.port);
  // app.use(express.favicon(canonicalize('client-assets/favicon.ico')));
  app.use(app.router);
  app.use('/bower', express.static(canonicalize('bower_components')));
  app.use('/', express.static(canonicalize('client')));

  app.all('/api/*', require('./routes/proxy').create(config).proxy);

  return app;
}

function canonicalize(pth) {
  return path.join(__dirname, '..', pth);
}
