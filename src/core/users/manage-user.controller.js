(function(){
    "use strict";
    angular
        .module('core')
        .controller('manageUserCtrl', ManageUserCtrl);

    function ManageUserCtrl(authenticationSvc, $state, $rootScope){
        var vm = this;
        vm.user = {};

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
                $state.go('applications');
            });
        };
    }
}());