(function(){
    "use strict";

    angular
        .module('applications')
        .component('applicationsComp',{
            templateUrl: 'src/applications/applications.tmpl.html',
            controller: applicationsCtrl
        });

    /* @ngInject */
    function applicationsCtrl(applicationSvc, $location, $scope, $state){
        var vm = this;
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
            },{
                field:'name',
                displayName:'Name',
                cellTemplate: '<div class="clickable" ng-click="grid.appScope.test(row.entity)">{{row.entity.name}}</div>',
                cellClass: 'blue-cell',
                width: "17%",
                resizable: true
            },{
                field:'description',
                displayName: 'Description',
                width: "30%",
                resizable: true
            },{
                field:'created',
                enableFiltering: false,
                displayName: 'Created On',
                cellTemplate: "<div>{{row.entity.created | date:'medium'}}</div>",
                width: "20%",
                resizable: true
            },{
                field: 'owner',
                displayName: 'Created By',
                width: "15%",
                resizable: true
            },{
                field: 'tests',
                enableFiltering: false,
                displayName: 'Tests',
                cellTemplate: "<div>{{row.entity.tests.length}}</div>",
                width: "8%",
                resizable: true
            }
        ];

        applicationSvc.getAllApps().then(function(apps){
            vm.gridOptions.data = apps.data;
        });

        $scope.test = function(row){
            var url = '/tests/' + row._id;
            $location.path(url);
        };
    }
}());