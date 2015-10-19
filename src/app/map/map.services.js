/**
 * Created with WebStorm.
 * User: hunt
 * Date: 6/16/15
 * Time: 1:13 PM
 * File:
 */
angular.module('nd.map')
    .service('CenterMarker', function ($log) {
        /* America centered by default */
        this.lat = 39.82;
        this.lng = -100;
        this.zoom = 2;

        this.get = function () {
            return {
                lat: this.lat,
                lng: this.lng,
                zoom: this.zoom
            };
        };

        this.setLat = function (lat) {
            if (lat) this.lat = lat;
        };

        this.setLng = function (lng) {
            if (lng) this.lng = lng;
        };

        this.setZoom = function (zoom) {
            if (zoom) this.zoom = zoom;
        };

        this.focus = function (marker) {
            if (marker) {
                this.lat = marker.lat;
                this.lng = marker.lng;
                this.zoom = 6;
            } else {
                $log.debug('Need marker');
            }
        }

    })
    .service('MapStyles', function (CenterMarker) {
        this.icons = {
            default: {
                iconUrl: 'assets/img/markers/leaflet-default-marker.png',
                shadowUrl: 'assets/img/markers/leaflet-default-marker-shadow.png'
            }
        };

        this.centerMarker = CenterMarker.get();

        this.defaultConfig = {
            centerMarker: this.centerMarker,
            defaults: {
                minZoom: 2,
                maxZoom: 9,
                zoomAnimation: true,
                scrollWheelZoom: true
            },
            events: {
                map: {
                    enable: ['click', 'drag', 'blur', 'touchstart'],
                    logic: 'broadcast'
                }
            }
        }
    });