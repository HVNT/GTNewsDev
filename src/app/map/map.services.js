/**
 * Created with WebStorm.
 * User: hunt
 * Date: 6/16/15
 * Time: 1:13 PM
 * File:
 */
angular.module('nd.map')
    .service('MapStyles', function () {
        this.icons = {
            default: {
                iconUrl: 'assets/img/markers/leaflet-default-marker.png',
                shadowUrl: 'assets/img/markers/leaflet-default-marker-shadow.png'
            }
        };

        this.defaultConfig = {
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
        }
    });