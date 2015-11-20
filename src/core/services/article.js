/**
 * Created with WebStorm.
 * User: hunt
 * Date: 9/16/15
 * Time: 2:44 PM
 * File:
 */
angular.module('nd.services')
    .factory('Article', function ($http, $q, Environment) {
        Article.TWTTR_FLOOR = 1000;
        Article.FB_FLOOR = 1000;
        Article.$$fetching = false;

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

            if (!data.pinsize) debugger;
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

        Article.maxRetweetCount = 0;
        Article.articles = [];
        Article.$$articles = {};

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

        //TODO add date
        Article.queryBBox = function (bboxParam) {
            var defer = $q.defer();

            if (bboxParam) {
                var path = Environment.path + '/pins/?in_bbox=' + bboxParam +
                        '&min_retweetcount=' + Article.TWTTR_FLOOR + '&format=json',
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
