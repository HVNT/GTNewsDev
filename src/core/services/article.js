/**
 * Created with WebStorm.
 * User: hunt
 * Date: 9/16/15
 * Time: 2:44 PM
 * File:
 */
angular.module('nd.services')
    .factory('Article', function ($http, $q, $log, Environment, MapFilters) {
        Article.TWTTR_FLOOR = 500;
        Article.FB_FLOOR = 300;
        Article.$$fetching = false;

        Article.maxRetweetCount = 0;
        Article.articles = [];
        Article.$$articles = {};

        function Article(data) {
            this.id = data.pk || null;

            this.headline = data.headline || '';
            this.subtitle = data.subtitle || '';
            this.abstract = data.abstract || '';
            this.category = data.category || 'world'; //world = misc

            this.authors = data.authors || [];
            if (this.authors.length > 0) {
                this.author = this.authors[0].first + ' ' +
                    this.authors[0].last.charAt(0) +
                    this.authors[0].last.slice(1).toLowerCase();
            }

            this.url = data.url || '';
            this.dateCreated = data.date || null;

            Article.maxRetweetCount = data.retweetcount > Article.maxRetweetCount
                ? data.retweetcount
                : Article.maxRetweetCount;

            Article.maxShareCount = data.sharecount > Article.maxShareCount
                ? data.sharecount
                : Article.maxShareCount;

            this.retweetCount = data.retweetcount || 0;
            this.shareCount = data.sharecount;
            this.pinSize = data.pinsize || {};

            if (!_.isEmpty(data.coords)) {
                if (data.coords.coordinates && data.coords.coordinates.length == 2) {
                    var coordinates = data.coords.coordinates;
                    this.lat = coordinates[0];
                    this.lng = coordinates[1];
                }
            } else {
                this.lat = null;
                this.lng = null;
            }
        }

        Article.query = function () {
            var defer = $q.defer(),
                path = Environment.path + '/articles/all',
                config = _.extend({}, Environment.config);

            $http.get(path, config).then(
                function (response) {
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            var newArticle = new Article(response.data[i]);
                            Article.$$articles[newArticle.id] = newArticle;
                            Article.articles.push(Article.$$articles[newArticle.id]);
                        }
                    }
                    defer.resolve(Article.articles);
                },
                function (response) {
                    defer.reject(response);
                }
            );
            return defer.promise;
        };

        function getDateJSON(dateKey) {
            if (dateKey) {
                var d = new Date();
                switch(dateKey) {
                    case 'lastWeek':
                        d.setDate(d.getDate() - 7);
                        d = new Date(d);
                        return d.toJSON();
                    case 'lastMonth':
                        d.setMonth(d.getMonth() - 1);
                        d = new Date(d);
                        return d.toJSON();
                    case 'all':
                        d.setDate(0);
                        return d.toJSON();
                }
            } else {
                $log.debug('No date key provided');
            }
        }

        Article.queryBBox = function (bboxParam) {
            if (!MapFilters) throw new Error('no MapFilters, cannot request');

            var defer = $q.defer();
            var _dateStart = getDateJSON(MapFilters.activeDateFilter.key),
                _noiseFloor = MapFilters.activeNoiseFilter.floor;

            if (bboxParam && _dateStart) {
                var path = Environment.path + '/pins/?in_bbox=' + bboxParam +
                        '&start_date=' + _dateStart +
                        '&min_sharecount=' + _noiseFloor +
                        '&format=json',
                    config = _.extend({}, Environment.config);

                Article.$$fetching = true;
                $http.get(path, config).then(
                    function (response) {
                        Article.resetArticles(); //reset articles
                        if (response.data.length > 0) {
                            for (var i = 0; i < response.data.length; i++) {
                                if (response.data[i]) {
                                    var newArticle = new Article(response.data[i]);
                                    Article.$$articles[newArticle.id] = newArticle;
                                    Article.articles.push(Article.$$articles[newArticle.id]);
                                }
                            }
                        }
                        Article.$$fetching = false;
                        defer.resolve(Article.articles);
                    },
                    function (response) {
                        Article.$$fetching = false;
                        defer.reject(response);
                    }
                );
            } else {
                Article.$$fetching = false;
                defer.reject('Need bounding box to [queryBBox]');
            }

            return defer.promise;
        };

        // TODO: wiki documentation suggests that its a param but url structure disagrees
        Article.get = function (articleId) {
            var defer = $q.defer();

            if (articleId) {
                var path = Environment.path + '/articles/' + articleId,
                    config = _.extend({}, Environment.config);

                $http.get(path, config).then(
                    function (response) {
                        defer.resolve(new Article(response.data));
                    },
                    function (response) {
                        defer.reject(response);
                    }
                );
                return defer.promise;
            } else {
                defer.reject('articleId required');
            }

            return defer.promise;
        };

        Article.resetArticles = function () {
            Article.$$articles = {};
            Article.articles = [];
        };

        //TODO proxy web server request

        return Article;
    });
