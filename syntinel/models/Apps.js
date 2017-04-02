var mongoose = require('mongoose');
var User = mongoose.model('User');

var AppSchema = new mongoose.Schema({
  name: String,
  description: String,
  created: Date,
  status: Boolean,
  owner:  String,
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }]
});

AppSchema.methods.getUser = function(cb){
  User.findOne({username: this.owner}, cb);
};

mongoose.model('App', AppSchema);