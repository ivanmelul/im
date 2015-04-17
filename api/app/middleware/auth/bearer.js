"use strict";

var BearerStrategy = require('passport-http-bearer').Strategy;
var partial = require('underscore').partial;
var jwt = require('jwt-simple');

module.exports = function (secretKey) {
  return new BearerStrategy(partial(verifier, secretKey));
};

function verifier(secretKey, token, done) {
  if (!secretKey) {
    return done(new Error('secretKey is required'));
  }

  if (!token) {
    return done(new Error('token is required'));
  }

  var user = jwt.decode(token, secretKey);

  return done(null, user);
}
