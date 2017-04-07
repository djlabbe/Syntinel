var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get('http://www.google.com')
    .then(_ => driver.findElement(webdriver.By.name('q')).sendKeys('webdriver'))
    .then(_ => driver.findElement(webdriver.By.name('btnG')).click())
    .then(_ => driver.wait(webdriver.until.titleIs('webdriver - Google Search'), 1000))
    .then(_ => driver.quit());