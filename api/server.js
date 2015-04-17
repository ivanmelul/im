"use strict";

var http = require('http');

exports.start = function (app) {
  process.on('uncaughtException', function (err) {
    var msg = err instanceof Error ? err.stack : err.toString();
    msg = "Caught uncaughtException, app exiting: " + msg;
    console.log(msg, null, function () {
      process.exit(1);
    });
  });

  http.createServer(app).listen(app.get('port'), function () {
    console.log('Moab API server listening on port ' + app.get('port') +
                ' in ' + app.settings.env + ' mode');
  });
};
