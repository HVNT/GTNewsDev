/**
 * Created with JetBrains WebStorm.
 * User: apledger
 * Date: 4/24/13
 * Time: 4:27 PM
 * File: /app/mock.js
 */

angular.module('nd.mock', ['nd.app', 'ngMockE2E'])
// Dummy Calls
    .run(['$httpBackend', '$timeout', '$log', function ($httpBackend, $timeout, $log) {
        function randomDate(start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }

        function selectRandom(array) {
            return array[parseInt((Math.random() * array.length), 10)];
        }

        function randomInt(low, high) {
            return parseInt(((Math.random() * (high - low)) + low), 10);
        }

        function randomFloat(low, high, round) {
            return ((Math.random() * (high - low)) + low).toFixed(round || 0);
        }


        $httpBackend.whenGET(/views\//).passThrough();
        $httpBackend.whenGET(/\.html/).passThrough();
    }]);

angular.bootstrap(document, ['nd.mock']);
