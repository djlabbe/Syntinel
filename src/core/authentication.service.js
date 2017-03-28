(function(){
    "use strict";
    angular
        .module('core')
        .factory('authenticationSvc', AuthenticationSvc);

    function AuthenticationSvc($window, $http){
        var svc = {
            saveToken: saveToken,
            getToken: getToken,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser,
            register: register,
            logIn: logIn,
            logOut: logOut
        };
        return svc;

        function saveToken(token){
            $window.sessionStorage['syntinel-token'] = token;
        }

        function getToken(){
            return $window.sessionStorage['syntinel-token'];
        }

        function isLoggedIn(){
            var token = svc.getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        }

        function currentUser(){
            if(svc.isLoggedIn()){
                var token = svc.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.username;
            }
        }

        function register(user){
            return $http
                .post('/register',user
                ).then(function (data) {
                    svc.saveToken(data.data.token);
                });
        }

        function logIn(user){
            return $http
                .post('/login',user
            ).then(function (data) {
                svc.saveToken(data.data.token);
            })
        }

        function logOut(){
            $window.sessionStorage.removeItem('syntinel-token');
        }
    }
}());