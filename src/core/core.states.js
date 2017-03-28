(function(){
    "use strict";
    angular
        .module('core')
        .config(coreConfig);

    function coreConfig($stateProvider){
        $stateProvider
            .state('home', {
                url:'/',
                templateUrl: 'src/core/navigation/main.html',
                controller: 'manageUserCtrl as vm'
            })
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