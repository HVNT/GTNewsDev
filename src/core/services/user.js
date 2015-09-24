/**
 * Created with WebStorm.
 * User: hunt
 * Date: 9/16/15
 * Time: 2:44 PM
 * File:
 */
angular.module('nd.services')
    .factory('User', function ($http, $q, Environment) {

        function User(data) {
            this.userId = data.userId || null;
            this.username = data.username || '';

            this.groups = data.groups || [];
            this.$$groups = {};
        }

        User.users = [];
        User.$$users = {};

        User.query = function () {
            var defer = $q.defer(),
                self = this,
                path = Environment.path + '/users/all',
                config = _.extend({}, Environment.config);

            $http.get(path, config).then(
                function (response) {
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            var newUser = new User(response.data[i]);
                            User.$$users[newUser.userId] = newUser;
                            User.users.push(User.$$users[newUser.userId]);
                        }
                    }
                    defer.resolve(User.users);
                },
                function (response) {
                    defer.reject(response);
                }
            );
            return defer.promise;
        };

        // TODO: wiki documentation suggests that its a param but url structure disagrees
        User.get = function (userId) {
            var defer = $q.defer();

            if (userId) {
                var path = Environment.path + '/users/' + userId,
                    config = _.extend({}, Environment.config);

                $http.get(path, config).then(
                    function (response) {
                        defer.resolve(new User(response.data));
                    },
                    function (response) {
                        defer.reject(response);
                    }
                );
                return defer.promise;
            } else {
                defer.reject('userId required');
            }

            return defer.promise;
        };

        User.prototype.create = function () {
            var defer = $q.defer();

            if (this.username && this.username.length > 0) {
                var self = this,
                    path = Environment.path + '/users',
                    config = _.extend({
                        params: {
                            newUser: this.username //TODO: can we camel case this param? against convention..
                        }
                    }, Environment.config);

                $http.post(path, self, config).then(
                    function (response) {
                        defer.resolve(new User(response.data));
                    },
                    function (response) {
                        defer.reject(response);
                    }
                );
            } else {
                defer.reject();
            }

            return defer.promise;
        };

        return User;
    });
