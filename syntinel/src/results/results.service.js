(function(){
    angular
        .module('results')
        .factory('resultSvc', ResultsSvc);

    function ResultsSvc($http, $q, authenticationSvc) {
        var svc = {
            getResult: getResult
        };
        return svc;

        // Get specific result for a  tests
        function getResult(id) {
            return $http({
                url: "/tests/results/" + id,
                method: "GET"
            });
        }
    }
}());