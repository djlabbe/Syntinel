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

/* Get all tests */
router.get('/test/', function(req, res, next) {

  Test.find(function(err, tests){
    if(err){ return next(err); }

    return res.json(tests);
  });
});

/* Retrieve results along with tests (populate tests with results) */
router.get('/test/:test', function(req, res, next) {
  req.test.populate('results', function(err, test) {
    if (err) { return next(err); } else {
        fs.readFile(req.test.file.path, 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            test.filecontents = data;
            return res.json(test);
        });
    }
  });
});

/* TODO : Pull out the duplicated code here, look at adding all tests needing to
 be run to an ASYNCH QUEUE so that we know when the new result has been saved.
 Ideally, as an item leaves the queue, it will trigger an event emission, and the
 test pages (with the results showing) will be listening for the event.
 If a test page receives an event matching that test, it will refresh the scope.

 See: http://stackoverflow.com/questions/25507866/how-can-i-use-a-cursor-foreach-in-mongodb-using-node-js
 */

/* Run all tests schedule for 5000ms */
// router.post('/run/5000', function(req, res, next) { // Add auth back in
 
//   var cursor = Test.find({}).cursor();

//   cursor.on('data', function(test) {
//     // Change the permissions to allow execute
//     fs.chmod(test.file.path, 0777, function(err){
//       if(err) { return next(err); }
//     });

//     // Execute the script
//     exec(test.file.path, function (error, stdout, stderr) {
//       if (error) {
//         console.log('exec error: ' + error);
//         return next(error);
//       }


//       // // If no error : print the output streams... for debugging
//       // console.log('stdout: ' + stdout);
//       // console.log('stderr: ' + stderr);

//       // If stderr is empty - then the test passed! (FOR NOW!! TODO)
//       var didPass = (stderr === undefined || stderr == null || stderr.length <= 0) ? 'SUCCESS' : 'FAIL';

//       var d = new Date();

//       var result = new Result({
//         test_id: test._id,
//         timestamp: d.toUTCString(),
//         passed: didPass,
//         output: stdout,
//         error: stderr
//       });

//       // Create a result record in db
//       result.save(function(err, result){
//         if(err){ return next(err); }

//         // If the result was created then push it to the test
//         test.results.push(result);

//         // And save the test
//         test.save(function(err, test) {
//           if(err){ return next(err); }
//         });
//       });
//     });
//   });
// });

/* "Run" a test (CREATE a result) --Is post correct? Get? put??,
    or maybe this calls another route when the result is actually generated? 
*/
router.post('/test/:test/run', auth, function(req, res, next) {
  // retrieve the entire test object from the db
  Test.findById(req.params.test, function (err, test) {
    // Execute the script
    // console.log(test);
    if (err) {
      return next(err);
    }
      // Change the permissions to allow execute
    fs.chmod(test.file.path, 0777, function(err){
      if(err) {
        return next(err); }
    });
    
    exec(test.file.path, function (error, stdout, stderr) {

      var date = new Date();
      var didPass = false;
      var errorMsg = null;
      var output = null;

      /* If there was a problem executing the script, we log the error message
         and return that as a result */
      if (error) {
        errorMsg = error;
        var didPass = false;
      }
      /* The script itself ran successfully, the test itself can still fail or pass.
         Save messages as a result. */
      else {
        didPass = (stderr === undefined || stderr == null || stderr.length <= 0) ? true : false;
        errorMsg = stderr;
        output = stdout;
      }

      var result = new Result({
        test_id: test._id,
        timestamp: date.toUTCString(),
        status: didPass,
        output: output,
        error: errorMsg
      });

      // Create a result record in db
      result.save(function(err, result){
        if(err){ return next(err); }

        // If the result was created then push it to the test
        test.results.push(result);
        test.status = didPass;

        // And save the test
        test.save(function(err, test) {
          if(err){ return next(err);  }
          return res.json(result);
        });
      });
    });
  });
});

/* DELETE a specific Test */
// TODO: @JOSH Delete Test from App model
router.delete('/test/:test/delete', function (req, res, next) {

    // Find and remove Test Script
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
        console.log("### APP.TESTS ####")
        console.log(app.tests);
        var index = app.tests.indexOf(test.id);
        if (index > -1) {
          app.tests.splice(index, 1);
        }
        app.save(function(err, app) {
          if(err){ return next(err);}
          return res.json(test);
        })
      })
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
