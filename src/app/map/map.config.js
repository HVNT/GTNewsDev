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
                url: '?lat?lng',
                templateUrl: '/app/map/views/map.list.html',
                controller: 'MapListCtrl',
                resolve: {
                    ActiveMap: function ($stateParams) {
                        console.log($stateParams);
                    }
                }
            });
//            .state('app.map.list.', { //articles details view (so user can refresh page and still keep article active)
//                url: '/:articleId',
//                templateUrl: '/app/map/views/map.list.articles.html',
//                controller: 'MapListArticlesCtrl'
//            });
    });
