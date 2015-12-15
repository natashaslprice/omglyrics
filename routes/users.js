var User = require('../models/user.js'),
  qs = require('querystring'),
  jwt = require('jwt-simple'),
  request = require('request'),
  config = require('../config.js'),
  moment = require('moment'),
  auth = require('./auth');

module.exports = function(app) {

  app.get('/api/me', auth.ensureAuthenticated, function(req, res) {
    User.findById(req.userId, function(err, user) {
      res.send(user);
    });
  });

  app.put('/api/me', auth.ensureAuthenticated, function(req, res) {
    User.findById(req.userId, function(err, user) {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      user.confirm = req.body.confirm || user.confirm;
      // console.log("here", user.email, user.username);
      user.save(function(err) {
        res.status(200).end();
      });
    });
  });

  app.post('/auth/login', function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
      if (!user) {
        return res.status(401).send({ message: 'Wrong email or password' });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        console.log(isMatch);
        if (!isMatch) {
          return res.status(401).send({ message: 'Wrong email or password' });
        }
        res.send({ token: auth.createJWT(user) });
      });
    });
  });

  app.post('/auth/signup', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ message: 'Email is already taken' });
      }
      
      var user = new User({
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });

      user.save(function(err) {
        if (err) { 
          console.log("here", err);
        	return res.status(400).send({err: err});
        }
        console.log("here", auth.createJWT(user));
        res.send({ token: auth.createJWT(user) });
      });
    });
  });
};