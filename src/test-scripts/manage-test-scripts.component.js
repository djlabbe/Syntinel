(function(){
    angular
        .module('testScripts')
        .component('manageTestsComp',{
            templateUrl:'src/test-scripts/manage-test-scripts.tmpl.html',
            controller: ManageScripts
        });

    /* @ngInject */
    function ManageScripts(applicationSvc, $stateParams, $location, testScriptSvc){
        var vm = this;
        vm.gridOptions = {};
        vm.gridOptions.columnDefs = [
            {
                field: 'name',
                displayName: 'Name'
            }, {
                field: 'status',
                displayName: 'Status'
            }, {
                field: 'created',
                displayName: 'Created On'
            }, {
                field: 'frequency',
                displayName: 'Test Schedule'
            }
        ];
        vm.gridOptions.onRegisterApi = function(gridApi){
            vm.gridApi = gridApi;
        };
        if($stateParams.id){
        // Get tests for specific app
            applicationSvc.getApp($stateParams.id).then(function(app){
                vm.app = app.data;
                vm.gridOptions.data = app.data.tests;
            });
        } else {
        // Get all Tests
            testScriptSvc.getAllTests().then(function(tests){
                vm.gridOptions.data = tests.data;
            });
        }
        vm.addTest = function(){
            var url = '/addTest/' + vm.app._id;
            $location.path(url);
        };
        vm.runTest = function(){
            var tests = vm.gridApi.selection.getSelectedRows();
            tests.forEach(function(test){
                testScriptSvc.runTest(test);
            });
        };
    }
}());