/* Tests Factory (A kind of service)
  What we're doing here is creating a new object that has an array property 
  called tests. We then return that variable so that our o object essentially 
  becomes exposed to any other Angular module that cares to inject it.
  */
angular.module('syntinel')
  .factory('tests', ['$http', 'auth', 'Upload', function($http, auth, Upload){
    var o = {
      tests: []
    };

    // Get a single test by id
    o.get = function(id) {
      return $http.get('/tests/' + id).then(function(res){
        return res.data;
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
   // 4. ...

   // TODO2 : If the SHELL SCRIPT ITSELF does not run. (IE: does not compile) then the server generates an error, but
   //         right now the user is not made aware. IF the script generates output to stderr, then it is handled, and we log
   //         a failed test. All of this will change with real tests anyway...
   
    o.run = function(test) {
      return $http.post('/tests/' + test._id + '/run', null, {
        headers: {Authorization: 'Bearer '+auth.getToken()}
      })
      .success(function(result){
           test.results.push(result);
      });
    };

    return o;
  }]);