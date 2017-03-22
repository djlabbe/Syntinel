(function(){
    "use strict";
    angular
        .module('applications')
        .component('addApplicationComp',{
            templateUrl: 'src/applications/add-application.tmpl.html',
            controller: addAppCtrl
        });
    function addAppCtrl(applicationSvc, $state){
        var vm = this;
        vm.app = {};

        vm.saveApp = function(){
            if(vm.app){
                applicationSvc.createApp(vm.app).then(function(){
                    $state.go("applications");
                });
            }
        }
    }
}());