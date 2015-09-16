/**
 * Created with WebStorm.
 * User: hunt
 * Date: 9/16/15
 * Time: 2:44 PM
 * File:
 */
angular.module('nd.auth', ['nd.services'])
    .config(function ($stateProvider, $httpProvider) {

        $httpProvider.defaults.useXDomain = true;
        //TODO remove this shit
//        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.unshift(['$q', '$rootScope', '$location', function ($q, $rootScope, $location) {

            return {
                request: function (response) {
                    return response;
                },
                responseError: function (response) {
                    var status = response.status;
                    switch (status) {
                        case 401:
                            var defer = $q.defer(),
                                req = {
                                    config: response.config,
                                    deferred: defer
                                };

                            $rootScope.requests401.push(req);
                            $rootScope.$broadcast('auth.loginRequired');
                            return defer.promise;
                        case 201:
                            $rootScope.$broadcast('auth.loginRequired');
                            break;
                        case 409:
                            $rootScope.$broadcast('auth.concurrentConflict');
                            break;
                        default:
                    }

                    return $q.reject(response);
                }
            };
        }]);

        $stateProvider
            .state('auth', {
                url: '',
                templateUrl: '/core/auth/views/auth.html',
                controller: 'AuthCtrl',
                abstract: true
            })
            .state('auth.login', {
                url: '/login',
                templateUrl: '/core/auth/views/auth.login.html',
                controller: 'AuthLoginCtrl'
            })
            .state('auth.logout', {
                url: '/logout',
                resolve: {
                    Logout: function (Auth) {
                        return Auth.logout();
                    }
                }
            })
    })
    .run(function ($rootScope, $location, $http, Auth, $state, AuthStates) {
        /**
         * Holds all the requests which failed due to 401 response.
         */
        $rootScope.requests401 = [];
        $http.defaults.useXDomain = true;

        /**
         * On 'event:loginConfirmed', resend all the 401 requests.
         */
        $rootScope.$on('auth.resendRequests', function () {
            function retry (req) {
                $http(req.config).then(function (response) {
                    req.deferred.resolve(response);
                });
            }

            var i, requests = $rootScope.requests401;
            for (i = 0; i < requests.length; i++) {
                retry(requests[i]);
            }
            $rootScope.requests401 = [];
        });

        $rootScope.$on('auth.forbidden', function () {
            $state.go(AuthStates.logout);
        });

        /**
         * On 'event:loginRequest' send credentials to the server.
         */
        $rootScope.$on('auth.loginRequest', function (event, creds) {
            Environment.auth.login(creds, function (response) {
                $rootScope.$broadcast('auth.loginConfirmed');
                $location.path('/');
            }, function (response) {
                $rootScope.$broadcast('auth.loginRequired');
            });
        });

        $rootScope.$on('auth.loginRequired', function () {
            $state.go(AuthStates.login);
        });
        /**
         * On 'logoutRequest' invoke logout on the server and broadcast 'event:loginRequired'.
         */
        $rootScope.$on('auth.logoutRequest', function () {
            Auth.logout();
        });
    });