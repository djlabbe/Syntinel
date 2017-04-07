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
var App = mongoose.model('App');
var Result = mongoose.model('Result');

/* Preload a APP object by id */
router.param('app', function(req, res, next, id) {
  var query = App.findById(id);

  query.exec(function (err, app){
    if (err) { return next(err); }
    if (!app) { return next(new Error('can\'t find app')); }

    req.app = app;
    return next();
  });
});

/* Get all apps */
router.get('/apps', function(req, res, next) {
  App.find(function(err, apps){
    if(err){ return next(err); }
    return res.json(apps);
  });
});

/* Get single app by id */
router.get('/apps/:app', function(req, res, next) {
  req.app.populate('tests', function(err, app) {
    if (err) { return next(err); }
    return res.json(app);
  });
});

/* Save a new app */
router.post('/apps', function(req, res, next) {
  var app = new App(req.body);
  app.failedTests = [];
  app.save(function(err, app){
    if(err){ return next(err); }
    return res.json(app);
  });
});

/* Save a new test, update the app*/
router.post('/app/:app/tests', upload.single('file'), function (req, res, next) {
  fs.readFile(req.file.path, 'utf8', function (err,data) {
    if (err) { return next(err); }
    var filecontents = filecontents = data;
    var testData = {
      name: req.body.name,
      created: Date.now(),
      description: req.body.description,
      file: req.file,
      filecontents: filecontents,
      status: -1, // -1 = not run
      scriptType: req.body.scriptType,
      app: req.app,
      frequency: req.body.frequency,
      results: [],
      isActive: true
    };

    var test = new Test(testData);

    test.save(function (err, test) {
      if (err) {return next(err); }
        req.app.tests.push(test);
        req.app.save(function(err, app) {
        if (err) {return next(err); }

        return res.json(test);
      });
    });
  });
});

router.delete('/apps/:app', function(req,res) {

console.log("App ID: " + req.params.app);

  Test.find({app: req.params.app}, function(err, test){
      if(err) {return console.log("Error!!"); }
      if(!test || test.length === 0) { return console.log("Test not found."); }
      // Remove File from System
      test.forEach(function(tst){
        tst.remove();
      });
  });

  App.findById(req.params.app, function(err, app){
    if(err){return next(err);}
    if(!app || app.length === 0 ) {console.log('Could not find app'); }
    app.remove();
  });
});



module.exports = router;