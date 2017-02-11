(function(){
    "use strict";
    angular
        .module('testScripts')
        .config(configScripts);

    function configScripts($stateProvider){
        $stateProvider
        // The apps state, displays the selected "test", and lists results for the test.
            .state('tests', {
                url: '/tests/:id',
                template: '<manage-tests-comp></manage-tests-comp>',
                component: 'manageTestsComp'
            })
            .state("addTest",{
                url: "/addTest/:appId",
                template: '<add-test-comp></add-test-comp>',
                component: 'addTestComp'
            })
            .state('tests/test',{
                url: '/tests/test/:testId',
                template: '<view-test-comp></view-test-comp>',
                component: 'viewTestComp'
            });
    }
}());