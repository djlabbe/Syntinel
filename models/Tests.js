var mongoose = require('mongoose');
var Result = mongoose.model('Result');
var App = mongoose.model('App');
var fs = require('fs'); //filesystem
var nodemailer = require('nodemailer');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

// TODO: Figure out where to store this and how to encrypt the password
var transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'SyntinelNotification@gmail.com',
      pass: '@ll$81122'
  }
});

var TestSchema = new mongoose.Schema({
  name: String,
  app: { type: mongoose.Schema.Types.ObjectId, ref: 'App' },
  description: String,
  created: Date,
  file: Object,
  status: {type: Number, enum: [-1, 0, 1], default: -1},
  scriptType: {type: String, enum: ['shell', 'selenium', 'jmeter']},
  filecontents: String,
  frequency: { type: Number, enum: [5, 30, 300, 600, 1800, 3600, 86400]},
  isActive: Boolean
});

TestSchema.pre('remove', function(next){
  this.model('Result').remove({test_id: this._id}, next);
});




TestSchema.methods.run = function(cb) {
  fs.chmod(this.file.path, 0777);

   var execCommand = '';
   if (this.scriptType == 'shell') { execCommand = this.file.path;}
   if (this.scriptType == 'selenium') { execCommand = 'node ' + this.file.path;}

  var self = this;


  const child = spawn(execCommand, []);
  var output = "";
  var errorMsg = "";

  child.stdout.on('data', (data) => {
    output = output + data;
  });

  child.stderr.on('data', (data) => {
    errorMsg = errorMsg + data;
  });

  child.on('close', (code) => {
    var didPass = (errorMsg === undefined || errorMsg == null || errorMsg.length <= 0) ? true : false;

    var result = new Result({
      test_id: self._id,
      created: Date.now(),
      status: didPass,
      output: output,
      error: errorMsg
    });

    // If error, send results by email to the application holder
    if(!didPass) {
      App.findById(self.app, sendEmail);
      function sendEmail(err, app) {
        if(err){ console.log('Could not application for appId: ' + self.app); }
        app.getUser(function (err, user) {
            if (err) { console.log('Could not find user for app: ', app._id); }
            // Create Email message
            var mailOpts = {
                from: 'SyntinelNotification@gmail.com',
                to: user.email,
                subject: 'Test ' + self.name + ' has failed for application ' + app.name,
                html: 'Output: ' + result.output + '<br>' + result.error
            };
            // Send message
            transport.sendMail(mailOpts, function(err, info){
              if(err){ console.log('Could not send email. Error: ' + err) }
              console.log('Email sent to ' + user.email);
            });
        });
      }
    }

    /* BUG: If a test is mid run, and gets deleted, a result will still
       be created here in the database. The inside function that updates the test
       will generate an error and return safely however. */

    // Check if the test still exists?
    // Some sources recommend allowing these records to be created and just scheduling
    // a regular DB cleaning function to delete them.

    result.save(function(err, result) {
      if(err){ return handleErr(err); }

      // If the result was created then push it to the test
      self.status = didPass ? 1 : 0;

      // And save the test
      self.save(function(err, test) {
        if(err){ return handleErr(err); }
        return Result.find({ _id: result._id }, cb);
      });
    });
  });
}




// TestSchema.methods.run = function(cb) {
  
//     fs.chmod(this.file.path, 0777);

//     var execCommand = '';
//     if (this.scriptType == 'shell') { execCommand = this.file.path;}
//     if (this.scriptType == 'selenium') { execCommand = 'node ' + this.file.path;}

//     var self = this;

//     exec(execCommand, function(error, stdout, stderr) {
//       var errorMsg = null;
//       if(error) {errorMsg = error;}
//       if(stderr) {errorMsg = stderr;}

//       var didPass = (errorMsg === undefined || errorMsg == null || errorMsg.length <= 0) ? true : false;

//       var result = new Result({
//         test_id: self._id,
//         created: Date.now(),
//         status: didPass,
//         output: stdout,
//         error: error || stderr
//       });

//       // If error, send results by email to the application holder
//       if(!didPass) {
//         App.findById(self.app, sendEmail);
//         function sendEmail(err, app) {
//           if(err){ console.log('Could not application for appId: ' + self.app); }
//           app.getUser(function (err, user) {
//               if (err) { console.log('Could not find user for app: ', app._id); }
//               // Create Email message
//               var mailOpts = {
//                   from: 'SyntinelNotification@gmail.com',
//                   to: user.email,
//                   subject: 'Test ' + self.name + ' has failed for application ' + app.name,
//                   html: 'Output: ' + result.output + '<br>' + result.error
//               };
//               // Send message
//               transport.sendMail(mailOpts, function(err, info){
//                 if(err){ console.log('Could not send email. Error: ' + err) }
//                 console.log('Email sent to ' + user.email);
//               });
//           });
//         }
//       }

//       /* BUG: If a test is mid run, and gets deleted, a result will still
//          be created here in the database. The inside function that updates the test
//          will generate an error and return safely however. */

//       // Check if the test still exists?
//       // Some sources recommend allowing these records to be created and just scheduling
//       // a regular DB cleaning function to delete them.

//       result.save(function(err, result) {
//         if(err){ return handleErr(err); }

//         // If the result was created then push it to the test
//         self.status = didPass ? 1 : 0;

//         // And save the test
//         self.save(function(err, test) {
//           if(err){ return handleErr(err); }
//           return Result.find({ _id: result._id }, cb);
//         });
//       });
//     });
// }

var handleErr = function(err) {
  console.log("Got an error");
}


mongoose.model('Test', TestSchema);