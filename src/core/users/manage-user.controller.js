(function(){
    "use strict";
    angular
        .module('core')
        .controller('manageUserCtrl', ManageUserCtrl);

    function ManageUserCtrl(authenticationSvc, $state){
        var vm = this;
        vm.user = {};

        vm.userRegister = function(){
            authenticationSvc.register(vm.user).error(function(error){
                vm.error = error;
            }).then(function(){
                $state.go('applications');
            });
        };

        vm.userLogin = function(){
            authenticationSvc.logIn(vm.user).error(function(error){
                vm.error = error;
            }).then(function(){
                $state.go('applications');
            });
        };
    }
}());