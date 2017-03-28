var mongoose = require('mongoose');

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