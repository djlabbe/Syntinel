angular.module('syntinel')
  .controller('TestsCtrl', [
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