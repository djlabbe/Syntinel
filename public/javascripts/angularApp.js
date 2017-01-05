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
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['tests', function(tests){
          return tests.getAll();
        }]
      }
    })

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



/* Tests Factory (A kind of service)
What we're doing here is creating a new object that has an array property 
called tests. We then return that variable so that our o object essentially 
becomes exposed to any other Angular module that cares to inject it.
*/
app.factory('tests', ['$http', 'auth', 'Upload', function($http, auth, Upload){
  var o = {
    tests: []
  };

  o.get = function(id) {
    return $http.get('/tests/' + id).then(function(res){
      return res.data;
    });
  };

  o.getAll = function() {
    return $http.get('/tests').success(function(data){
      angular.copy(data, o.tests);
    });
  };


  o.create = function(uploadData) {
     Upload.upload({
      url: '/tests',
      method: 'post',
      data: uploadData
    }).then(function (response) {
      o.tests.push(response.data);
    });
  };


  o.addResult = function(id, result) {
    return $http.post('/tests/' + id + '/results', result);
  };

  o.run = function(test) {
  return $http.put('/tests/' + test._id + '/run', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  })
    .success(function(data){
      test.status = "OK";
      var d = new Date();
      o.addResult(test._id, {
        timestamp: d.toUTCString(),
        passed: 'true',
        error: null
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
'tests',
'auth',
'Upload',
function($scope, tests, auth, Upload){

  $scope.tests = tests.tests;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.uploadTest = function(){
    var uploadData = $scope.upload;
    tests.create($scope.upload);
    // TODO: If these are enabled, they get reset before file
    // $scope.upload.name = '';
    // $scope.upload.file = '';
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






