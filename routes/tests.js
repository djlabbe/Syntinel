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

var exec = require('child_process').exec;


/* Retrieve results along with tests (populate tests with results) */
router.get('/:test', function(req, res, next) {
  req.test.populate('results', function(err, test) {
    if (err) { return next(err); }

    res.json(test);
  });
});

/* "Run" a test (CREATE a result) --Is post correct? Get? put??,
    or maybe this calls another route when the result is actually generated? 
*/

router.post('/:test/run', auth, function(req, res, next) {
  // retrieve the entire test object from the db
  var test = Test.findById(req.params.test, function (err, test) {
    if (err) { return next(err); }
    
    // Change the permissions to allow execute
    fs.chmod(test.file.path, 0777, function(err){
      if(err) { return next(err); } 
    });

    // Execute the script
    exec(test.file.path, function (error, stdout, stderr) {
      if (error) { 
        console.log('exec error: ' + error);
        return next(error); 
      }


      // If no error : print the output streams...
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);

      var d = new Date();

      // If stderr is empty - then the test passed! (FOR NOW!! TODO)
      var didPass = (stderr === undefined || stderr == null || stderr.length <= 0) ? 'SUCCESS' : 'FAIL';

      var testResult = {
                    time: d.toUTCString(),
                    passed: didPass,
                    stdout: stdout,
                    stderr: stderr
                    };

      res.json(testResult);

    });
  });
});

/* Add a result to a test */
router.post('/:test/results', function(req, res, next) {
  console.log(req.body);
  var result = new Result(req.body);
  result.test = req.test; // ???

  result.save(function(err, result){
    if(err){ return next(err); }

    req.test.results.push(result);
    req.test.save(function(err, test) {
      if(err){ return next(err); }

      res.json(result);
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
