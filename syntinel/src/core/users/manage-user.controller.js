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
                $state.go('applications');
                $rootScope.$broadcast("userAuthentication", {
                    userLogin: true
                });
            });
        };
        vm.userLogin = function(){
            authenticationSvc.logIn(vm.user).then(function(){
                $rootScope.$broadcast("userAuthentication", {
                    userLogin: true
                });
                vm.errors = "";
                $state.go('applications');
            })
            .catch(function(data) {
                $state.go('userLogin');
                vm.errors = "Invalid credentials, please try again."
                console.log(vm.errors);
            });
        };
    }
}());