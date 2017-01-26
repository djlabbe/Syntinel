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
        owner:  null, //TODO: make this the logged in user, auth.currentUser didnt work
      });
      $scope.name = '';
      $scope.description = '';
    };
  }]);