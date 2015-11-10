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
            'health': '#87A5C8',   // blue
            'economy': '#A7D2A3',  // green
            'conflict': '#C36D74', // red
            'world': '#F6E9A6'     // yellow
        }
    })
    .factory('Marker', function (MapStyles, MarkerCategories) {
        function Marker(data) {
            this.id = data.id || null; // namespacing?
            this.article = data || {};
            this.category = data.category || 'world'; //world = misc

            this.lat = data.lat || null;
            this.lng = data.lng || null;

            this.pinSize = data.pinSize || 1;
            var iconSizes = Marker.iconSizes[this.pinSize - 1];
            if (iconSizes) {
                this.icon = {
                    iconUrl: Marker.getIconUrl(this.category),
                    iconSize: iconSizes,
                    iconAnchor: [iconSizes[0] / 2, iconSizes[1] - 1],
                    popupAnchor: [0, -iconSizes[1] / 2]
                };
            }

            this.$$categoryColor = MarkerCategories.colors[this.category];
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
                    case 'conflict':
                        return '/assets/img/markers/pin_red.png';
                    case 'world':
                        return '/assets/img/markers/pin_yellow.png';
                }
            }
        };


        //reduce available pin sizes
        // 

        Marker.iconSizes = [[15,17], [17,19], [20,22], [23,26], [26,29], [32,35], [38,42], [45,50], [50,55], [55,61]];
        // Marker.shadowSizes = [[], [], [], [], [], [], [], [], []];
        // Marker.iconAnchors = [[], [], [], [], [], [], [], [], []];
        // Marker.shadowAnchors = [[], [], [], [], [], [], [], [], []];

        Marker.prototype.getMarker = function () {
            return {
                lat: this.lat,
                lng: this.lng,
                message: "<div class=\"marker-popover\">" +
                            "<div nd-t-font=\"h6\" class=\"marker-popover--lead\">" + this.article.headline + "</div>" +
                            "<div>" +
                            '<span nd-t-font="h6 small-caps">By </span>' + this.article.author +
                            '<!--<span nd-t-font="h6 small-caps link" nd-s-pull="right">Source</span>-->' +
                            "</div>" +
                        "</div>",
                draggable: false,
                icon: this.icon
            }
        };

        Marker.markers = [];
        Marker.$$markers = {};

        return Marker;
    });
