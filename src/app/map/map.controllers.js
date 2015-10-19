/**
 * Created with WebStorm.
 * User: hunt
 * Date: 6/16/15
 * Time: 1:13 PM
 * File:
 */
//Data

angular.module('nd.map')
    .controller('MapCtrl', function ($scope, $timeout, $window, $log, MapStyles, Article, Marker, CenterMarker) {
        console.log(MapStyles.defaultConfig);
        angular.extend($scope, MapStyles.defaultConfig); // init map

        $scope.Article = Article;
        $scope.markers = [];
        $scope.$$markers = {};

        $scope.goArticleSource = function (articleUrl) {
            if (articleUrl && articleUrl.length > 0) {
                $window.open(articleUrl,  '_blank');
            } else {
                $log.debug('Need source url to nav.');
            }
        };

        $scope.centering = false;
        $scope.activeMarker = {};
        $scope.centerMap = function (article) {
            if (article && !$scope.centering) {
                if ($scope.activeMarker) {
                    $scope.activeMarker.focus = false;
                }

                var targetMarker = $scope.$$markers[article.id];
                $scope.centering = true;

                $scope.centerMarker =  {
                    lat: targetMarker.lat,
                    lng: targetMarker.lng,
                    zoom: 8
                };

                $scope.activeMarker = targetMarker;
                $timeout(function () {
                    targetMarker.focus = true;
                    $scope.centering = false;
                }, 200);

            } else {
                $log.debug('Need source url to nav.');
            }
        };

        //TODO
        $scope.$on('leafletDirectiveMap.click', function(event){
            console.log('yoooo');
        });

        
        $scope.query = function () {
            Article.query().then(function (response) {
                var markers = {};
                if (response && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var marker = new Marker(response[i]);
                        markers[i + 1] = marker.getMarker(); //TODO update when API ready
                    }
                }

                $scope.$$markers = markers;
                $scope.markers = _.toArray(markers);
                $scope.queried = true;
                
                $log.debug(markers);
            });
        };


        if (!$scope.queried) {
            $scope.query();
        }
    })
    .controller('MapListCtrl', function ($scope, MapStyles) {
        $scope.articleSearch = "";

        $scope.listCollapsed = false;
        $scope.collapseList = function () {
            $scope.listCollapsed = !$scope.listCollapsed;
        };
    })
    .controller('MapListArticlesCtrl', function () {
    });
