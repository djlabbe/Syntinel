var express = require('express');
var router = express.Router();
var fs = require('fs'); //filesystem
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var multer = require('multer');
var upload = multer({dest: 'tests/'});

var User = mongoose.model('User');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'}); // Change 'SECRET'
                                                             // to env var
var Test = mongoose.model('Test');
var Result = mongoose.model('Result');
var App = mongoose.model('App');

/* Preload a TEST object by id */
router.param('test', function(req, res, next, id) {
  var query = Test.findById(id);
  query.exec(function (err, test){
    if (err) { return next(err); }
    if (!test) { return next(new Error('can\'t find test')); }
    req.test = test;
    return next();
  });
});

/* Get all tests */
router.get('/tests/', function(req, res, next) {
  Test.find(function(err, tests){
    if(err){ return next(err); }
    return res.json(tests);
  });
});

/* Get a single test */
router.get('/tests/:test', function(req, res, next) {
  Test.findById(req.params.test, function(err, test) {
     if (err) { return next(err); }
     return res.json(test);
  });
});

/* Run a test */
router.post('/tests/:test/run', auth, function(req, res, next) {
  Test.findById(req.params.test, function (err, test) {
    if (err) { return next(err); }

    test.run(function(err, result) {
      if (err) { return next(err);}
      return res.json(result);
    });
  });
});

/* Toggle isActive */
router.put('/tests/:test', auth, function(req, res, next) {
  var test = req.test;
  test.isActive = !test.isActive;
  test.save(function(err, test) {
    return res.json(test);
  });
});

/* Delete a test */
router.delete('/tests/:test', function (req, res, next) {
  Test.findById(req.params.test, function(err, test){
    if(err){
      return next(err);
    } else if (!test){
        return console.log("Test not found.");
    }
    // Remove from db
    test.remove();

    // Remove File from System
    fs.unlinkSync(test.file.path);

    App.findById(test.app, function(err, app) {
      if (err){ return next(err);}
      var index = app.tests.indexOf(test.id);
      if (index > -1) {
        app.tests.splice(index, 1);
      }
      app.save(function(err, app) {
        if(err){ return next(err);}
        return res.json(test);
      });
    });
  });
});

/* Get all results belonging to a test */
router.get('/tests/:test/results', function(req, res, next) {
  Result.find( {test_id: req.params.test }, function(err, results){
    if(err){ return next(err); }
    return res.json(results);
  });
});



module.exports = router;
