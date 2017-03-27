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

    //I did not need this call. Is this necessary?
    // fs.chmod(this.file.path, 0777);
    var TestRunner = require('../src/test-runner/TestRunner');
    var runner = new TestRunner(this.file.path, this.scriptType, this, cb);
    runner.run();
};

var handleErr = function(err) {
  console.log("Got an error");
};


mongoose.model('Test', TestSchema);