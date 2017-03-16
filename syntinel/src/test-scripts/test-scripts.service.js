(function(){
    "use strict";
    angular
        .module('testScripts')
        .factory('testScriptSvc', TestScriptSvc);

    function TestScriptSvc($http, $q, Upload, authenticationSvc){
        var svc = {
            getAllTests: getAllTests,
            getTest: getTest,
            createTest: createTest,
            runTest: runTest,
            deleteTest: deleteTest
        };
        return svc;

        function getAllTests(){
            return $http
                .get('/test/');
        }
        function getTest(id){
            return $http
                .get('/test/' + id);
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
            return $http.post('/test/' + test._id + '/run', null,
                {headers: {Authorization: 'Bearer ' + authenticationSvc.getToken()}
            });
        }
        
        function deleteTest(test){
            return $http.delete('test/' + test._id + '/delete', null,
                {headers: {Authorization: 'Bearer ' + authenticationSvc.getToken()}
            });
        }
    }
}());