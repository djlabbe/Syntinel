require('./models/Tests');
require('./models/Results');
require('./models/Users');
require('./models/Apps');
require('./config/passport');

var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/syntinel';
var MongoDB = mongoose.connect(mongoURI).connection;
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
app.use(express.static(__dirname + '/build'));
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

