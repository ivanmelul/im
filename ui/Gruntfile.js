"use strict";

module.exports = function (grunt) {

  var whinyOptions = {
    stdout : true,
    stderr : true,
    failOnError : true
  };

  var verboseOptions = {
    stdout : true,
    stderr : true
  };

  var config = {
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      "install-bower-deps" : {
        command : 'bower update --dev',
        options : whinyOptions
      }
    },

    jshint: {
      all: [
        '*.js',
        'lib/**/*.js',
        'etc/**/*.js',
        'app/**/*.js',
        'client/**/*.js'
      ],

      options: {
        jshintrc: true
      }
    }

  };

  grunt.initConfig(config);

  // Load plugins
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  var buildTasks = [
    'shell:install-bower-deps',
    'jshint'
  ];

  grunt.registerTask('default', 'Build the app and run jshint', buildTasks);

};
