angular.module('nd.app')
    .controller('AppCtrl', function ($scope, $state) {
        $scope.appName = "GTNewsDev";

        $scope.logout = function () {
            //TODO Auth.logout()
            $state.go('auth.login');
        };
    });
