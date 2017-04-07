var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get('http://www.asu.com')
    .then(_ => driver.findElement(webdriver.By.linkText("Read more")).click())
    .then(_ => console.log('Current Page Title: ' + title))
    .then(_ => driver.quit());