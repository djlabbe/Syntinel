(function(){
    angular
        .module('applications')
        .factory('applicationSvc', ApplicationSvc);

    function ApplicationSvc($http, $q, authenticationSvc) {
        var svc = {
            getApp: getApp,
            getAllApps: getAllApps,
            createApp: createApp,
            deleteApp: deleteApp
        };
        return svc;

        // Get a single app by id
        function getApp(id) {
            var deferred = $q.defer();
            $http({
                url: "/apps/" + id,
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
                url: "/apps",
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
            if(!app.created){
                app.created = Date.now()
            }
            if(!app.owner){
                app.owner = authenticationSvc.currentUser();
            }
            if(!app.status){
                app.status = true;
            }
            var deferred = $q.defer();
            $http({
                url: "/apps",
                method: "POST",
                data: app
            }).then(function(data){
                deferred.resolve(data);
            }, function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        }

        // Delete a app in the db
        function deleteApp(app, id) {

            $http.delete('/apps/' + id);

        }
    }
}());