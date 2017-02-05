(function(){
    angular
        .module('applications')
        .component('manageTestsComp',{
            templateUrl:'src/applications/test-scripts/manage-test-scripts.tmpl.html',
            controller: ManageScripts
        });

    /* @ngInject */
    function ManageScripts(testScriptSvc, $stateParams){
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
        testScriptSvc.getTest($stateParams.id).then(function(scripts){
            vm.gridOptions.data = scripts.data;
        });

    }
}());