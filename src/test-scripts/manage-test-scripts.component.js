(function(){
    angular
        .module('testScripts')
        .component('manageTestsComp',{
            templateUrl:'src/test-scripts/manage-test-scripts.tmpl.html',
            controller: ManageScripts
        });

    /* @ngInject */
    function ManageScripts(applicationSvc, $stateParams, $location, $scope){
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
        applicationSvc.getApp($stateParams.id).then(function(app){
            vm.app = app.data;
            vm.gridOptions.data = app.data.tests;
        });
        vm.addTest = function(){
            var url = '/addTest/' + vm.app._id;
            $location.path(url);
        };
        vm.runTest = function(){
            var tests = vm.gridApi.selection.getSelectedRows();
            test.forEach(function(test){

            });
        }
    }
}());