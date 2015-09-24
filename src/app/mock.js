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
                title: 'Russia reopens Romanov case',
                author: 'Alec Luhn',
                dateCreated: '2015-09-23',
                articleUrl: 'http://www.theguardian.com/world/2015/sep/23/russia-tests-romanov-royal-family-remains',
                twitterCount: 1337,
                pinSize: 1,
                lat: 55.75,
                lng: 37.61
            },
            {
                title: 'Egypt pardons and releases jailed al-Jazeera journalists',
                author: 'Emma Graham-Harrison',
                dateCreated: '2015-09-23',
                articleUrl: 'http://www.theguardian.com/world/2015/sep/23/egypt-pardons-jailed-al-jazeera-journalists',
                twitterCount: 7220,
                pinSize: 7,
                lat: 30.05,
                lng: 31.23
            },
            {
                title: 'Scott Morrison: Australia has a spending problem, not a revenue problem',
                author: 'Katharine Murphy',
                dateCreated: '2015-09-23',
                articleUrl: 'http://www.theguardian.com/australia-news/2015/sep/23/scott-morrison-australia-has-a-spending-problem-not-a-revenue-problem',
                twitterCount: 3123,
                pinSize: 3,
                lat: -35.31,
                lng: 149.12
            },
            {
                title: 'Divided European leaders meet to devise plan to tackle refugee crisis',
                author: 'Ian Traynor',
                dateCreated: '2015-09-23',
                articleUrl: 'http://www.theguardian.com/world/2015/sep/23/divided-european-leaders-meet-to-devise-plan-to-tackle-refugee-crisis',
                twitterCount: 5210,
                pinSize: 5,
                lat: 50.85,
                lng: 4.35
            },
            {
                title: 'Divided European leaders meet to devise plan to tackle refugee crisis',
                author: 'Ian Traynor',
                dateCreated: '2015-09-23',
                articleUrl: 'http://www.theguardian.com/world/2015/sep/23/divided-european-leaders-meet-to-devise-plan-to-tackle-refugee-crisis',
                twitterCount: 5210,
                pinSize: 5,
                lat: 50.85,
                lng: 4.35
            },
            {
                title: 'First of 20,000 Syrian refugees arrive in UK',
                author: 'Nadia Khomami',
                dateCreated: '2015-09-23',
                articleUrl: 'http://www.theguardian.com/world/2015/sep/22/first-of-20000-syrian-refugees-arrive-in-uk',
                twitterCount: 8241,
                pinSize: 8,
                lat: 50.5,
                lng: 0.12
            },
            {
                title: 'Syria confirms receipt of Russian jets to target Isis',
                author: 'Ian Black',
                dateCreated: '2015-09-22',
                articleUrl: 'http://www.theguardian.com/world/2015/sep/22/syria-confirms-receipt-russian-jets-isis',
                twitterCount: 3241,
                pinSize: 3,
                lat: 33.5,
                lng: 36.30
            },
            {
                title: 'Pope Francis declares Junípero Serra a saint on surprisingly political visit to DC – live',
                author: 'Adam Brereton',
                dateCreated: '2015-09-23',
                articleUrl: 'http://www.theguardian.com/world/live/2015/sep/23/pope-francis-in-washington-dc-live-coverage',
                twitterCount: 5241,
                pinSize: 5,
                lat: 38.90,
                lng: -77.01
            },
            {
                title: 'Brazil threatens to withhold licence for Belo Monte dam over mitigation worries',
                author: 'Bruce Douglas',
                dateCreated: '2015-09-23',
                articleUrl: 'http://www.theguardian.com/world/2015/sep/23/brazil-belo-monte-dam-operating-licence-withheld',
                twitterCount: 1241,
                pinSize: 1,
                lat: 22.91,
                lng: -43.17
            },
            {
                title: 'North Korea\'s space race: Satellite launch imminent, official says',
                author: 'Will Ripley',
                dateCreated: '2015-09-23',
                articleUrl: 'http://www.cnn.com/2015/09/23/asia/north-korea-space-center-ripley-schwarz/index.html',
                twitterCount: 6213,
                pinSize: 6,
                lat: 39.02,
                lng: 125.74
            },
            {
                title: 'Chinese jet performs \'unsafe\' maneuver near U.S. plane, Pentagon says',
                author: 'Jamie Crawford',
                dateCreated: '2015-09-23',
                articleUrl: 'http://www.cnn.com/2015/09/22/politics/chinese-jet-maneuver-pentagon/index.html',
                twitterCount: 3245,
                pinSize: 3,
                lat: 37.00,
                lng: 121.00
            },
            {
                title: 'Indian man buried alive by road workers after falling into hole',
                author: 'Harmeet Shah Singh',
                dateCreated: '2015-09-22',
                articleUrl: 'http://www.cnn.com/2015/09/22/asia/india-man-buried-in-road/index.html',
                twitterCount: 2021,
                pinSize: 2,
                lat: 22.39,
                lng: 77.87
            },
            {
                title: 'Volkswagen CEO quits over grave crisis',
                author: 'Mark Thompson',
                dateCreated: '2015-09-23',
                articleUrl: 'http://money.cnn.com/2015/09/23/news/companies/volkswagen-emissions-crisis/index.html',
                twitterCount: 7035,
                pinSize: 7,
                lat: 52.52,
                lng: 13.38
            },
            {
                title: 'More hurdles for Iran nuclear deal',
                author: 'Sophie Tatum',
                dateCreated: '2015-06-24',
                articleUrl: 'http://www.cnn.com/2015/06/24/politics/more-hurdles-for-iran-nuclear-deal/index.html',
                twitterCount: 8321,
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

        $httpBackend.whenGET(/views\//).passThrough();
        $httpBackend.whenGET(/\.html/).passThrough();
    }]);

angular.bootstrap(document, ['nd.mock']);
