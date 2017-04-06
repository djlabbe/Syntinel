(function(){
    "use strict";
    angular
        .module('applications')
        .component('app',{
            templateUrl:'src/applications/application.tmpl.html',
            controller: ApplicationController
        });

    /* @ngInject */
    function ApplicationController(applicationSvc, $stateParams, $location, testScriptSvc, $scope){
        //Viewing Tests and a single application use same controller, hide delete application button when viewing tests.  
        if ($location.url() === '/apps/') { $scope.isApplications = false; }
        else { $scope.isApplications = true; }
        
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
                cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                    if (row.entity.isActive === true) {
                        return 'active-cell';
                    }
                    else if (row.entity.isActive === false) {
                        return 'inactive-cell';
                    }
                },
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

        vm.deleteApplication = function(){

            if (vm.app)
            {
                //Delete tests
                (vm.app.tests).forEach(function (test) {
                    testScriptSvc.deleteTest(test);
                 });

                //Delete the application
                applicationSvc.deleteApp(vm.app, $stateParams.id);

                $(".modal-backdrop").hide();    //Hide bootstrap modal

                //After deleting application go back to Applications page
                var url = '/apps';
                $location.path(url);
            }
            else
            {
                console.log("error: no app");
            }
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
    }
}());