var mongoose = require('mongoose');
var Result = mongoose.model('Result');
var fs = require('fs'); //filesystem
var exec = require('child_process').exec;

var TestSchema = new mongoose.Schema({
  name: String,
  description: String,
  created: Date,
  file: Object,
  status: {type: Number, enum: [-1, 0, 1], default: -1},
  scriptType: {type: String, enum: ['shell', 'selenium', 'jmeter']},
  filecontents: String,
  parentApp: { type: mongoose.Schema.Types.ObjectId, ref: 'App' },
  frequency: { type: Number, enum: [5, 30, 300, 600, 1800, 3600, 86400]},
  results: [{type: mongoose.Schema.Types.ObjectId, ref: 'Result'}]
});

TestSchema.pre('remove', function(next){
  this.model('Result').remove({test_id: this._id}, next);
});

TestSchema.methods.run = function(cb) {
  // Change the permissions to allow execute
  fs.chmod(this.file.path, 0777, function(err){
    if(err) { return next(err); }
  });

  var execCommand = '';
  if (this.scriptType == 'shell') { execCommand = this.file.path;}
  if (this.scriptType == 'selenium') { execCommand = 'node ' + this.file.path;}

  var self = this;

  exec(execCommand, function(error, stdout, stderr) {
    var errorMsg = null;
    if(error) {errorMsg = error;}
    if(stderr) {errorMsg = stderr;}

    var didPass = (errorMsg === undefined || errorMsg == null || errorMsg.length <= 0) ? true : false;

    var result = new Result({
      test_id: self._id,
      created: Date.now(),
      status: didPass,
      output: stdout,
      error: error || stderr
    });

    result.save(function(err, result){
      if(err){ return next(err); }

      // If the result was created then push it to the test
      self.results.push(result);
      self.status = didPass ? 1 : 0;

      // And save the test
      self.save(function(err, test) {
        if(err){ return next(err); }
        return Result.find({ _id: result._id }, cb);
      });
    });
  });
}


mongoose.model('Test', TestSchema);