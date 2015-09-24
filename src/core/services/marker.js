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
                shadowUrl: MapStyles.icons.default.shadowUrl,
//                iconSize: [38, 95],
//                shadowSize: [50, 64],
//                iconAnchor: [22, 94],
//                shadowAnchor: [4, 62]
                popupAnchor: [0, 0]
            };

            this.lat = data.lat || null;  //null?
            this.lng = -data.lng || null;  //null?

            this.pinSize = data.pinSize || 0;
        }

        // takes in size 1-10
        Marker.prototype.setSize = function (uSize) {

        };

        Marker.prototype.getMarker = function () {
            return {
                lat: this.lat,
                lng: -this.lng,
                message: this.article.title,
                draggable: false,
                icon: this.icon
            }
        };

        Marker.markers = [];
        Marker.$$markers = {};

        return Marker;
    });
