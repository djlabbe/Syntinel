var mongoose = require('mongoose');

var ResultSchema = new mongoose.Schema({
  test_id: mongoose.Schema.Types.ObjectId,
  created: Date,
  status: Boolean,
  output: {type: String, default: null},
  error: {type: String, default: null}
});

mongoose.model('Result', ResultSchema);