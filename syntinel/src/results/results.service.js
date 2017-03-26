(function(){
    angular
        .module('results')
        .factory('resultSvc', ResultsSvc);

    function ResultsSvc($http) {
        var svc = {
            getResult: getResult,
            clearResults: clearResults
        };
        return svc;

        // Get specific result for a  tests
        function getResult(id) {
            return $http({
                url: "/tests/results/" + id,
                method: "GET"
            });
        }

        function clearResults(id){
            return $http({
                url: "/clearResults/" + id,
                method: "DELETE"
            });
        }
    }
}());