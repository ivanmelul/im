"use strict";

module.exports = {
  server: {
    port: process.env.UI_PORT || 8081
  },
  api: {
    host: process.env.API_HOST || 'localhost',
    port: process.env.API_PORT || 8080
  }
};
