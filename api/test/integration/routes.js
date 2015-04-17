"use strict";

var request = require('supertest');
var makeApp = require('../../app');
var config = require('../../etc/config');

describe('routes', function () {
  var app;

  beforeEach(function () {
    app = makeApp(config);
  });

  describe('GET /', function () {
    it('returns a 200', function (done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
  });

  describe('POST /auth', function () {
    it('redirects to / if auth succeeds', function (done) {
      request(app)
        .post('/auth')
        .send({
          username: 'jirving',
          password: 'tf@C&ng7'
        })
        .expect('Location', '/', done);
    });

    it('redirects to /auth if auth succeeds', function (done) {
      request(app)
        .post('/auth')
        .send({
          username: 'jirving',
          password: 'wibble'
        })
        .expect('Location', '/auth', done);
    });
  });
});
