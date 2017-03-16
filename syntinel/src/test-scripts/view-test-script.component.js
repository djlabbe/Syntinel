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
        testScriptSvc.getTest($stateParams.testId).then(function(resp){
            vm.test = resp.data;
            vm.test.name = resp.data.name;
        });
        vm.runTest = function(){
            testScriptSvc.runTest(vm.test).then(function(resp){
               vm.test.results.push(resp.data);
            });
        };
        vm.deleteTest = function(){
            testScriptSvc.deleteTest(vm.test).then(function(data){
                var test = data;
            });
        };
    }
}());