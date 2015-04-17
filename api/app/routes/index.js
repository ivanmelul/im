"use strict";

exports.create = function (config) {
  return {
    auth: require('./auth').create(config)
  };
};
