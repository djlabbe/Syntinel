(function(){
    "use strict";
    angular
        .module('testScripts')
        .component('tests',{
            templateUrl: 'src/test-scripts/tests.tmpl.html',
            controller: TestsController
        });

    /* @ngInject */
    function TestsController($stateParams, $location, testScriptSvc, $scope){
        console.log("Tests controller");
        var vm = this;
        vm.message = "";
        vm.errorMessage = "";
        vm.gridOptions = {enableFiltering: true};
        vm.gridOptions.columnDefs = [
            {
                field:'status',
                enableFiltering: false,
                displayName: 'Status',
                cellTemplate: "<div ng-if='row.entity.status == -1'>Not Run</div><div ng-if='row.entity.status == 1'>PASS</div><div ng-if='row.entity.status == 0'>FAIL</div>",
                cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                    if (grid.getCellValue(row ,col) === 1) {
                        return 'green-cell';
                    }
                    else if (grid.getCellValue(row ,col) === 0) {
                        return 'red-cell';
                    }
                    else if (grid.getCellValue(row ,col) === -1) {
                        return 'grey-cell';
                    }
                },
                width: "8%",
                resizable: true
            }, 
            {
                field: 'app',
                displayName: 'App',
                cellTemplate: '<div class="clickable" ng-click="grid.appScope.viewApp(row.entity)">{{row.entity.app}}</div>',
                cellClass: 'blue-cell',
                width: "20%",
                resizable: true
            }, {
                field: 'name',
                displayName: 'Name',
                cellTemplate: '<div class="clickable" ng-click="grid.appScope.viewTest(row.entity)">{{row.entity.name}}</div>',
                cellClass: 'blue-cell',
                width: "20%",
                resizable: true
            }, {
                field:'description',
                displayName: 'Description',
                width: "24%",
                resizable: true
            }, {    
                field:'created',
                enableFiltering: false,
                displayName: 'Created On',
                cellTemplate: "<div>{{row.entity.created | date:'medium'}}</div>",
                width: "15%",
                resizable: true
            }, {
                field: 'frequency',
                enableFiltering: false,
                displayName: 'Schedule',
                cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                    if (row.entity.isActive === true) {
                        return 'active-cell';
                    }
                    else if (row.entity.isActive === false) {
                        return 'inactive-cell';
                    }
                },
                width: "13%"
            }
        ];
        
        vm.gridOptions.onRegisterApi = function(gridApi){
            vm.gridApi = gridApi;
        };
       

        testScriptSvc.getAllTests().then(function(tests){
            vm.gridOptions.data = tests.data;
        });

        vm.addTest = function(){
            var url = '/addTest/'  
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
            var url = '/tests/' + row._id;
            $location.path(url);
        }

        $scope.viewApp = function(row){
            var url = '/apps/' + row.app;
            $location.path(url);
        }
    }
}());