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
            san_fran: {
                lat: 37.78,
                lng: -122.42,
                zoom: 13
            },
            events: {},
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
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
        $scope.$on("leafletDirectiveMap.click", function(event, args){
            var leafEvent = args.leafletEvent;
            $scope.markers.push({
                lat: leafEvent.latlng.lat,
                lng: leafEvent.latlng.lng,
                draggable: true
            });
        });
    })
    .controller('MapListCtrl', function () {
    })
    .controller('MapListArticlesCtrl', function () {
    });
