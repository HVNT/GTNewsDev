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
    .service('MapFilters', function () {
        this.categoryFilters = {
            'science': {
                key: 'science',
                title: 'Science',
                toggled: true,
                toggle: function () {
//                    this.toggled = !this.toggled;
                }
            },
            'health': {
                key: 'health',
                title: 'Health',
                toggled: true,
                toggle: function () {
//                    this.toggled = !this.toggled;
                }
            },
            'economy': {
                key: 'economy',
                title: 'Economy',
                toggled: true,
                toggle: function () {
//                    this.toggled = !this.toggled;
                }
            },
            'world': {
                key: 'world',
                title: 'World',
                toggled: true,
                toggle: function () {
                    this.toggled = !this.toggled;
                }
            },
            'conflict': {
                key: 'conflict',
                title: 'Conflict',
                toggled: true,
                toggle: function () {
//                    this.toggled = !this.toggled;
                }
            }
        };
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
    })
    .service('MapEvents', function ($state) {
        var self = this;
        this.map = {};

        this.setMap = function (map) {
            if (map) {
                this.map = map;
                this.boundMapState();
                registerEvents(this.map);
            }
        };

        this.boundMapState = function (bounds) {
            if (this.map) {
                bounds = bounds || this.map.getBounds();

                var bbox = bounds._southWest.lat + ',' + bounds._southWest.lng +
                    ',' + bounds._northEast.lat + ',' + bounds._northEast.lng;

                $state.go('app.map.list', {in_bbox: bbox});
            }
        };

        function registerEvents(map) {
            if (map) {
                map.on('click', function () {
                    console.log('[click] event registered on map.');

                });

                /* zooming events */
                map.on('zoomstart', function () {
                    console.log('[zoomstart] event registered on map.');
                });

                map.on('zoomend', function (event) {
                    console.log('[zoomend] event registered on map.');
                    self.boundMapState();
                    //TIMEOUT BEFORE REQUEST
                });


                /* popup events */
                map.on('popupopen', function () {
                    console.log('[popupopen] event registered on map.');
                });

                map.on('popupclose', function () {
                    console.log('[popupclose] event registered on map.');
                });
            }
        }
    });