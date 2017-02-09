(function () {
    "use strict";

    angular
        .module('app', [
            'ui.router',
            'ngRoute',
            'ngFileUpload',
            'ui.grid',
            'ui.grid.selection',
            'ui.grid.edit',
            'applications',
            'core',
            'testScripts'
        ])
        .config(configureApp)
        .run(runApp);

    /* @ngInject */
    function configureApp($urlRouterProvider) {
        $urlRouterProvider
            .when("", "applications");
    }
    function runApp(authenticationSvc, $rootScope, $location){
        $rootScope.$on("$stateChangeStart", function(evt){
           if(!authenticationSvc.isLoggedIn()){
               $location.path("/userLogin");
           }
        });
    }
}());