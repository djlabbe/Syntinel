var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');



var User = mongoose.model('User');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'}); // Change 'SECRET'
                                                             // to env var


/* Get home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* Creates a user given a username and password */
router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();
  user.username = req.body.username;
  user.setPassword(req.body.password)
  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

/* Authenticates the user and returns a token to the client */
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;


