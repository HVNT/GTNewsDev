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
            this.article = data || {};
            this.id = data.id || null; // namespacing?

            this.icon = {
                iconUrl: MapStyles.icons.default.iconUrl,
                shadowUrl: MapStyles.icons.default.shadowUrl
//                iconSize: [38, 95],
//                shadowSize: [50, 64],
//                iconAnchor: [22, 94],
//                shadowAnchor: [4, 62],
//                popupAnchor: [0, -95]
            };

            this.lat = data.lat || null;  //null?
            this.lng = data.lng || null;  //null?

            this.pinSize = data.pinSize || 0;

            this.setIconStyles(this.pinSize)
        }

        Marker.prototype.setIconStyles = function (pinSize) {
            if (pinSize) {
                switch (pinSize) {
                    case 1:
                        break;
                    case 2:
                        this.icon.shadowSize = Marker.iconSizes[pinSize];
                        this.icon.iconAnchor = Marker.shadowSizes[pinSize];
                        this.icon.shadowAnchor = Marker.iconAnchors[pinSize];
                        this.icon.popupAnchor = Marker.shadowAnchors[pinSize];
                        break;
//                ...
                    case 10:
                        break;
                    default:
                        break;

                }
            }
        };

        Marker.iconSizes = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        Marker.shadowSizes = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        Marker.iconAnchors = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        Marker.shadowAnchors = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];

        Marker.prototype.setSize = function (marker) {
            if (marker && !_.isEmpty(marker.icon)) {

            }
        };

        Marker.prototype.getMarker = function () {
            return {
                lat: this.lat,
                lng: this.lng,
                message: this.article.title,
                draggable: false,
                icon: this.icon
            }
        };

        Marker.markers = [];
        Marker.$$markers = {};

        return Marker;
    });
