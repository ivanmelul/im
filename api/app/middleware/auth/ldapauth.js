"use strict";

var LdapStrategy = require('passport-ldapauth').Strategy;

module.exports = function (config) {
  return new LdapStrategy(config);
};
