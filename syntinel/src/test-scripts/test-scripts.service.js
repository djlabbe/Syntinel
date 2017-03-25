(function(){
    "use strict";
    angular
        .module('testScripts')
        .factory('testScriptSvc', TestScriptSvc);

    function TestScriptSvc($http, $q, Upload, authenticationSvc){

        var lastDeleted = null;

        var svc = {
            getLastDeletedTest: getLastDeletedTest,
            resetLastDeleted: resetLastDeleted,
            getAllTests: getAllTests,
            getTest: getTest,
            createTest: createTest,
            runTest: runTest,
            getResults: getResults,
            deleteTest: deleteTest,
            toggleActive: toggleActive
        };
        return svc;

        function getLastDeletedTest(){
            return lastDeleted;
        }
        function resetLastDeleted(){
            lastDeleted = null;
        }

        function getAllTests(){
            return $http.get('/tests/');
        }
        function getTest(id){
            return $http.get('/tests/' + id);
        }
        function getResults(id){
            return $http.get('/tests/' + id + '/results');
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
            return $http.post('/tests/' + test._id + '/run', null,
                {headers: {Authorization: 'Bearer ' + authenticationSvc.getToken()}
            });
        }

        function toggleActive(test) {
             return $http.put('/tests/' + test._id, null,
                {headers: {Authorization: 'Bearer ' + authenticationSvc.getToken()}
            });
        }
        
        function deleteTest(test){
            lastDeleted = test;
            return $http.delete('tests/' + test._id, null,
                {headers: {Authorization: 'Bearer ' + authenticationSvc.getToken()}
            });
        }
    }
}());