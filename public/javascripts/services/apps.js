angular.module('syntinel')
  .factory('apps', ['$http', 'auth', function($http, auth){
    var o = {
      apps: []
    };

    // Get a single app by id
    o.get = function(id) {
      return $http.get('/apps/' + id).then(function(res){
        return res.data;
      });
    };

    // Return all apps
    o.getAll = function() {
      return $http.get('/apps').success(function(data){
        angular.copy(data, o.apps);
      });
    };

    // Create a new app in the db
    o.create = function(app) {
      return $http.post('/apps', app).success(function(data){
        o.apps.push(data);
      });
    };

    return o;
  }]);
