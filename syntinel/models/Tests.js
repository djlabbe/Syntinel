var mongoose = require('mongoose');
var Result = mongoose.model('Result');
var App = mongoose.model('App');
var fs = require('fs'); //filesystem
var nodemailer = require('nodemailer');
var exec = require('child_process').exec;
var TestRunner = require('../src/test-runner/TestRunner');

// TODO: Figure out where to store this and how to encrypt the password
var transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'SyntinelNotification@gmail.com',
      pass: '@ll$81122'
  }
});

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

    //I did not need this call. Is this necessary?
    // fs.chmod(this.file.path, 0777);
    var runner = new TestRunner(this.file.path, this.scriptType, this, cb);
    runner.run();
};


var handleErr = function(err) {
  console.log("Got an error");
};


mongoose.model('Test', TestSchema);