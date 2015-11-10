/**
 * Created with WebStorm.
 * User: hunt
 * Date: 9/16/15
 * Time: 2:44 PM
 * File:
 */
angular.module('nd.filters', [])
    .filter('ellipsis', function () {
        return function (input, limit, position) {
            var length = input ? input.length : 0;

            if (length > limit) {
                var str = '';

                if (position && position === 'end') {
                    str = input.substr(0, limit) + "...";
                } else {
                    var firstHalf = parseInt(limit / 2),
                        secondHalf = length - firstHalf;

                    str = input.substr(0, firstHalf) + " .. " + input.substr(secondHalf, length);
                }

                return str;
            } else {
                return input;
            }
        };
    })
    .filter('capitalize', function () {
        return function (input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }) : '';
        }
    });