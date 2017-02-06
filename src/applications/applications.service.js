(function(){
    angular
        .module('applications')
        .factory('applicationSvc', ApplicationSvc);

    function ApplicationSvc($http, $q) {
        var svc = {
            getApp: getApp,
            getAllApps: getAllApps,
            createApp: createApp
        };
        return svc;

        // Get a single app by id
        function getApp(id) {
            var deferred = $q.defer();
            $http({
                url: "/app/" + id,
                method: "GET"
            }).then(function(data){
                deferred.resolve(data);
            }, function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        }

        // Return all apps
        function getAllApps() {
            var deferred = $q.defer();
            $http({
                url: "/app/getAll",
                method: "GET"
            }).then(function(data){
                deferred.resolve(data);
            }, function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        }

        // Create a new app in the db
        function createApp(app) {
            return $http.post('app/apps', app).success(function (data) {
                o.apps.push(data);
            });
        }
    }
}());