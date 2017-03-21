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
        vm.message = "";
        vm.errorMessage = "";

        testScriptSvc.getTest($stateParams.testId).then(function(resp){
            vm.test = resp.data;
            vm.test.name = resp.data.name;
            vm.gridOptions.data = resp.data.results;

        });
        vm.runTest = function(){
            testScriptSvc.runTest(vm.test).then(function(resp){
               vm.test.results.push(resp.data);
               vm.message = "Test run complete!"
            });
        };
        vm.deleteTest = function(){
            console.log("About to call testScriptSvc.deleteTest...");
            testScriptSvc.deleteTest(vm.test).then(function(resp){
                $location.path('/tests/' + resp.data.parentApp);
            });
        };


        vm.gridOptions = {};
        vm.gridOptions.columnDefs = [
            {
                field:'status',
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
                field:'created',
                displayName: 'Time',
                cellTemplate: "<div>{{row.entity.created | date:'medium'}}</div>",
                width: "20%",
                resizable: true
            }, {
                field:'output',
                displayName: 'Test Output',
                cellTemplate: "<div>{{row.entity.output | limitTo: 50}}</div>",
                width: "35%",
                resizable: true
            }, {
                field:'error',
                displayName: 'Test Error',
                cellTemplate: "<div>{{row.entity.error}}</div>",
                width: "35%",
                resizable: true
            }
        ];
        vm.gridOptions.onRegisterApi = function(gridApi){
            vm.gridApi = gridApi;
        };
    }
}());