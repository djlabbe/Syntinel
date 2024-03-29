var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Test = mongoose.model('Test');
var Result = mongoose.model('Result');

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

/* Retrieve the result for a specific test*/
router.get('/tests/results/:results', function(req, res, next) {
    Result.findById(req.params.results, function(err, result){
      if(err){ return next(err); }
      return res.json(result);
    });
});

router.delete('/clearResults/:testID', function (req, res, next) {
    Result.remove({test_id: req.params.testID}, function(err, removed){
      if(err){ return next(err); }
      console.log(removed + " Results cleared for test id: " + req.params.testID);
      res.send(true);
    });
});

module.exports = router;