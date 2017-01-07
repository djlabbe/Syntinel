var mongoose = require('mongoose');

var AppSchema = new mongoose.Schema({
  name: String,
  description: String,
  created: Date,
  owner:  { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }]
});


mongoose.model('App', AppSchema);