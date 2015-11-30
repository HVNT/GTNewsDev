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
        this.lat = 30;
        this.lng = 50;
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
        this.noiseFilters = {
            low: {
                key: 'low',
                icon: 'fa-map-marker'
            },
            medium: {
                key: 'medium',
                icon: 'fa-map-marker fa-1.5x'
            },
            high: {
                key: 'high',
                icon: 'fa-map-marker fa-2x'
            }
        };

        this.dateFilters = {
            lastWeek: {
                key: 'lastWeek',
                title: 'Last Week',
                weight: 3
            },
            lastMonth: {
                key: 'lastMonth',
                title: 'Last Month',
                weight: 2
            },
            all: {
                key: 'all',
                title: 'All',
                weight: 1
            }
        };

        this.socialFilters = {
            'twitter': {
                key: 'twitter',
                title: 'Twitter',
                icon: 'fa-twitter',
                btn: 'nd-btn-twitter',
                weight: 2
            },
            'facebook': {
                key: 'facebook',
                title: 'Facebook',
                icon: 'fa-facebook',
                btn: 'nd-btn-facebook',
                weight: 1
            }
        };

        this.categoryFilters = {
            'world': {
                key: 'world',
                title: 'World',
                toggled: true,
                icon: 'fa-globe',
                btn: 'nd-btn-world',
//                backgroundUrl: function () {
//                    return this.toggled
//                        ? '/assets/img/checkbox/world_on.png'
//                        : '/assets/img/checkbox/world_off.png';
//                },
                toggle: function () {
                    this.toggled = !this.toggled;
                }
            },
            'science': {
                key: 'science',
                title: 'Science',
                toggled: true,
                icon: 'fa-flask',
                btn: 'nd-btn-science',
//                backgroundUrl: function () {
//                    return this.toggled
//                        ? '/assets/img/checkbox/science_on.png'
//                        : '/assets/img/checkbox/science_off.png';
//                },
                toggle: function () {
                    this.toggled = !this.toggled;
                }
            },
            'health': {
                key: 'health',
                title: 'Health',
                toggled: true,
                icon: 'fa-heartbeat',
                btn: 'nd-btn-health',
//                backgroundUrl: function () {
//                    return this.toggled
//                        ? '/assets/img/checkbox/health_on.png'
//                        : '/assets/img/checkbox/health_off.png';
//                },
                toggle: function () {
                    this.toggled = !this.toggled;
                }
            },
            'economy': {
                key: 'economy',
                title: 'Economy',
                toggled: true,
                icon: 'fa-money',
                btn: 'nd-btn-economy',
//                backgroundUrl: function () {
//                    return this.toggled
//                        ? '/assets/img/checkbox/economy_on.png'
//                        : '/assets/img/checkbox/economy_off.png';
//                },
                toggle: function () {
                    this.toggled = !this.toggled;
                }
            }
        };
    })
    .service('MapStyles', function (CenterMarker) {
        var MAX_SW = new L.LatLng(-80, -180);
        var MAX_NE = new L.LatLng(80, 180);
        var MAX_BOUNDS = new L.LatLngBounds(MAX_SW, MAX_NE);

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
                scrollWheelZoom: true,
                maxbounds: MAX_BOUNDS
            }
        }
    })
    .service('MapArchitect', function ($state, leafletData) {
        var self = this;
        this.map = {};

        this.register = function (map) {
            if (map) {
                this.map = map;
                this.boundMapState();
                registerEvents(this.map);
            }
        };

        function _boundMapState(bounds){
            if (self.map) {
                bounds = bounds || self.map.getBounds();

                var bbox = bounds._southWest.lat + ',' + bounds._southWest.lng +
                    ',' + bounds._northEast.lat + ',' + bounds._northEast.lng;

                $state.go('app.map.list', {in_bbox: bbox});
            }
        }
        var debounceBoundMapState = _.debounce(_boundMapState, 100);

        this.boundMapState = function (bounds) {
            debounceBoundMapState(bounds)
        };


        function registerEvents(map) {
            if (map) {
                map.on('click', function () {
                    console.log('[click] event registered on map.');

                });

                /* update bounding box on drag */
                map.on('dragend', function () {
                    console.log('[dragend] event registered on map');
                    self.boundMapState();
                });

                /* zooming events */
                map.on('zoomstart', function (event) {
                    console.log('[zoomstart] event registered on map.');
                });

                map.on('zoomend', function (event) {
                    console.log('[zoomend] event registered on map.');
                    self.boundMapState();
                });
            }
        }
    });