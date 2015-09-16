angular.module('nd.auth')
    .controller('AuthCtrl',
    function ($scope) {
        $scope.auth = {username: '', password: ''};
        $scope.createAccountToggled = false;
        $scope.createAccount = {username: '', password: ''};
    })
    .controller('AuthLoginCtrl',
    function ($scope, $state, AuthStates, Auth) {

        //TODO if we use auth
        $scope.login = function () {
            if (!_.isEmpty($scope.auth)) {
                if ($scope.auth.username.length > 0) {
                    Auth.login($scope.auth.username).then(function (response) {
                        $state.go('app.groups.list');
                    });
                }
            }
        };

        $scope.createNewUser = function () {
            if (!_.isEmpty($scope.createAccount)) {
                if ($scope.createAccount.username.length > 0) {

                }
            }
        };

        $scope.toggleCreateAccount = function () {
            $scope.createAccountToggled = !$scope.createAccountToggled;
        }
    });