"use strict";

module.exports = function (grunt) {

  grunt.initConfig({

    env: {
      test: {
        NODE_ENV: 'test'
      },
      production: {
        NODE_ENV: 'production'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'list',
          timeout: 10000,
          require: 'should',
          bail: true,
          growl: true
        },
        src: ['test/**/*.js']
      },

      jenkins: {
        options: {
          reporter: 'xunit',
          timeout: 10000,
          require: 'should',
          captureFile: 'report.xml'
        },
        src: ['test/**/*.js']
      }
    },

    jshint: {
      all: [
        '*.js',
        'lib/**/*.js',
        'etc/**/*.js',
        'app/**/*.js'
      ],

      options: {
        jshintrc: true
      }
    }

  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['env:test', 'jshint', 'mochaTest:test']);
  grunt.registerTask('jenkins', ['env:test', 'jshint', 'mochaTest:jenkins']);

  grunt.registerTask('default', 'test');
};
