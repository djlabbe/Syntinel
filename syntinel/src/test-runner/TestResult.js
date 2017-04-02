/**
 * Created by Cody Thomas Zeitler on 3/22/2017.
 */

module.exports = TestResult;

function TestResult(databaseItem, saveCallback){

    this.databaseItem = databaseItem;
    this.saveCallback = saveCallback;

};

TestResult.prototype.save = function(error, stdout, stderr){
    var errorMsg = null;
    if(error) {errorMsg = error;}
    if(stderr) {errorMsg = stderr;}

    var self = this.databaseItem;
    var cb = this.saveCallback;

    var didPass = (errorMsg === undefined || errorMsg == null || errorMsg.length <= 0) ? true : false;

    var mongoose = require('mongoose');
    var Result = mongoose.model('Result');
    var result = new Result({
        test_id: self._id,
        created: Date.now(),
        status: didPass,
        output: stdout,
        error: error || stderr
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
     will generate an error and return however. */
    // Check if the test still exists?
    result.save(function(err, result){
        if(err){ return handleErr(err); }

        // If the result was created then push it to the test
        self.results.push(result);
        self.status = didPass ? 1 : 0;

        // And save the test
        self.save(function(err, test) {
            if(err){ return handleErr(err); }
            return Result.find({ _id: result._id }, cb);
        });
    });
}











