(function(){
    "use strict";
    angular
        .module("applications")
        .config(configApps);

    function configApps($stateProvider){
        $stateProvider
            .state("apps",{
                url: "/apps",
                template: '<apps></apps>',
                component: 'apps'
            })
            .state('app', {
                url: '/apps/:id',
                template: '<app></app>',
                component: 'app'
            })
             .state("addApp",{
                url:"/addApp",
                template: '<addApp></addApp>',
                component: 'addApp'
            });
    }
}());