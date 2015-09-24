/**
 * Created with WebStorm.
 * User: hunt
 * Date: 6/16/15
 * Time: 1:13 PM
 * File:
 */
//Data

angular.module('nd.map')
    .controller('MapCtrl', function ($scope, MapStyles, Article) {
        $scope.markers = [];
        angular.extend($scope, MapStyles.defaultConfig); // init map



//        $scope.$on("leafletDirectiveMap.click", function(event, args){
//            var leafEvent = args.leafletEvent;
//
//            $scope.markers.push({
//                lat: leafEvent.latlng.lat,
//                lng: leafEvent.latlng.lng,
//                iconSize: [, 100]
//            });
//        });

        $scope.query = function () {

            Article.query().then(function (response) {
                debugger;
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
