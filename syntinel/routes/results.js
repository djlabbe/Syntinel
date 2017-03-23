var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Test = mongoose.model('Test');
var Result = mongoose.model('Result');

/* Retrieve the result for a specif test*/
router.get('/tests/results/:results', function(req, res, next) {
    console.log(req);
    Result.findById(req.params.results, function(err, result){
        if(err){ return next(err); }
        else{
            console.log("Found result for resultID" + result._id );
            return res.json(result);
        }
    });
});

module.exports = router;