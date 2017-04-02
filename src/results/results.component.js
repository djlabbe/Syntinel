(function(){
    "use strict";

    angular
        .module('results')
        .component('resultsComp',{
            templateUrl: 'src/results/results.tmpl.html',
            controller: resultsCtrl
        });

    /* @ngInject */
    function resultsCtrl($stateParams, resultSvc){
        var vm = this;
        vm.result = {};
        resultSvc.getResult($stateParams.id).then(function(results){
            vm.result = results.data;
        });
    }
}());