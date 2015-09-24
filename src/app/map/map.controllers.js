/**
 * Created with WebStorm.
 * User: hunt
 * Date: 6/16/15
 * Time: 1:13 PM
 * File:
 */
//Data

angular.module('nd.map')
    .controller('MapCtrl', function ($scope, $log, MapStyles, Article, Marker) {
        $scope.markers = [];
        angular.extend($scope, MapStyles.defaultConfig); // init map


        $scope.query = function () {
            Article.query().then(function (response) {
                var markers = [];
                if (response && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var marker = new Marker(response[i]);
                        markers.push(marker.getMarker());
                    }
                }
                
                $log.debug(markers);
                $scope.markers = markers;
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
