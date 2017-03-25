(function() {
    angular
        .module('testScripts')
        .component('viewTestComp', {
            templateUrl: 'src/test-scripts/view-test-script.tmpl.html',
            controller: ViewScriptsCtrl
        });

    /* @ngInject */
    function ViewScriptsCtrl(applicationSvc, $stateParams, $location, testScriptSvc, $scope) {
        var vm = this;
        vm.test = {};
        vm.message = "";
        vm.errorMessage = "";

        testScriptSvc.getTest($stateParams.testId).then(function(resp){
            vm.test = resp.data;
            vm.test.name = resp.data.name;
            testScriptSvc.getResults($stateParams.testId).then(function(resp){
            vm.gridOptions.data = resp.data;
            });
        });

        vm.runTest = function(){
            testScriptSvc.runTest(vm.test).then(function(resp){
            vm.gridOptions.data.push(resp.data[0]);
               vm.message = "Test run complete!"
            });
        };
        vm.deleteTest = function(){
            testScriptSvc.deleteTest(vm.test).then(function(resp){
                $location.path('/apps/' + resp.data.app);
            });
        };

        vm.toggleActive = function() {
            testScriptSvc.toggleActive(vm.test).then(function(resp){
                vm.test = resp.data;
            });
        }

        vm.gridOptions = {};
        vm.gridOptions.columnDefs = [
            {
                field:'status',
                displayName: 'Status',
                cellTemplate: "<div class='clickable' ng-click='grid.appScope.results(row.entity)'><div ng-if='row.entity.status == true'>PASS</div><div ng-if='row.entity.status == false'>FAIL</div></div>",
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
                cellTemplate: "<div>{{row.entity.error | limitTo: 50}}</div>",
                width: "35%",
                resizable: true
            }
        ];

        vm.gridOptions.onRegisterApi = function(gridApi){
            vm.gridApi = gridApi;
        };



/***************************************************************************/
/******************* SERVER SENT EVENTS ************************************/
/***************************************************************************/

         // handles the callback from the received event
        var handleCallback = function (msg) {
            var newResult = JSON.parse(msg.data)[0];
            if (newResult.test_id == vm.test._id)
            {
                vm.gridOptions.data.push(newResult);   
            }
        }


        var source = new EventSource('/clientConnection');
        source.addEventListener('message', handleCallback, false);

    }
}());