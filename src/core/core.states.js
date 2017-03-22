(function(){
    "use strict";
    angular
        .module('core')
        .config(coreConfig);

    function coreConfig($stateProvider){
        $stateProvider
            .state('userLogin',{
                url:'/userLogin',
                templateUrl: 'src/core/users/user-login.tmpl.html',
                controller: 'manageUserCtrl as vm'
            })
            .state('userRegister',{
                url:'/userRegister',
                templateUrl: 'src/core/users/user-registration.tmpl.html',
                controller: 'manageUserCtrl as vm'
            });
    }
}());