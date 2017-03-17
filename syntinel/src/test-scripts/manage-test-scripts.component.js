(function(){
    angular
        .module('testScripts')
        .component('manageTestsComp',{
            templateUrl:'src/test-scripts/manage-test-scripts.tmpl.html',
            controller: ManageScripts
        });

    /* @ngInject */
    function ManageScripts(applicationSvc, $stateParams, $location, testScriptSvc, $scope){
        var vm = this;
        vm.message = "";
        vm.errorMessage = "";
        vm.gridOptions = {enableFiltering: true};
        vm.gridOptions.columnDefs = [
            {
                field:'status',
                enableFiltering: false,
                displayName: 'Status',
                cellTemplate: "<div ng-if='row.entity.status == true'>PASS</div><div ng-if='row.entity.status == false'>FAIL</div>",
                cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                    if (grid.getCellValue(row ,col) === true) {
                        return 'green-cell';
                    }
                    else if (grid.getCellValue(row ,col) === false) {
                        return 'red-cell';
                    }
                },
                width: "10%",
                resizable: true
            }, {
                field: 'name',
                displayName: 'Name',
                cellTemplate: '<div class="clickable" ng-click="grid.appScope.viewTest(row.entity)">{{row.entity.name}}</div>',
                cellClass: 'blue-cell',
                width: "27%",
                resizable: true
            }, {
                field:'description',
                displayName: 'Description',
                width: "31%",
                resizable: true
            }, {
                field:'created',
                enableFiltering: false,
                displayName: 'Created On',
                cellTemplate: "<div>{{row.entity.created | date:'medium'}}</div>",
                width: "20%",
                resizable: true
            }, {
                field: 'frequency',
                enableFiltering: false,
                displayName: 'Schedule',
                width: "12%"
            }
        ];
        vm.gridOptions.onRegisterApi = function(gridApi){
            vm.gridApi = gridApi;
        };
        if($stateParams.id){
        
            if (testScriptSvc.getLastDeletedTest() != null) {
                vm.message = "Successfully deleted test: " + testScriptSvc.getLastDeletedTest().name;
                testScriptSvc.resetLastDeleted();
            }
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
            if (vm.app)
            {
                var url = '/addTest/' + vm.app._id;
            }
            else 
            {
                var url = '/addTest/'  
            }
            $location.path(url);
        };
        vm.runTest = function(){
            var tests = vm.gridApi.selection.getSelectedRows();
            tests.forEach(function(test){
                testScriptSvc.runTest(test);
            });
            vm.message = "Test run complete!";
        };
        $scope.viewTest = function(row){
            var url = '/tests/test/' + row._id;
            $location.path(url);
        }
    }
}());