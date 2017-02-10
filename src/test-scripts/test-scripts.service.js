(function(){
    "use strict";
    angular
        .module('testScripts')
        .factory('testScriptSvc', TestScriptSvc);

    function TestScriptSvc($http, $q, Upload){
        var svc = {
            getTest: getTest,
            createTest: createTest,
            runTest: runTest
        };
        return svc;

        function getTest(id){
            return $http
                .get('/tests/' + id);
        }
        function createTest(app, test){
            var deferred = $q.defer();
            Upload.upload({
                url: '/app/' + app._id + '/tests',
                method: 'post',
                data: test
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        }
        function runTest(test){
            return $http
                .post('/tests/' + test._id + '/run', null, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            });
        }
    }
}());