/**
 * Created with WebStorm.
 * User: hunt
 * Date: 9/16/15
 * Time: 2:44 PM
 * File:
 */
angular.module('nd.services')
    .factory('Article', function ($http, $q, Environment) {
        function Article(data) {
            this.id = data.id || null;

            this.author = data.author || '';
            this.title = data.title || '';
            this.subtitle = data.subtitle || '';
            this.abstract = data.abstract || '';
            this.category = data.category || 'world'; //world = misc

            this.url = data.url || '';
            this.dateCreated = data.dateCreated || null;
            this.twitterCount = data.twitterCount || 0;
            this.pinSize = data.pinSize || 0;

            this.isGeolocated = !!data.isgeolocated;
            if (this.isGeolocated && !_.isEmpty(this.coords)) {
                if (this.coords.coordinates && this.coords.coordinates.length == 2) {
                    var coordinates = this.coords.coordinates;
                    this.lat = coordinates[0];
                    this.lng = coordinates[1];
                }
            }
        }

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
                var path = Environment.path + '/pins/?in_bbox=' + bboxParam + '&format=json',
                    config = _.extend({}, Environment.config);

                $http.get(path, config).then(
                    function (response) {
                        Article.resetArticles(); //reset articles
                        if (response.data.length > 0) {
                            for (var i = 0; i < response.data.length; i++) {
                                if (response.data[i] && !!response.data[i].isgeolocated) {
                                    var newArticle = new Article(response.data[i]);
                                    Article.$$articles[newArticle.id] = newArticle;
                                    Article.articles.push(Article.$$articles[newArticle.id]);
                                }
                            }
                        }
                        defer.resolve(Article.articles);
                    },
                    function (response) {
                        defer.reject(response);
                    }
                );
            } else {
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
