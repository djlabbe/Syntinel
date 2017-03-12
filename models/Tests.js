var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
  name: String,
  created: Date,
  file: Object,
  status: String,
  filecontents: String,

  // 5sec = 5000, 5 mins = 5 * 60  * 1000
  frequency: { type: Number, enum: [5000, 30000], default: 30000},
  results: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Result'
  }]
});

TestSchema.pre('remove', function(next){
  this.model('Result').remove({test_id: this._id}, next);
});

mongoose.model('Test', TestSchema);