angular.module('syntinel')
  .controller('MainCtrl', [
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
        owner:  auth.currentUser(), // This is just a String, not a User
      });
      $scope.name = '';
      $scope.description = '';
    };
  }]);