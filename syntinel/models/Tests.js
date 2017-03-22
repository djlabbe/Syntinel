var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
  name: String,
  description: String,
  created: Date,
  file: Object,
  status: {type: Number, enum: [-1, 0, 1], default: -1},
  scriptType: {type: String, enum: ['shell', 'selenium', 'jmeter']},
  filecontents: String,
  parentApp: { type: mongoose.Schema.Types.ObjectId, ref: 'App' },
  frequency: { type: Number, enum: [5, 30, 300, 600, 1800, 3600, 86400]},
  results: [{type: mongoose.Schema.Types.ObjectId, ref: 'Result'}]
});

TestSchema.pre('remove', function(next){
  this.model('Result').remove({test_id: this._id}, next);
});

mongoose.model('Test', TestSchema);