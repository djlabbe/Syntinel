(function(){
    "use strict";
    angular
        .module('core')
        .controller('manageUserCtrl', ManageUserCtrl);

    function ManageUserCtrl(authenticationSvc, $state, $rootScope){
        var vm = this;
        vm.user = {};
        vm.errors = "";

        vm.userRegistration = function(){
            authenticationSvc.register(vm.user).then(function(){
                $rootScope.$broadcast("userAuthentication", {
                    userLogin: true
                });
                vm.errors = "";
                $state.go('apps');
            })
            .catch(function(data) {
                $state.go('userRegister');
                vm.errors = "That username is taken, please try again."
            });
        };
        vm.userLogin = function(){
            authenticationSvc.logIn(vm.user).then(function(){
                $rootScope.$broadcast("userAuthentication", {
                    userLogin: true
                });
                vm.errors = "";
                $state.go('apps');
            })
            .catch(function(data) {
                $state.go('userLogin');
                vm.errors = "Invalid credentials, please try again."
            });
        };
    }
}());