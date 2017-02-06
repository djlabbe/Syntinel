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
                url: "/addTest",
                onEnter: function($uibModal, $state){
                    $uibModal.open({
                        templateUrl: 'src/test-scripts/add-test-script.tmpl.html',
                        controller: 'addTestCtrl as vm'
                    }).result.finally(function(){
                        $state.go('applications');
                    });
                }
            });
    }
}());