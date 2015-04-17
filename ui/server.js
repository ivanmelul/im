"use strict";
var express = require("express");
var http = require('http');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var users = [{username: 'admin', password:'True1234'}, {username: 'guest', password:'True1234'}];



passport.use(new LocalStrategy(
  function(username, password, done) {
    var found = false;
    users.forEach(function(element){
      if (element.username === username && element.password === password){
        found = true;
        return done(null, username);
      }
    });

    if (!found) return done(null, false, { message: 'Incorrect username or password.'});
  }
));


passport.serializeUser(function(user, done) {
  console.log('serialize ', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('desserialize ', user);
  done(null, user);
});


exports.start = function (app) {

app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});


  process.on('uncaughtException', function (err) {
    var msg = err instanceof Error ? err.stack : err.toString();
    msg = "Caught uncaughtException, app exiting: " + msg;
    console.log(msg, null, function () {
      process.exit(1);
    });
  });

  var mongoose = require("mongoose");

  var dbName = 'turn';
  var dbUri = 'mongodb://localhost:27017/' + dbName;
  var conn = mongoose.createConnection(dbUri);
  conn.once('open', function () {
    console.log('database connection established');
  });


  var Schema = mongoose.Schema;

//start new Schema
  var dashboardSchema = new Schema({
      //id: {type: Schema.Types.ObjectId},
      title: {type: String, default: 'Untitled'},
      username_created: {type: String},
      username_last_modified: {type: String},
      date_created: {type: Date, default: Date.now},
      date_last_modified: {type: Date, default: Date.now},
      status: {type: String, default: 'private'},
      theme: {type: String, default: 'light'},
      panels: {type: [String], default: []}
  });

  dashboardSchema.set('toJSON', {virtuals: true});
//end new Schema

//start new Schema
  var userDashboardSchema = new Schema({
      dashboard: {type: String},
      username_created: {type: String}
  });

  userDashboardSchema.set('toJSON', {virtuals: true});
//end new Schema



  app.get('/listDashboards', function(req, resp) {

    var Dashboard = conn.model("Dashboard", dashboardSchema);
    

      for (var key in req.query) {
        if (req.query.hasOwnProperty(key)) {
          if(req.query[key].substring(0, 4) == 'not_') 
            req.query[key] = {
              '$ne':req.query[key].substring(4, req.query[key].length)
            };
        }
      }

    Dashboard.find(req.query, {},  {}, function(err, dashboards) {
      if (err) {
        return resp.send(err);
      }
      resp.send({dashboards: dashboards});
    });
  });

  app.get('/searchDashboard', function(req, resp) {

    var Dashboard = conn.model("Dashboard", dashboardSchema);

    var query = JSON.parse(req.query.query);

    Dashboard.find(query, {},  {}, function(err, dashboards) {
      if (err) {
        return resp.send(err);
      }
      resp.send({dashboards: dashboards});
    });
  });  
  
  app.get('/saveDashboard', function(req, resp) {

    var Dashboard = conn.model("Dashboard", dashboardSchema);
    var newDashboard = new Dashboard(req.query);

    newDashboard.save(function(err, dashboard) {
      if (err) {
        return resp.send(err);
      }
      resp.send(dashboard);
    });

  });


  app.get('/updateDashboard', function(req, resp) {

    var Dashboard = conn.model("Dashboard", dashboardSchema);
    var id = mongoose.Types.ObjectId(req.query._id);

    Dashboard.remove({_id:id}, function(err, d) {

      var newDashboard = new Dashboard(req.query);

      newDashboard.save(function(err, dashboard) {
          if (err) {
            return resp.send(err);
          }
          resp.send(dashboard);
      });

    });

  });

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
      req.login(user, function(err) {
      if (err) { 
        return res.send({user:'false', info:info});
      }
      return res.send({user:user, info:info});
    });    
  })(req, res, next);
});

app.post('/logout', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
      req.logout();
      return res.send('logout'); 
  })(req, res, next);
});

app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : false); 
});

  http.createServer(app).listen(app.get('port'), function () {
    console.log('Moab UI server listening on port ' + app.get('port') +
                ' in ' + app.settings.env + ' mode');
  });

};

