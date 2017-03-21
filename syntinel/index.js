require('./models/Tests');
require('./models/Results');
require('./models/Users');
require('./models/Apps');
require('./config/passport');

var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var bodyParser = require('body-parser');
var productionMongoURI = process.env.MONGOLAB_URI;
var mongoURI = "mongodb://localhost/syntinel";
var MongoDB = mongoose.connect(productionMongoURI).connection;
//var MongoDB = mongoose.connect(mongoURI).connection;
var app = express();
const port = 3000;

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

app.listen(port, function(){
  console.log("Server listening on port: ", port);
});

