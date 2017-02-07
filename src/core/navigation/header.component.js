(function(){
    "use strict";
    angular
        .module('core')
        .component('headerComp',{
            templateUrl: 'src/core/navigation/header.tmpl.html',
            controller: headerCtrl
        });
    function headerCtrl(authenticationSvc, $state){
        var vm = this;

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
            sref: 'allTestScripts'
        }];

        vm.userLoggedIn = authenticationSvc.isLoggedIn();
        vm.userLogOut = function(){
            authenticationSvc.logOut().error(function(error){
                vm.error = error;
            }).then(function(){
                $state.go('userLogin');
            });
        }
    }
}());