(function(){
    "use strict";
    angular
        .module("results")
        .config(configResults);

    function configResults($stateProvider){
        $stateProvider
            .state("results",{
                url: "/tests/results/:id",
                template: '<results-comp></results-comp>',
                component: 'resultsComp'
            });
    }
}());