/*
* Carry out a Google Search
*/
 
"use strict";
require('chromedriver');
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
    return browser.findElements(webdriver.By.css('[href="https://www.allstate.com/"]')).then(function(result) {
        return result[0];
    });
}
 
function closeBrowser() {
    browser.quit();
}
 
browser.get('https://www.google.com');
browser.findElement(webdriver.By.name('q')).sendKeys('allstate');
browser.findElement(webdriver.By.name('btnG')).click();
browser.wait(findLink, 5000).then(clickLink).then(logTitle).then(closeBrowser, handleFailure);