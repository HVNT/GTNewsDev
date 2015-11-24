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
    })
    .directive('urlBackground', function () {
        return {
            link: function (scope, element, attrs) {
                var url = scope.$eval(attrs.urlBackground);

                function setBackgroundUrl(url) {
                    if (url) {
                        element.css({
                            'background-image': 'url(' + url +')',
                            'background-size' : '40px 40px'
                        });
                    }
                }
                setBackgroundUrl(url);

                scope.$watch(attrs.urlBackground, function (newBG) {
                    var url = scope.$eval(attrs.urlBackground);
                    setBackgroundUrl(url);
                });
            }
        }
    })
    .directive('articleCards', function (Article) {
        return {
            link: function (scope, element, attrs) {
                scope.$on('NDCenteringMarker', function (event, value) {
//                    console.log(scope);
//                    console.log(elementj);
                });
            }
        }
    });