"use strict";

var httpProxy = require('http-proxy');

exports.create = function (config) {
  var proxyOptions = {
    target: {
      host: config.api.host,
      port: config.api.port
    }
  };

  var proxy = new httpProxy.createProxyServer(proxyOptions);

  return {
    proxy: function (req, res) {
      req.url = req.url.replace('/api', '');


      proxy.proxyRequest(req, res, proxyOptions);
    }
  };
};
