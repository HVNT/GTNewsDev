angular.module('nd.auth')
    .service('AuthStates', function () {
        return {
            'root': 'auth',
            'login': 'auth.login'
        }
    })
    .service('Auth', function ($q, $http, Environment) {

        this.login = function (username) {
            var defer = $q.defer();

            if (username && username.length > 0) {
                /* specifying credentials in query param,
                 opting GET for login vs tradition POST */

                var path = Environment.path + '/users/auth',
                    config = _.extend({
                        params: { username: username }
                    }, Environment.config);

                $http.get(path, config)
                    .then(function (response) {
                        defer.resolve(response);
                    }, function (response) {
                        defer.reject(response);
                    });
            } else {
                defer.reject();
            }

            return defer.promise;
        };

        /* TODO: do we need a logout? */
        this.logout = function () {
            var path = Environment.path + '/users/auth/logout/',
                config = _.extend({}, Environment.config),
                self = this;

            $http.post(path, {}, config).then(function (response) {
                self.ping();
            }, function (response) {
                self.ping();
            });
        };

    });