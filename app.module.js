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
        .config(configureApp);

    /* @ngInject */
    function configureApp($urlRouterProvider) {
        $urlRouterProvider
            .otherwise("applications");
    }
}());