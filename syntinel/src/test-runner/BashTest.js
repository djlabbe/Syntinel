/**
 * Created by Cody Thomas Zeitler on 3/24/2017.
 */


module.exports = BashTest;

function BashTest(path, databaseItem, saveResult){

    this.path = path;

    this.databaseItem = databaseItem;
    this.saveResultCallback = saveResult;
}


BashTest.prototype.run = function(){

    var toRun = this.path;

    var exec = require('child_process').exec;

    var TestResult = require('./TestResult');
    var result = new TestResult(this.databaseItem, this.saveResultCallback);

    exec(toRun, function(error, stdout, stderr){
        result.save(error, stdout, stderr);
    });
};







