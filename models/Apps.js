var mongoose = require('mongoose');
var Test = mongoose.model('Test');
var fs = require('fs');

var AppSchema = new mongoose.Schema({
  name: String,
  description: String,
  created: Date,
  status: Boolean,
  owner:  String,
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
  failedTests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }]
});

mongoose.model('App', AppSchema);