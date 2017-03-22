require('./models/Tests');
require('./models/Results');
require('./models/Users');
require('./models/Apps');
require('./config/passport');

var request = require('request');
var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/syntinel';
var MongoDB = mongoose.connect(mongoURI).connection;

var Test = mongoose.model('Test');

var app = express();


MongoDB.on('error', function (err) {
  if (err) {
    console.log('mongodb connection error', err);
  } else {
    console.log('mongodb connection successful');
  }
});

MongoDB.once('open', function () {
  console.log('mongodb connection open');
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'src', 'favicon.ico')));
app.use(express.static(__dirname + '/'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(cookieParser());
app.use(passport.initialize());

/* routes modularity */
app.use(require('./routes/index'));
app.use(require('./routes/apps'));
app.use(require('./routes/tests'));

var server = http.createServer(app);
var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("Server listening on port: ", port);
});

/* Timed Shell Execution */

var runQueue = [];
var freqs = [5, 30, 300, 600, 1800, 3600, 86400];

freqs.forEach(function(freq) {
  setInterval(function () {
    var cursor = Test.find({ frequency: freq }).cursor();
    cursor.on('data', function(doc) {
      runQueue.push(doc);
    });
  }, 1000 * freq); 
});

 setInterval(function () {
    if(runQueue.length > 0) {
      var nextTest = runQueue.shift(); // This will become inefficient for large queues (O(n)). 
                                       // There are options such as http://code.stephenmorley.org/javascript/queues/
                     
      request.post('http://localhost:3000/test/' + nextTest._id + '/run'), function(error, response, body) {
        if (error) { return next (err) }
          console.log("RAN TEST: " + nextTest.name);
      }
    }
  }, 1000); 

