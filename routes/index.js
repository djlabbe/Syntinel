var express = require('express');
var router = express.Router();
var fs = require('fs');
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

/********************/
/* HOME PAGE ROUTES */
/********************/

/* Get home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Get all apps */
router.get('/apps', function(req, res, next) {
  App.find(function(err, apps){
    if(err){ return next(err); }

    res.json(apps);
  });
});

/* Save a new app */
router.post('/apps', function(req, res, next) {
  var app = new App(req.body);

  app.save(function(err, app){
    if(err){ return next(err); }

    res.json(app);
  });
});


/********************/
/* APP PAGE ROUTES */
/********************/


/* Save a new test, update the app*/
router.post('/apps/:app/tests', upload.single('file'), function (req, res, next) {
  console.log(req.body);
  console.log(req.file);

  var testData = {
    name: req.body.name,
    created: Date.now(),
    file: req.file,
    status: "NOTRUN",
    results: []
  };

  var test = new Test(testData);
  
  test.save(function (err, test) {
    if (err) {return next(err); }

    req.app.tests.push(test);
    req.app.save(function(err, app) {
      if (err) {return next(err); }

      res.json(test);
    });
  });
});


/* Retrieve tests along with apps */
router.get('/apps/:app', function(req, res, next) {
  req.app.populate('tests', function(err, app) {
    if (err) { return next(err); }

    res.json(app);
  });
});


/********************/
/* TEST PAGE ROUTES */
/********************/

/* Retrieve results along with tests */
router.get('/tests/:test', function(req, res, next) {
  req.test.populate('results', function(err, test) {
    if (err) { return next(err); }

    res.json(test);
  });
});

/* "Run" a test */
router.put('/tests/:test/run', auth, function(req, res, next) {
  req.test.run(function(err, test){
    if (err) { return next(err); }

    res.json(test);
  });
});

/* Add a result to a test */
router.post('/tests/:test/results', function(req, res, next) {
  var result = new Result(req.body);
  result.test = req.test;

  result.save(function(err, result){
    if(err){ return next(err); }

    req.test.results.push(result);
    req.test.save(function(err, test) {
      if(err){ return next(err); }

      res.json(result);
    });
  });
});


/****************************/
/* PRELOAD PARAMETER ROUTES */
/****************************/

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


/****************************/
/* AUTH              ROUTES */
/****************************/

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


