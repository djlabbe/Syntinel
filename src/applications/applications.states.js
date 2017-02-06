(function(){
    "use strict";
    angular
        .module("applications")
        .config(configApps);

    function configApps($stateProvider){
        $stateProvider
            .state("applications",{
                url: "/applications",
                template: '<applications-comp></applications-comp>',
                component: 'applicationsComp'
            });
    }
}());