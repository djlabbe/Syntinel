angular.module('syntinel')
.run(function($rootScope, $interval, $http, tests) {
  
  $interval(fiveSeconds, 5000); 
 // $interval(fiveMinutes, 300000);

  function fiveSeconds() {
    $http.post('/tests/run/5000');
  };

  // function fiveMinutes() {
  //   $http.post('/tests/run/300000');
  // };

});