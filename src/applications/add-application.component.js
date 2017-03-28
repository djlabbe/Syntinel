(function(){
    "use strict";
    angular
        .module('applications')
        .component('addApp',{
            templateUrl: 'src/applications/add-application.tmpl.html',
            controller: addAppCtrl
        });

    /* @ngInject */
    function addAppCtrl(applicationSvc, $state){
        var vm = this;
        vm.app = {};

        vm.saveApp = function(){
            if(vm.app){
                applicationSvc.createApp(vm.app).then(function(){
                    $state.go("apps");
                });
            }
        }

        vm.resetForm = function(){
            vm.app.description = "";
            vm.app.name = "";
        }
    }
}());