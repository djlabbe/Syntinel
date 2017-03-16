var mongoose = require('mongoose');

var ResultSchema = new mongoose.Schema({
  test_id: mongoose.Schema.Types.ObjectId,
  timestamp: String,
  status: Boolean, // Should be boolean
  output: {type: String, default: null},
  error: {type: String, default: null}
});

mongoose.model('Result', ResultSchema);