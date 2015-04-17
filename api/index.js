"use strict";

var makeApp = module.exports = require('./app');

if (require.main === module) {
  var config = require('./etc/config');
  var app = makeApp(config);

  require('./server').start(app);
}
