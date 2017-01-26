var app = angular.module('syntinel', ['ui.router', 'ngFileUpload']);

// Test Status - NOTRUN, OK, FAIL

/*
Here we set up our home route. You'll notice that the state is given a name 
('home'), URL ('/home'), and template URL ('/home.html'). We've also told 
Angular that our new state should be controlled by MainCtrl. Finally, using 
the otherwise() method we've specified what should happen if the app receives 
a URL that is not defined.
*/
app.config([
'$stateProvider',
'$urlRouterProvider',

function($stateProvider, $urlRouterProvider) {

  $stateProvider

    // The home state, displays list of all apps
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['apps', function(apps){
          return apps.getAll();
        }]
      }
    })

    // The apps state, displays the selected "app", and lists tests for the app.
    .state('apps', {
      url: '/apps/{id}',
      templateUrl: '/apps.html',
      controller: 'AppsCtrl',
      resolve: {
        app: ['$stateParams', 'apps', function($stateParams, apps) {
          return apps.get($stateParams.id);
        }]
      }
    })

    // The apps state, displays the selected "test", and lists results for the test.
    .state('tests', {
      url: '/tests/{id}',
      templateUrl: '/tests.html',
      controller: 'TestsCtrl',
      resolve: {
        test: ['$stateParams', 'tests', function($stateParams, tests) {
          return tests.get($stateParams.id);
        }]
      }
    })

    // Display the login page
    .state('login', {
      url: '/login',
      templateUrl: '/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
        $state.go('home');
        }
      }]
    })

    // Display the registration page
    .state('register', {
      url: '/register',
      templateUrl: '/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    });

  $urlRouterProvider.otherwise('home');
}]);


/* Apps Factory (A kind of service)   */
app.factory('apps', ['$http', 'auth', function($http, auth){
  var o = {
    apps: []
  };

  // Get a single app by id
  o.get = function(id) {
    return $http.get('/apps/' + id).then(function(res){
      return res.data;
    });
  };

  // Return all apps
  o.getAll = function() {
    return $http.get('/apps').success(function(data){
      angular.copy(data, o.apps);
    });
  };

  // Create a new app in the db
  o.create = function(app) {
    return $http.post('/apps', app).success(function(data){
      o.apps.push(data);
    });
  };

  return o;
}]);



/* Tests Factory (A kind of service)
What we're doing here is creating a new object that has an array property 
called tests. We then return that variable so that our o object essentially 
becomes exposed to any other Angular module that cares to inject it.
*/
app.factory('tests', ['$http', 'auth', 'Upload', function($http, auth, Upload){
  var o = {
    tests: []
  };

  // Get a single test by id
  o.get = function(id) {
    return $http.get('/tests/' + id).then(function(res){
      return res.data;
    });
  };

  // Return all tests
  o.getAll = function() {
    return $http.get('/tests').success(function(data){
      angular.copy(data, o.tests);
    });
  };

  // Create a new test, including file upload, for a particular app
  o.create = function(uploadData, app) {
     Upload.upload({
      url: '/apps/' + app._id + '/tests',
      method: 'post',
      data: uploadData
    }).then(function (response) {
      app.tests.push(response.data);
    });
  };


 // Run a test :
 // 1. Make an http post request to /tests/:id/run
 // 2. The server looks up the test in Mongo, and retrieves the path to the test script.
 // 3. The server sets the file permissions and executes the script.
 // 4. If the script executes, the server returns an object containing results of the script run.
 //    (time, didPass?, stdout, stderr)
 // 5. Now we are at the first .success() below...
 //    Once we get the result information, we make a post request to /tests/:id/results
 // 6. Server creates a Mongo record of the result and saves it, and saves the updated test. Finally it returns the result.
 // 7. Once we know Mongo is updated successfully we push the result to our test's results array.

 // TODO : Is there a (better) way to do this? Might not need to make 2 REST calls.
 // TODO2 : If the SHELL SCRIPT ITSELF does not run. (IE: does not compile) then the server generates an error, but
 //         right now the user is not made aware. IF the script generates output to stderr, then it is handled, and we log
 //         a failed test. All of this will change with real tests anyway...
 
  o.run = function(test) {
  return $http.post('/tests/' + test._id + '/run', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  })
    .success(function(data){
      $http.post('/tests/' + test._id + '/results', {
        timestamp: data.time,
        passed: data.passed,
        output: data.stdout,
        error: data.stderr
      })
      .success(function(result) {
        test.results.push(result);
      });
    });
  };

  return o;
}]);



/* Main application controller - injects the tests factory service */
app.controller('MainCtrl', [
'$scope', 
'apps',
'auth',
'Upload',
function($scope, apps, auth, Upload){

  $scope.apps = apps.apps;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addApp = function(){
    apps.create({
      name: $scope.name,
      description: $scope.description,
      created: Date.now(),
      owner:  null, //TODO: make this the logged in user, auth.currentUser didnt work
    });
    $scope.name = '';
    $scope.description = '';
  };
}]);


/* App page controller */
app.controller('AppsCtrl', [
'$scope',
'tests',
'app',
'auth',
function($scope, tests, app, auth){
  $scope.app = app;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.uploadTest = function(){
    tests.create($scope.upload, app);
  };

  $scope.runTest = function(test) {
    tests.run(test);
  };

}]);


/* Test page controller */
app.controller('TestsCtrl', [
'$scope',
'tests',
'test',
'auth',
function($scope, tests, test, auth){
  $scope.test = test;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.runTest = function(){
    tests.run(test);
  };


}]);



app.factory('auth', ['$http', '$window', function($http, $window){
   var auth = {};

  auth.saveToken = function (token){
    $window.localStorage['syntinel-token'] = token;
  };

  auth.getToken = function (){
    return $window.localStorage['syntinel-token'];
  };

  auth.isLoggedIn = function(){
    var token = auth.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function(user){
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function(){
    $window.localStorage.removeItem('syntinel-token');
  };

  return auth;
}]);


app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);



app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);






