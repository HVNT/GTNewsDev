/**
 * Created with WebStorm.
 * User: hunt
 * Date: 6/16/15
 * Time: 1:13 PM
 * File:
 */
//Data

angular.module('nd.map')
    .controller('MapCtrl', function ($scope) {
//      init map
        angular.extend($scope, {
            usa_center: {
                lat: 39.82,
                lng: -100,
                zoom: 4
            },
            events: {},
            layers: {
                baselayers: {
                    osm: {
                        name: 'GTNewsDev',
                        url: 'https://{s}.tiles.mapbox.com/v3/examples.map-i875mjb7/{z}/{x}/{y}.png',
                        type: 'xyz'
                    }
                }
            },
            defaults: {
                scrollWheelZoom: true
            }
        });

        $scope.markers = [];
        $scope.markers.push({
            lat: 42.34,
            lng: -75.18
        });

        $scope.$on("leafletDirectiveMap.click", function(event, args){
            var leafEvent = args.leafletEvent;

            $scope.markers.push({
                lat: leafEvent.latlng.lat,
                lng: leafEvent.latlng.lng,
                iconSize: [, 100]
            });
        });
    })
    .controller('MapListCtrl', function () {
    })
    .controller('MapListArticlesCtrl', function () {
    });
