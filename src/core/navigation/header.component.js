(function(){
    "use strict";
    angular
        .module('core')
        .component('headerComp',{
            templateUrl: 'src/core/navigation/header.tmpl.html',
            controller: headerCtrl
        });
    function headerCtrl(authenticationSvc, $state, $rootScope){
        var vm = this;
        vm.menuTree = [];
        vm.user = authenticationSvc.currentUser();
        getMenu();

        $rootScope.$on("userAuthentication", function(evt, args){
            vm.user = args.user;
            vm.userLoggedIn = true;
            getMenu();
        });
        vm.userLoggedIn = authenticationSvc.isLoggedIn();
        vm.userLogOut = function(){
            authenticationSvc.logOut();
            vm.userLoggedIn = false;
            getMenu();
            $state.go("userLogin");
        };

        function getMenu(){
            if(vm.userLoggedIn){
                vm.menuTree = [{
                    label: 'Add',
                    sref: false,
                    subMenu: [{
                        label: 'Application',
                        sref: 'addApplication'
                    }, {
                        label: 'Test',
                        sref: 'addTest'
                    }]
                },{
                    label: 'Applications',
                    sref: 'applications'
                },{
                    label: 'Scripts',
                    sref: 'tests'
                }];
            } else {
                vm.menuTree = [];
            }
        }
    }
}());