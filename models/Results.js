var mongoose = require('mongoose');

var ResultSchema = new mongoose.Schema({
  timestamp: String,
  passed: String, // Should be boolean
  error: {type: String, default: null}
});

mongoose.model('Result', ResultSchema);