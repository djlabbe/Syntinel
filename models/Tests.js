var mongoose = require('mongoose');
var Result = mongoose.model('Result');
var fs = require('fs'); //filesystem
var exec = require('child_process').exec;

var TestSchema = new mongoose.Schema({
  name: String,
  app: { type: mongoose.Schema.Types.ObjectId, ref: 'App' },
  description: String,
  created: Date,
  file: Object,
  status: {type: Number, enum: [-1, 0, 1], default: -1},
  scriptType: {type: String, enum: ['shell', 'selenium', 'jmeter']},
  filecontents: String,
  frequency: { type: Number, enum: [5, 30, 300, 600, 1800, 3600, 86400]},
  isActive: Boolean
});

TestSchema.pre('remove', function(next){
  this.model('Result').remove({test_id: this._id}, next);
});

TestSchema.methods.run = function(cb) {
  
    fs.chmod(this.file.path, 0777);

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



      /* BUG: If a test is mid run, and gets deleted, a result will still
         be created here in the database. The inside function that updates the test
         will generate an error and return safely however. */

      // Check if the test still exists?
      // Some sources recommend allowing these records to be created and just scheduling
      // a regular DB cleaning function to delete them.

      result.save(function(err, result){
        if(err){ return handleErr(err); }

        // If the result was created then push it to the test
        self.status = didPass ? 1 : 0;

        // And save the test
        self.save(function(err, test) {
          if(err){ return handleErr(err); }

          /* TODO: Make this not return an array */
          return Result.find({ _id: result._id }, cb);
        });
      });
    });
}

var handleErr = function(err) {
  console.log("Got an error");
}


mongoose.model('Test', TestSchema);