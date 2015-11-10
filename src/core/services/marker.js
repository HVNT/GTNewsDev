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
            'health': '#C36D74',   // blue
            'economy': '#A7D2A3',  // green
            'world': '#87A5C8'     // yellow
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
                    case 'world':
                        return '/assets/img/markers/pin_yellow.png';
                }
            }
        };


        Marker.iconSizes = [[15,17], // 1  smaller
                            [17,19], // 2
                            [20,22], // 3
                            [23,26], // 4
                            [26,29], // 5
                            [32,35], // 6
                            [38,42], // 7
                            [45,50], // 8
                            [50,55], // 9
                            [55,61]];// 10 larger

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

        Marker.prototype.setSize = function (zoom) {switch (zoom) {
                case 2:
                    this.icon.iconSize = Marker.iconSizes[Math.round(this.pinSize*(6/10))];
                case 3:
                    this.icon.iconSize = Marker.iconSizes[Math.round(this.pinSize*(7/10))];
                case 4:
                    this.icon.iconSize = Marker.iconSizes[Math.round(this.pinSize*(8/10))];
                case 5:
                    this.icon.iconSize = Marker.iconSizes[Math.round(this.pinSize*(8/10))];
                case 6:
                    this.icon.iconSize = Marker.iconSizes[Math.round(this.pinSize*(9/10))];
                case 7:
                    this.icon.iconSize = Marker.iconSizes[Math.round(this.pinSize*(9/10))];
                case 8:
                    this.icon.iconSize = Marker.iconSizes[Math.round(this.pinSize*(10/10))];
                case 9:
                    this.icon.iconSize = Marker.iconSizes[Math.round(this.pinSize*(10/10))];
            }
        };

        Marker.markers = [];
        Marker.$$markers = {};

        return Marker;
    });
