(function(){
    "use strict";

    angular
        .module('applications')
        .component('applicationsComp',{
            templateUrl: 'src/applications/applications.tmpl.html',
            controller: applicationsCtrl
        });
    function applicationsCtrl(applicationSvc, $location, $scope){
        var vm = this;
        vm.gridOptions = {};

        vm.gridOptions.columnDefs = [
            {
                field:'name',
                displayName:'Name',
                cellTemplate: '<div ng-click="grid.appScope.test(row.entity)">{{row.entity.name}}</div>'
            },{
                field:'description',
                displayName: 'Description'
            },{
                field:'created',
                displayName: 'Created On'
            },{
                field: 'owner',
                displayName: 'Created By'
            },{
                field: 'tests',
                displayName: 'Tests'
            }
        ];

        applicationSvc.getAllApps().then(function(apps){
            vm.gridOptions.data = apps.data;
        });

        $scope.test = function(row){
            var url = '/tests/' + row._id;
            $location.path(url);
        }
    }
}());