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
                /* Some default values */
                iconUrl: "/assets/img/markers/pin_red_alt.png",
                iconSize: [10, 12],
                iconAnchor: [5, 12],
                popupAnchor: [0, -6]
            };

            this.lat = data.lat || null;  //null?
            this.lng = data.lng || null;  //null?

            this.pinSize = data.pinSize || 0;


            /* Set appropriate icon size, anchor, and popup anchor point */
            this.icon.iconSize = Marker.iconSizes[this.pinSize-1];
            this.icon.iconAnchor = [this.icon.iconSize[0]/2, this.icon.iconSize[1]-1];
            this.icon.popupAnchor = [0, -this.icon.iconSize[1]/2];

            /**
             * Switch for choosing color of icon.
             * Current is temporary set up and conditions
             * until we have articles categorized.
             */
            switch(this.pinSize) {  // change condition to category instead of size
                case 1:
                    this.icon.iconUrl = "/assets/img/markers/pin_purple_alt.png";
                    break;
                case 2:
                    this.icon.iconUrl = "/assets/img/markers/pin_orange_alt.png";
                    break;
                case 3:
                    this.icon.iconUrl = "/assets/img/markers/pin_grey_alt.png";
                    break;
                case 4:
                    this.icon.iconUrl = "/assets/img/markers/pin_yellow_alt.png";
                    break;
                case 5:
                    this.icon.iconUrl = "/assets/img/markers/pin_green_alt.png";
                    break;
                case 6:
                    this.icon.iconUrl = "/assets/img/markers/pin_yellow_alt.png";
                    break;
                case 7:
                    this.icon.iconUrl = "/assets/img/markers/pin_blue_alt.png";
                    break;
                case 8:
                    this.icon.iconUrl = "/assets/img/markers/pin_red_alt.png";
                    break;
                case 9:
                    this.icon.iconUrl = "/assets/img/markers/pin_red_alt.png";
                    break;
            }

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
                message: this.article.title,
                draggable: false,
                icon: this.icon
            }
        };

        Marker.markers = [];
        Marker.$$markers = {};

        return Marker;
    });
