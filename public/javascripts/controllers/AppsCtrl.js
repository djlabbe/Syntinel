angular.module('syntinel')
  .controller('AppsCtrl', [
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