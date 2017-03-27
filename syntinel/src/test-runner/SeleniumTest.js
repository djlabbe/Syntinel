/**
 * Created by Cody Thomas Zeitler on 3/22/2017.
 */

module.exports = SeleniumTest;

function SeleniumTest(path, databaseItem, saveResult){

    this.path = path;

    this.databaseItem = databaseItem;
    this.saveResultCallback = saveResult;
}

SeleniumTest.prototype.run = function(){

    var toRun = prepareForRun(this.path);

    var exec = require('child_process').exec;

    var TestResult = require('./TestResult');
    var result = new TestResult(this.databaseItem, this.saveResultCallback);

    exec(toRun, function(error, stdout, stderr){
        result.save(error, stdout, stderr);
    });
};

function prepareForRun(test){
    return 'node "'.concat(test) +'"';
}
