"use strict";

var jwt = require('jwt-simple');

exports.create = function (config) {
  var auth = {};

  auth.post = function (req, res) {
    var token = jwt.encode(req.user.uid, config.auth.tokenSecret);

    res.send(token);
  };

  return auth;
};
