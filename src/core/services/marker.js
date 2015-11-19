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
        function Marker(data) {
            this.id = data.id || null; // namespacing?
            this.article = data || {};
            this.category = data.category || 'world'; //world = misc

            this.lat = data.lat || null;
            this.lng = data.lng || null;

            var sizeBy = "twitter"; // TODO set up a switch in the interface for "twitter", "facebook",  and "both"
            this.setMarkerSize(data.pinSize, sizeBy);


            this.$$categoryColor = MarkerCategories.getColor(this.category);
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
            }
        };

        Marker.maxSize = [55, 65]; // ratio of base marker image width:height = 1.0 : 1.17
        // Marker.iconSizes = [
        //     [15, 17],
        //     [17, 19],
        //     [20, 22],
        //     [23, 26],
        //     [26, 29],
        //     [32, 35],
        //     [38, 42],
        //     [45, 50],
        //     [50, 55],
        //     [55, 61]
        // ];

        /**
        *
        *
        * pinSizeObject: { "twitter": x, "both": y, "facebook": z } ; x,y,z are numbers between 0 and 1 based on
        *                 the largest article returned (each key scaled separately)
        * sizeBy: which key to use
        */
        Marker.prototype.setMarkerSize = function (pinSizeObject, sizeBy) {
            this.pinSize = pinSizeObject || null;
            // add null check?
            var iconSize = [this.pinSize[sizeBy] * Marker.maxSize[0], this.pinSize[sizeBy] * Marker.maxSize[1]];
            if (this.pinSize) {
                this.icon = {
                    iconUrl: Marker.getIconUrl(this.category),
                    iconSize: iconSize,
                    iconAnchor: [iconSize[0] / 2, iconSize[1] - 1],
                    popupAnchor: [0, -iconSize[1] / 2]
                };
            }
        }

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
