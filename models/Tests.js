var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
  name: String,
  created: Date,
  file: Object,
  status: String,
  results: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Result' }]
});


mongoose.model('Test', TestSchema);