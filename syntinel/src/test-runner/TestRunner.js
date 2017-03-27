/**
 * Created by Cody Thomas Zeitler on 3/23/2017.
 */

var SeleniumTest = require('./SeleniumTest');


//Might have to change depending on the operating system you are using.
const testPathDelimeter = "\\";

module.exports = TestRunner;

function TestRunner(path, type, databaseItem, cb){

    var testName = getTestName(path);
    var fullTestPath = getTestDirectoryPath(testName);
    this.type = type;
    this.test = create();
    this.databaseItem = databaseItem;


    function create(){

        var test;

        if(isSeleniumTest()){

            var SeleniumTest = require('./SeleniumTest');
            test = new SeleniumTest(fullTestPath, databaseItem, cb);

        }
        else if(isBashTest()){

            var BashTest = require('./BashTest');
            test = new BashTest(fullTestPath, databaseItem, cb);

        }
        else{

            console.log("Was not a correct test type.");

        }

        return test;

    };

    function isSeleniumTest(){

        return type === getSelenium();

    }

    function isBashTest(){

        return type === getBash();

    }

    function getTestName(testPath){

        var subpaths = testPath.split(testPathDelimeter);
        var fileNameIndex = subpaths.length - 1;
        return subpaths[fileNameIndex];

    }

    function getTestDirectoryPath(test){

        return "tests" + testPathDelimeter + test;

    }

};

function getSelenium(){

    return "selenium";

}

function getBash(){

    return "shell";

}

TestRunner.prototype.run = function(){

    this.test.run();

};















