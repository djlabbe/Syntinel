# Syntinel

### Setup
##### 1. Install NodeJS
##### 2. Install MongoDB - https://docs.mongodb.com/manual/installation/
##### 3. Make sure Mongo is setup, follow directions above.

### Run
##### 1. terminal : "cd /path/to/syntinel"
##### 2. terminal : "npm install"
##### 3. terminalWindow2: "mongod &" 
##### 2. terminal : "npm start"
##### 3. WebBrowser : "http://localhost:3000/"

### Deployment

##### 1. Create Heroku Account
##### 2. Create Horuku Application
##### 3. Install Heroku CLI / Toolbelt
##### 4. terminal : "heroku login"
##### 6. terminal : "cd path/to/syntinel"
##### 7. terminal : "heroku git:remote -a syntinel"
##### 8. terminal : "git push heroku master"
##### 9. terminal : "heroku addons:add mongolab"