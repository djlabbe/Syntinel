angular.module('syntinel')
  .controller('TestsCtrl', [
  '$scope',
  'tests',
  'test',
  'auth',
  '$interval',
  function($scope, tests, test, auth, $interval){
    $scope.test = test;
    $scope.isLoggedIn = auth.isLoggedIn;



    $scope.runTest = function(){
      tests.run(test);
    };


  /* Known Bug -- UNTIL an interval occurs you can hit run button
      and the test runs and display updates.
      After an interval occurs, the page refreshes with any server ran tests, 
      but now if you hit run button, the test runs but does not display until
      the next interval refresh */
      
    var refreshInterval = 1000 * 5;

  
    $interval( function(){ 
      $scope.test = tests.get(test._id)
      .then(function(test) { 
        $scope.test = test;

      });
     }, refreshInterval);


  }]);

  // newResults = 0;
  // EventReceived fromServer-> "New Test Result(s) exist [Click] to load"
  // Click -> newResults = 0;

  // VIEW
  // if (newResults != 0) : Display message
  // else no message