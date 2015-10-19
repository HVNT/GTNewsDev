/**
 * Created with WebStorm.
 * User: hunt
 * Date: 6/16/15
 * Time: 1:13 PM
 * File:
 */
//Data

angular.module('nd.map')
    .controller('MapCtrl', function ($scope, $timeout, $window, $log, MapStyles, Article, Marker, CenterMarker) {
        console.log(MapStyles.defaultConfig);
        angular.extend($scope, MapStyles.defaultConfig); // init map

        $scope.Article = Article;
        $scope.markers = [];
        $scope.$$markers = {};

        $scope.goArticleSource = function (articleUrl) {
            if (articleUrl && articleUrl.length > 0) {
                $window.open(articleUrl,  '_blank');
            } else {
                $log.debug('Need source url to nav.');
            }
        };

        $scope.centering = false;
        $scope.centerMap = function (article) {
            if (article && !$scope.centering) {
                $scope.centering = true;

                var targetMarker = $scope.$$markers[article.id];
                console.log(targetMarker);

                $scope.centerMarker =  {
                    lat: targetMarker.lat,
                    lng: targetMarker.lng,
                    zoom: 6
                };
//                CenterMarker.focus(targetMarker);

                $timeout(function () {
                    targetMarker.focus = true;
                    $scope.centering = false;
                }, 150);

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
                        markers[i + 1] = marker.getMarker(); //TODO update when API ready
                    }
                }

                $scope.$$markers = markers;
                $scope.markers = _.toArray(markers);
                $scope.queried = true;
                
                $log.debug(markers);
            });
        };


        if (!$scope.queried) {
            $scope.query();
        }
    })
    .controller('MapListCtrl', function ($scope, MapStyles) {
    })
    .controller('MapListArticlesCtrl', function () {
    });
