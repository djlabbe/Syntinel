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
        vm.applications = [];
        vm.app = {};

        
        if($stateParams.appId){
            applicationSvc.getApp($stateParams.appId).then(function(app){
                vm.applications.push(app.data);
                vm.app = app.data;
            });
        } else {
            applicationSvc.getAllApps().then(function(apps){
               vm.applications = apps.data;
               vm.app = vm.applications[0];
            });
        }

         /* Take the data from the form, use it to create a new test.
                The response contains the new test object which we can use
                to run the test on submission. Once that is done, we redirect
                back to app page */
        vm.saveTest = function(){
            if(vm.app && vm.test && vm.test.file && vm.test.description){
                testScriptSvc.createTest(vm.app, vm.test).then(function(resp){
                    testScriptSvc.runTest(resp).then(function(resp) {
                        var url = '/tests/' + vm.app._id;
                        $location.path(url);
                    });
                });
            }
        }

        vm.resetForm = function(){
             vm.test.file = null;
             vm.test.description = "";
             vm.test.name = "";
        }
    }
}());