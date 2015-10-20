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

            this.articleUrl = data.articleUrl || '';
            this.dateCreated = data.dateCreated || null;
            this.twitterCount = data.twitterCount || 0;
            this.pinSize = data.pinSize || 0;
            this.lat = data.lat || null;  //null?
            this.lng = data.lng || null;  //null?

            this.$$text = data.$text || '';
        }

        Article.articles = [];
        Article.$$articles = {};

        Article.query = function () {
            var defer = $q.defer(),
                self = this,
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

        //TODO proxy web server request

        return Article;
    });
