/*
* Carry out a Google Search
*/
 
"use strict";
require('chromedriver');
var fs = require('fs'); //filesystem
var webdriver = require('selenium-webdriver');
var browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
 
function logTitle() {
    browser.getTitle().then(function(title) {
        console.log('Current Page Title: ' + title);
    });
}
 
function clickLink(link) {
    link.click();
}
 
function handleFailure(err) {
    console.error('Something went wrong\n', err.stack, '\n');
    closeBrowser();
}
 
function findLink() {
    return browser.findElements(webdriver.By.linkText("Careers")).then(function(result) {
        return result[0];
    });
}
 
function closeBrowser() {
    browser.quit();
}

function takeSS() {
   browser.takeScreenshot().then(function(data){
   var base64Data = data.replace(/^data:image\/png;base64,/,"")
   fs.writeFile("out.png", base64Data, 'base64', function(err) {
        if(err) console.log(err);
   });
});
}
 
browser.get('https://www.allstate.com');
browser.wait(findLink, 5000).then(clickLink).then(logTitle).then(takeSS).then(closeBrowser, handleFailure);