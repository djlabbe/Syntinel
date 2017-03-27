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
            deleteTest: deleteTest
        };
        return svc;

        function getLastDeletedTest(){
            return lastDeleted;
        }
        function resetLastDeleted(){
            lastDeleted = null;
        }

        function getAllTests(){
            return $http
                .get('/test/');
        }
        function getTest(id){
            return $http
                .get('/test/' + id);
        }
        function createTest(app, test){

            console.log("Test has been created.");

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

            console.log("Run test has been called.");

            return $http.post('/test/' + test._id + '/run', null,
                {headers: {Authorization: 'Bearer ' + authenticationSvc.getToken()}
            });
           
        }
        
        function deleteTest(test){
            lastDeleted = test;
            return $http.delete('test/' + test._id + '/delete', null,
                {headers: {Authorization: 'Bearer ' + authenticationSvc.getToken()}
            });
        }
    }
}());