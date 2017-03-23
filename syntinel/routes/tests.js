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

/* Get all tests */
router.get('/test/', function(req, res, next) {
  Test.find(function(err, tests){
    if(err){ return next(err); }
    return res.json(tests);
  });
});


/* Get all results belonging to a test */
router.get('/test/:test/results', function(req, res, next) {
  Result.find( {test_id: req.params.test }, function(err, results){
    if(err){ return next(err); }
    return res.json(results);
  });
});


/* Retrieve results along with tests (populate tests with results) */
router.get('/test/:test', function(req, res, next) {
  req.test.populate('results', function(err, test) {
    if (err) { return next(err); }
    fs.readFile(req.test.file.path, 'utf8', function (err,data) {
        if (err) { return next(err); }
        test.filecontents = data;
        return res.json(test);
    });
  });
});

router.post('/test/:test/run', auth, function(req, res, next) {
  Test.findById(req.params.test, function (err, test) {
    if (err) { return next(err); }

    test.run(function(err, result) {
      if (err) { return next(err);}
      return res.json(result);
    });
  });
});

router.delete('/test/:test/delete', function (req, res, next) {
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

      App.findById(test.parentApp, function(err, app) {
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

/* Preload a RESULT object by id */
router.param('result', function(req, res, next, id) {
  var query = Result.findById(id);

  query.exec(function (err, test){
    if (err) { return next(err); }
    if (!result) { return next(new Error('can\'t find result')); }

    req.result = result;
    return next();
  });
});

module.exports = router;
