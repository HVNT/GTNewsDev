/**
 * Created with WebStorm.
 * User: hunt
 * Date: 6/16/15
 * Time: 1:13 PM
 * File:
 */
angular.module('nd.map', ['nd.services'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .when('/app/map/', '/app/map');

        $stateProvider
            .state('app.map', {
                url: '/map',
                templateUrl: '/app/map/views/map.html',
                controller: 'MapCtrl',
                abstract: true
            })
            .state('app.map.list', { //list of articles
                url: '?in_bbox',
                templateUrl: '/app/map/views/map.list.html',
                controller: 'MapListCtrl'
            });
    });
