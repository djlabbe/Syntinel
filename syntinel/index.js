require('./models/Results');
require('./models/Tests');
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

app.use(favicon(path.join(__dirname, 'src', 'favicon.ico')));
app.use(express.static(__dirname + '/'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(cookieParser());
app.use(passport.initialize());

app.use(require('./routes/index'));
app.use(require('./routes/apps'));
app.use(require('./routes/tests'));

var server = http.createServer(app);
var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("Server listening on port: ", port);
});

/***************************************************************************/
/************************ Timed Script Execution ***************************/
/***************************************************************************/

var freqs = [5, 30, 300, 600, 1800, 3600, 86400];
var openConnections = [];

/* For each interval set up a loop --
      Every x seconds look up all tests with frequency == x,
      Iterate through the results, calling .run on each Test,
      Notify the clients that a new result was generated.
*/

freqs.forEach(function(freq) {
  setInterval(function () {
    var cursor = Test.find({ frequency: freq }).cursor();

    cursor.on('data', function(doc) {
      doc.run(function(err, result) {
        if (err) { return next(err); }
        openConnections.forEach(function(resp) {
          resp.write('data:' + JSON.stringify(result) +  '\n\n'); // Note the extra newline
        });
      });
    });
  }, 1000 * freq); 
});


/***************************************************************************/
/******************* SERVER SENT EVENTS ************************************/
/***************************************************************************/
/* Adapted from https://dzone.com/articles/html5-server-sent-events */

app.get('/clientConnection', function(req, res) {

    // set timeout as high as possible
    req.socket.setTimeout(Number.MAX_VALUE);

    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    res.write('\n');

    // push this res object to our global variable
    openConnections.push(res);

    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
        var toRemove;
        for (var j =0 ; j < openConnections.length ; j++) {
            if (openConnections[j] == res) {
                toRemove =j;
                break;
            }
        }
        openConnections.splice(j,1);
        console.log(openConnections.length);
    });
});

