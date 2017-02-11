(function() {
    angular
        .module('testScripts')
        .component('viewTestComp', {
            templateUrl: 'src/test-scripts/view-test-script.tmpl.html',
            controller: ViewScriptsCtrl
        });

    /* @ngInject */
    function ViewScriptsCtrl(applicationSvc, $stateParams, $location, testScriptSvc) {
        var vm = this;
        vm.test = {};
        testScriptSvc.getTest($stateParams.testId).then(function(test){
            vm.test = test.data;
            vm.test.name = test.data.name;
        });
    }
}());