/**
 * Created with WebStorm.
 * User: hunt
 * Date: 9/23/15
 * Time: 9:50 PM
 * File:
 */
angular.module('nd.services')
    .factory('Marker', function (MapStyles) {
        function Marker(data) {
            this.id = data.id || null; // namespacing?
            this.article = data || {};
            this.category = data.category || 'world'; //world = misc

            this.lat = data.lat || null;
            this.lng = data.lng || null;

            this.pinSize = data.pinSize || 0;
            var iconSizes = Marker.iconSizes[this.pinSize - 1];
            this.icon = {
                iconUrl: Marker.getIconUrl(this.category),
                iconSize: iconSizes,
                iconAnchor: [iconSizes[0] / 2, iconSizes[1] - 1],
                popupAnchor: [0, -iconSizes[1] / 2]
            };
        }

        Marker.getIconUrl = function (category) {
            if (category) {
                switch (category) {
                    case 'science':
                        return '/assets/img/markers/pin_purple.png';
                    case 'health':
                        return '/assets/img/markers/pin_blue.png';
                    case 'economy':
                        return '/assets/img/markers/pin_green.png';
                    case 'world':
                        return '/assets/img/markers/pin_grey.png';
                    case 'conflict':
                        return '/assets/img/markers/pin_red.png';
                        return;
                }
            }
        };

        Marker.iconSizes = [[15,17], [17,19], [20,22], [23,26], [26,29], [32,35], [38,42], [45,50], [50,55]];
        // Marker.shadowSizes = [[], [], [], [], [], [], [], [], []];
        // Marker.iconAnchors = [[], [], [], [], [], [], [], [], []];
        // Marker.shadowAnchors = [[], [], [], [], [], [], [], [], []];

        Marker.prototype.setSize = function (marker) {
            if (marker && !_.isEmpty(marker.icon)) {

            }
        };

        Marker.prototype.getMarker = function () {
            return {
                lat: this.lat,
                lng: this.lng,
                message: "<div class=\"marker-popover\">" +
                            "<div nd-t-font=\"h6\" class=\"marker-popover--lead\">" + this.article.title + "</div>" +
                            '<span nd-t-font="h6 small-caps">By </span>' + this.article.author + "</div>",
                draggable: false,
                icon: this.icon
            }
        };

        Marker.markers = [];
        Marker.$$markers = {};

        return Marker;
    });
