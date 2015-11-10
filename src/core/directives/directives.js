/**
 * Created with WebStorm.
 * User: hunt
 * Date: 9/16/15
 * Time: 2:44 PM
 * File:
 */
angular.module('nd.directives', [])
    .directive('fillBackground', function () {
        return {
            scope: {
                color: '=fillBackground'
            },
            link: function (scope, element, attrs) {
                var color = scope.color;

                function setBackgroundColor() {
                    if (color) element.css({background: color});
                }
                setBackgroundColor();
            }
        }
    });