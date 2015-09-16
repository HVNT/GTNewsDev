angular.module('nd.app')
    .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);

        $urlRouterProvider
            .when('', '/app/map')
            .when('/', '/app/map')
            .when('/app', '/app/map')
            .when('/app/', '/app/map')
            .otherwise('/app/map');

        $stateProvider
            .state('app', {
                url: '/app',
                templateUrl: '/app/app.html',
                controller: 'AppCtrl as app',
                resolve: {}
            });
    })
    .run(function ($rootScope, $log) {

        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                $log.warn("$stateChangeError", error);
            });
    });