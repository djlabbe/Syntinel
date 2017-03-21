# Syntinel

### Setup
##### 1. Install NodeJS - Google it
##### 2. Install MongoDB - https://docs.mongodb.com/manual/installation/
##### 3. Make sure Mongo is setup, may have to setup your data path.

### Run
##### 0. Install dependencies 'npm install'
##### 1. Start mongoDB running on your machine 
###### (Run "mongod &" from the command line on mac, or open the .exe on a pc)
##### 2. From the root project directory ( where index.js lives) run "npm start".
##### 3. Open a browser, go to "http://localhost:3000/"

### Deployment

##### 1. Create Heroku Account
##### 2. Create Horuku Application
##### 3. Install Heroku CLI / Toolbelt
##### 4. terminal : heroku login
###### (Add your Heroku app as a remote to your existing git clone’d repo)
##### 6. terminal : cd path/to/syntinel
##### 7. terminal : heroku git:remote -a syntinel
###### (Push to Heroku)
##### 8. terminal: git push heroku master
###### (https://syntinel.herokuapp.com/) => error => We need to install mongo
##### 9. Go to your heroku app dashboard.
##### 10. Click Get More Addons
##### 11. mLab MongoDB => install to syntinel
##### 12. Choose sandbox(free) and provision.