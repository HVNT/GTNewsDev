/**
 * Created with WebStorm.
 * User: hunt
 * Date: 9/23/15
 * Time: 9:50 PM
 * File:
 */
angular.module('nd.services')
    .service('MarkerCategories', function () {
        this.colors = {
            'science': '#B9A8C6',  // purple
            'health': '#C36D74',   // red
            'economy': '#A7D2A3',  // green
            'world': '#87A5C8'     // blue
        };

        this.getColor = function (category) {
            var color = null; //TODO set to default
            if (category && this.colors[category]) {
                color = this.colors[category];
            }
            return color;
        }
    })
    .factory('Marker', function (MapStyles, MarkerCategories) {
        Marker.sizingBy = "twitter";
        Marker.maxSize = [55, 65]; // ratio of base marker image width:height = 1.0 : 1.17

        function Marker(data) {
            this.id = data.id || null;
            this.article = data || {};
            this.category = data.category || 'world'; //world = misc

            this.lat = data.lat || null;
            this.lng = data.lng || null;

            this.pinSize = data.pinSize || {};

            this.$$categoryColor = MarkerCategories.getColor(this.category);
            this.buildLeafletMarker();

            Marker.$$markers[this.id] = this;
            Marker.markers = _.toArray(Marker.$$markers);
        }

        Marker.getIconUrl = function (category) {
            if (category) {
                switch (category) {
                    case 'science':
                        return '/assets/img/markers/pin_purple.svg';
                    case 'health':
                        return '/assets/img/markers/pin_red.svg';
                    case 'economy':
                        return '/assets/img/markers/pin_green.svg';
                    case 'world':
                        return '/assets/img/markers/pin_blue.svg';
                }

                if (category === 'active') {
                    return '/assets/img/markers/pin_yellow.svg'
                }
            }
        };

        /**
         * pinSizeObject: { "twitter": x, "both": y, "facebook": z } ; x,y,z are numbers between 0 and 1 based on
         *                 the largest article returned (each key scaled separately)
         * sizeBy: which key to use
         */
        Marker.prototype.setIcon = function () {
            if (!_.isEmpty(this.pinSize)) {
                var iconSize = [];

                if (Marker.sizingBy) {
                    iconSize = [
                            this.pinSize[Marker.sizingBy] * Marker.maxSize[0],
                            this.pinSize[Marker.sizingBy] * Marker.maxSize[1]
                    ];
                } else {
                    iconSize = [0.4 * Marker.maxSize[0], 0.4 * Marker.maxSize[1]]
                }

                this.icon = {
                    iconUrl: Marker.getIconUrl(this.category),
                    iconSize: iconSize,
                    iconAnchor: [iconSize[0] / 2, iconSize[1] - 1],
                    popupAnchor: [0, -iconSize[1] / 2]
                };
            }
        };

        Marker.$$leafletMarkers = {};
        Marker.prototype.buildLeafletMarker = function () {
            var self = this;
            this.setIcon(this.pinSize);

            Marker.$$leafletMarkers[this.id] = {
                $$id: self.id,
                lat: this.lat,
                lng: this.lng,
                draggable: false,
                icon: this.icon
            };

            if (Marker.$$prevMarkerId === this.id) {
                Marker.setActiveLeafletMarker(this.id);
            }
        };

        Marker.setActiveLeafletMarker = function (markerId) {
            if (Marker.$$prevMarkerId && Marker.$$prevMarkerId !== markerId) { // reset previous to correct color
                var prevMarker = Marker.$$leafletMarkers[Marker.$$prevMarkerId],
                    prevModel = Marker.$$markers[Marker.$$prevMarkerId];
                if (prevMarker && prevMarker.icon && prevModel) {
                    prevMarker.icon.iconUrl = Marker.getIconUrl(prevModel.category);
                }
            }

            if (markerId && Marker.$$leafletMarkers[markerId]) {
                var marker = Marker.$$leafletMarkers[markerId];
                if (marker && marker.icon) {
                    marker.icon.iconUrl = Marker.getIconUrl('active');
                    Marker.$$prevMarkerId = markerId;
                }
            }
        };

        Marker.updateSizingBy = function (activeSizings) {
            Marker.sizingBy = _.keys(activeSizings).length == 2
                ? 'both'
                : _.keys(activeSizings)[0];

            angular.forEach(Marker.$$leafletMarkers, function (marker, key) {
                if (Marker.$$markers[key]) {
                    Marker.$$markers[key].buildLeafletMarker();
                }
            });
        };

        Marker.markers = [];
        Marker.$$markers = {};

        return Marker;
    });
