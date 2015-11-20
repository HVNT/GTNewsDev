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
            this.id = data.id || null; // namespacing?
            this.article = data || {};
            this.category = data.category || 'world'; //world = misc

            this.lat = data.lat || null;
            this.lng = data.lng || null;

            this.pinSize = data.pinSize || {};
            this.setMarkerSize(this.pinSize);

            this.$$categoryColor = MarkerCategories.getColor(this.category);

            this._buildLeafletMarker();

            Marker.$$markers[this.id] = this;
            Marker.markers = _.toArray(Marker.$$markers);
        }

        Marker.getIconUrl = function (category) {
            if (category) {
                switch (category) {
                    case 'science':
                        return '/assets/img/markers/pin_purple.png';
                    case 'health':
                        return '/assets/img/markers/pin_red.png';
                    case 'economy':
                        return '/assets/img/markers/pin_green.png';
                    case 'world':
                        return '/assets/img/markers/pin_blue.png';
                }

                if (category === 'active') {
                    return '/assets/img/markers/pin_yellow.png'
                }
            }
        };

        /**
         * pinSizeObject: { "twitter": x, "both": y, "facebook": z } ; x,y,z are numbers between 0 and 1 based on
         *                 the largest article returned (each key scaled separately)
         * sizeBy: which key to use
         */
        Marker.prototype.setMarkerSize = function (pinSizeObject) {
            if (!_.isEmpty(this.pinSize) && this.pinSize[Marker.sizingBy]) {
                var iconSize = [
                        this.pinSize[Marker.sizingBy] * Marker.maxSize[0],
                        this.pinSize[Marker.sizingBy] * Marker.maxSize[1]
                ];

                this.icon = {
                    iconUrl: Marker.getIconUrl(this.category),
                    iconSize: iconSize,
                    iconAnchor: [iconSize[0] / 2, iconSize[1] - 1],
                    popupAnchor: [0, -iconSize[1] / 2]
                };
            }
        };

        Marker.prototype.updateIconUrl = function (isActive) {
            if (isActive && this.icon) {
                this.icon.iconUrl = Marker.getIconUrl('active');
            }
            return this.icon;
        };

        Marker.$$leafletMarkers = {};
        Marker.prototype._buildLeafletMarker = function () {
            Marker.$$leafletMarkers[this.id] = {
                lat: this.lat,
                lng: this.lng,
                draggable: false,
                icon: this.icon
            }
        };

        Marker.setActiveLeafletMarker = function (markerId) {
            if (Marker.$$prevMarkerId) {
                var _markerId = Marker.$$prevMarkerId,
                    marker = Marker.$$markers[_markerId];
                if (marker) {
                    Marker.$$leafletMarkers[_markerId].icon.iconUrl = Marker.getIconUrl(marker.category);
                }
            }

            if (markerId && Marker.$$leafletMarkers[markerId]) {
                var leafletMarker = Marker.$$leafletMarkers[markerId];
                if (leafletMarker && leafletMarker.icon) {
                    leafletMarker.icon.iconUrl = Marker.getIconUrl('active');
                }
                Marker.$$prevMarkerId = markerId;
            }
        };

        Marker.markers = [];
        Marker.$$markers = {};

        return Marker;
    });
