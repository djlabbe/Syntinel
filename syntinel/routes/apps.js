var express = require('express');
var router = express.Router();
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


/* Get all apps */
router.get('/app/getAll', function(req, res, next) {
  App.find(function(err, apps){
    if(err){ return next(err); }
    return res.json(apps);
  });
});

/* Save a new app */
router.post('/app/save', function(req, res, next) {
  var app = new App(req.body);

  app.save(function(err, app){
    if(err){ return next(err); }
    return res.json(app);
  });
});

/* Save a new test, update the app*/
router.post('/app/:app/tests', upload.single('file'), function (req, res, next) {
  console.log(req.body);
  console.log(req.file);

  var testData = {
    name: req.body.name,
    created: Date.now(),
    description: req.body.description,
    file: req.file,
    status: -1,
    scriptType: req.body.scriptType,
    parentApp: req.app,
    frequency: req.body.frequency,
    results: []
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

/* Retrieve tests along with apps */
router.get('/app/:app', function(req, res, next) {
  req.app.populate('tests', function(err, app) {
    if (err) { return next(err); }

    return res.json(app);
  });
});


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

module.exports = router;