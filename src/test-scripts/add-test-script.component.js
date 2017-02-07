(function(){
    "use strict";
    angular
        .module('testScripts')
        .component('addTestComp',{
            templateUrl: 'src/test-scripts/add-test-script.tmpl.html',
            controller: addTestCtrl
        });

    function addTestCtrl($stateParams, applicationSvc, testScriptSvc, $location){
        var vm = this;
        vm.test = {};
        if($stateParams.appId){
            applicationSvc.getApp($stateParams.appId).then(function(app){
                vm.app = app.data;
                vm.test.name = app.data.name;
            });
        }
        vm.saveTest = function(){
            if(vm.app && vm.test && vm.test.file){
                testScriptSvc.createTest(vm.app, vm.test.file).then(function(){
                    var url = '/addTest/' + vm.app._id;
                    $location.path(url);
                });
            }
        }
    }
}());