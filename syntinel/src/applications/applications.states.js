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
            })
            .state("addApplication",{
                url:"/addApplication",
                template: '<add-application-comp></add-application-comp>',
                component: 'addApplicationComp'
            });
    }
}());