  //
  // angular
  //     .module('syntinel', [
  //         'ui.router',
  //         'ngFileUpload'
  //     ])
  //   .config(configureApp);
  //
  // function configureApp($stateProvider, $urlRouterProvider) {
  //
  //   // The home state, displays list of all apps
  //   $stateProvider
  //     .state('home', {
  //       url: '/home',
  //       templateUrl: '/home.html',
  //       controller: 'MainCtrl',
  //       resolve: {
  //         postPromise: ['apps', function(apps){
  //           return apps.getAll();
  //         }]
  //       }
  //     })
  //
  //     // The apps state, displays the selected "app", and lists tests for the app.
  //     .state('apps', {
  //       url: '/apps/{id}',
  //       templateUrl: '/apps.html',
  //       controller: 'AppsCtrl',
  //       resolve: {
  //         app: ['$stateParams', 'apps', function($stateParams, apps) {
  //           return apps.get($stateParams.id);
  //         }]
  //       }
  //     })
  //
  //     // The apps state, displays the selected "test", and lists results for the test.
  //     .state('tests', {
  //       url: '/tests/{id}',
  //       templateUrl: '/tests.html',
  //       controller: 'TestsCtrl',
  //       resolve: {
  //         test: ['$stateParams', 'tests', function($stateParams, tests) {
  //           return tests.get($stateParams.id);
  //         }]
  //       }
  //     })
  //
  //     // Display the login page
  //     .state('login', {
  //       url: '/login',
  //       templateUrl: '/login.html',
  //       controller: 'AuthCtrl',
  //       onEnter: ['$state', 'auth', function($state, auth){
  //         if(auth.isLoggedIn()){
  //         $state.go('home');
  //         }
  //       }]
  //     })
  //
  //     // Display the registration page
  //     .state('register', {
  //       url: '/register',
  //       templateUrl: '/register.html',
  //       controller: 'AuthCtrl',
  //       onEnter: ['$state', 'auth', function($state, auth){
  //         if(auth.isLoggedIn()){
  //           $state.go('home');
  //         }
  //       }]
  //     });
  //
  //   $urlRouterProvider.otherwise('home');
  // }