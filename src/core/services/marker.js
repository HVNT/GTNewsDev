/**
 * Created with WebStorm.
 * User: hunt
 * Date: 9/23/15
 * Time: 9:50 PM
 * File:
 */
angular.module('nd.services')
    .factory('Marker', function ($http, $q, Environment) {
        function Marker(data) {
            this.article = data.article || {};

        }

        Marker.markers = [];
        Marker.$$markers = {};

        return Marker;
    });
