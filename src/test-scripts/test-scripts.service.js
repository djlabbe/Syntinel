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
            var deferred = $q.defer();
            $http({
                url: '/tests/' + id,
                method: "GET"
            }).then(function(data){
                deferred.resolve(data);
            }, function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        }
        function createTest(app, uploadData){

            var deferred = $q.defer();
            Upload.upload({
                url: '/apps/' + app._id + '/tests',
                method: 'post',
                data: uploadData
            }).then(function (response) {
                deferred.resolve(response);
            }, function(err){
                deferred.resolve(err);
            });
            return deferred.promise;
        }
        function runTest(test){
            return $http.post('/tests/' + test._id + '/run', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            })
                .success(function(result){
                    test.results.push(result);
                });
        }
    }
}());