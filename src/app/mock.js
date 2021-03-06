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

        var articles = [
            {
                id: 1,
                headline: 'Russia reopens Romanov case',
                authors: [{first: 'Alec', last: 'Thompson'}],
                category: 'world',
                dateCreated: '2015-09-23',
                url: 'http://www.theguardian.com/world/2015/sep/23/russia-tests-romanov-royal-family-remains',
                retweetCount: 1337,
                pinSize: 1,
                lat: 55.75,
                lng: 37.61
            },
            {
                id: 2,
                headline: 'Egypt pardons and releases jailed al-Jazeera journalists',
                authors: [{first: 'Emma', last: 'Thompson'}],
                category: 'world',
                dateCreated: '2015-09-23',
                url: 'http://www.theguardian.com/world/2015/sep/23/egypt-pardons-jailed-al-jazeera-journalists',
                retweetCount: 7220,
                pinSize: 7,
                lat: 30.05,
                lng: 31.23
            },
            {
                id: 3,
                headline: 'Scott Morrison: Australia has a spending problem, not a revenue problem',
                category: 'economy',
                authors: [{first: 'Katherien', last: 'Thompson'}],
                dateCreated: '2015-09-23',
                url: 'http://www.theguardian.com/australia-news/2015/sep/23/scott-morrison-australia-has-a-spending-problem-not-a-revenue-problem',
                retweetCount: 3123,
                pinSize: 3,
                lat: -35.31,
                lng: 149.12
            },
            {
                id: 4,
                headline: 'Divided European leaders meet to devise plan to tackle refugee crisis',
                authors: [{first: 'Ian', last: 'Thompson'}],
                category: 'world',
                dateCreated: '2015-09-23',
                url: 'http://www.theguardian.com/world/2015/sep/23/divided-european-leaders-meet-to-devise-plan-to-tackle-refugee-crisis',
                retweetCount: 5210,
                pinSize: 5,
                lat: 50.85,
                lng: 4.35
            },
            {
                id: 5,
                headline: 'First of 20,000 Syrian refugees arrive in UK',
                authors: [{first: 'Nadia', last: 'Thompson'}],
                category: 'world',
                dateCreated: '2015-09-23',
                url: 'http://www.theguardian.com/world/2015/sep/22/first-of-20000-syrian-refugees-arrive-in-uk',
                retweetCount: 8241,
                pinSize: 8,
                lat: 50.5,
                lng: 0.12
            },
            {
                id: 6,
                headline: 'Syria confirms receipt of Russian jets to target Isis',
                authors: [{first: 'Ian', last: 'Thompson'}],
                category: 'world',
                dateCreated: '2015-09-22',
                url: 'http://www.theguardian.com/world/2015/sep/22/syria-confirms-receipt-russian-jets-isis',
                retweetCount: 3241,
                pinSize: 3,
                lat: 33.5,
                lng: 36.30
            },
            {
                id: 7,
                headline: 'Pope Francis declares Junípero Serra a saint on surprisingly political visit to DC',
                authors: [{first: 'Adam', last: 'Thompson'}],
                category: 'world',
                dateCreated: '2015-09-23',
                url: 'http://www.theguardian.com/world/live/2015/sep/23/pope-francis-in-washington-dc-live-coverage',
                retweetCount: 5241,
                pinSize: 5,
                lat: 38.90,
                lng: -77.01
            },
            {
                id: 8,
                headline: 'Brazil threatens to withhold licence for Belo Monte dam over mitigation worries',
                authors: [{first: 'Bryce', last: 'Thompson'}],
                category: 'world',
                dateCreated: '2015-09-23',
                url: 'http://www.theguardian.com/world/2015/sep/23/brazil-belo-monte-dam-operating-licence-withheld',
                retweetCount: 1241,
                pinSize: 1,
                lat: 22.91,
                lng: -43.17
            },
            {
                id: 9,
                headline: 'North Korea\'s space race: Satellite launch imminent, official says',
                authors: [{first: 'Marketh', last: 'Thompson'}],
                category: 'science',
                dateCreated: '2015-09-23',
                url: 'http://www.cnn.com/2015/09/23/asia/north-korea-space-center-ripley-schwarz/index.html',
                retweetCount: 6213,
                pinSize: 6,
                lat: 39.02,
                lng: 125.74
            },
            {
                id: 10,
                headline: 'Chinese jet performs \'unsafe\' maneuver near U.S. plane, Pentagon says',
                authors: [{first: 'Jamie', last: 'Thompson'}],
                category: 'science',
                dateCreated: '2015-09-23',
                url: 'http://www.cnn.com/2015/09/22/politics/chinese-jet-maneuver-pentagon/index.html',
                retweetCount: 3245,
                pinSize: 3,
                lat: 37.00,
                lng: 121.00
            },
            {
                id: 11,
                headline: 'Indian man buried alive by road workers after falling into hole',
                authors: [{first: 'Harmeet', last: 'Thompson'}],
                category: 'world',
                dateCreated: '2015-09-22',
                url: 'http://www.cnn.com/2015/09/22/asia/india-man-buried-in-road/index.html',
                retweetCount: 2021,
                pinSize: 2,
                lat: 22.39,
                lng: 77.87
            },
            {
                id: 12,
                headline: 'Volkswagen CEO quits over grave crisis',
                authors: [{first: 'Mark', last: 'Thompson'}],
                category: 'economy',
                dateCreated: '2015-09-23',
                url: 'http://money.cnn.com/2015/09/23/news/companies/volkswagen-emissions-crisis/index.html',
                retweetCount: 7035,
                pinSize: 7,
                lat: 52.52,
                lng: 13.38
            },
            {
                id: 13,
                headline: 'More hurdles for Iran nuclear deal',
                authors: [{first: 'Sophie', last: 'Thompson'}],
                category: 'world',
                dateCreated: '2015-06-24',
                url: 'http://www.cnn.com/2015/06/24/politics/more-hurdles-for-iran-nuclear-deal/index.html',
                retweetCount: 8321,
                pinSize: 8,
                lat: 35.70,
                lng: 51.42
            }
        ];

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


        $httpBackend.whenGET('/articles/all').respond(
            function (method, url, data, headers) {
                return [200, articles, {}];
            });

        $httpBackend.whenGET(/views\//).passThrough();
        $httpBackend.whenGET(/\.html/).passThrough();
    }]);

angular.bootstrap(document, ['nd.mock']);
