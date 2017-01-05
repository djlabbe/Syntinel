var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
  name: String,
  created: Date,
  file: Object,
  status: String,
  results: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Result' }]
});

TestSchema.methods.run = function(cb) {
  this.status = "OK";
  this.save(cb);
};

mongoose.model('Test', TestSchema);