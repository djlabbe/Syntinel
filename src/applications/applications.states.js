(function(){
    "use strict";
    angular
        .module("applications")
        .config(States);

    function States($stateProvider){

        $stateProvider
            .state("applications",{
                url: "/applications",
                template: '<applications-comp></applications-comp>',
                component: 'applicationsComp'
            })
            // The apps state, displays the selected "test", and lists results for the test.
            .state('tests', {
                url: '/tests/:id',
                template: '<manage-tests-comp></manage-tests-comp>',
                component: 'manageTestsComp'
            });
    }
}());