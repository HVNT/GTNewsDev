/**
 * Created with WebStorm.
 * User: hunt
 * Date: 6/16/15
 * Time: 1:13 PM
 * File:
 */
//Data

angular.module('nd.map')
    .controller('MapCtrl', function ($scope, $window, $log, MapStyles, Article, Marker, CenterMarker) {
        $scope.Article = Article;
        $scope.markers = [];
        $scope.$$markers = {};

        angular.extend($scope, MapStyles.defaultConfig); // init map

        $scope.goArticleSource = function (articleUrl) {
            if (articleUrl && articleUrl.length > 0) {
                $window.open(articleUrl,  '_blank');
            } else {
                $log.debug('Need source url to nav.');
            }
        };

        $scope.centerMap = function (article) {
            if (article) {
                var targetMarker = $scope.$$markers[article.id];
                $scope.centerMarker = angular.extend({}, {
                    lat: targetMarker.lat,
                    lng: targetMarker.lng,
                    zoom: 6
                });
//                CenterMarker.focus(targetMarker);
            } else {
                $log.debug('Need source url to nav.');
            }
        };


        $scope.query = function () {
            Article.query().then(function (response) {
                var markers = {};
                if (response && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var marker = new Marker(response[i]);
                        markers[i] = marker.getMarker();
                    }
                }
                
                $scope.$$markers = markers;
                $scope.markers = _.toArray(markers);
                $scope.queried = true;
            });
        };


        if (!$scope.queried) {
            $scope.query();
        }
    })
    .controller('MapListCtrl', function () {
    })
    .controller('MapListArticlesCtrl', function () {
    });
