/**
 * Created with WebStorm.
 * User: hunt
 * Date: 6/16/15
 * Time: 1:13 PM
 * File:
 */
//Data

angular.module('nd.map')
    .controller('MapCtrl',
    function ($scope, $state, $timeout, $window, $log, leafletData,
              MapStyles, MapEvents, MapFilters, Article, Marker, MarkerCategories) {

        $scope.MarkerCategories = MarkerCategories;
        angular.extend($scope, MapStyles.defaultConfig);

        /* init map */
        $scope.Article = Article;
//        $scope.activeArticles = Article.articles;

        $scope.map = {};

        $scope.markerModels = {};
        $scope.markers = [];
        $scope.$$markers = {};


        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //TODO debounce vs query blocking?
            if (toParams) {
                Article.queryBBox(toParams.in_bbox).then(function (response) {
                    Article.setPinSizes(); //TODO dylan will support by "next week" (11.9.15)

                    var markers = {};
                    if (response && response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            var marker = new Marker(response[i]);
                            $scope.markerModels[marker.id] = marker;
                            markers[marker.id] = marker.getMarker();
                        }
                    }
                    $scope.$$markers = markers;
                    $scope.markers = _.toArray(markers);

                    console.log($scope.activeMarker);
                    console.log($scope.centerMarker);
                    $scope.centerMarker = $scope.centerMarker;

                    updateActiveMarkers();
                });
            }
        });
        /* for populating view */
        $scope.categoryFilters = _.toArray(MapFilters.categoryFilters);
        $scope.activeFilters = MapFilters.categoryFilters;

        $scope.goArticleSource = function (articleUrl) {
            if (articleUrl && articleUrl.length > 0) {
                $window.open(articleUrl, '_blank');
            } else {
                $log.debug('Need source url to nav.');
            }
        };

        $scope.centering = false;
        $scope.centerMap = function (article) {
            if (article && !$scope.centering) {
                if ($scope.activeMarker) {
                    $scope.activeMarker.focus = false;
                }

                var targetMarker = $scope.$$markers[article.id];
                if (targetMarker) {
                    $scope.centering = true;
                    $scope.activeMarker = targetMarker;

                    $scope.centerMarker = {
                        lat: targetMarker.lat,
                        lng: targetMarker.lng,
                        zoom: 4
                    };

                    $timeout(function () {
                        targetMarker.focus = true;
                        $scope.centering = false;
                    }, 200);
                }

            } else {
                $log.debug('Need source url to nav.');
            }
        };
        
//        $scope.$watch('activeMarker', function (newVal, oldVal) {
//            console.log(newVal, oldVal);
//        });

        $scope.applyFilter = function (filter) {
            if (filter) {
                filter.toggle();

                !!filter.toggled /* add/remove toggled filter from active filters */
                    ? $scope.activeFilters[filter.key] = filter
                    : delete $scope.activeFilters[filter.key];

                var markerModels = {};
                angular.forEach($scope.markerModels, function (markerModel, key) {
                    if ($scope.activeFilters.hasOwnProperty(markerModel.category)) {
                        markerModels[key] = markerModel;
                    }
                });

                var markers = {};
                angular.forEach(markerModels, function (markerModel, key) {
                    markers[key] = markerModel.getMarker();
                });
                $scope.$$markers = markers;
                $scope.markers = _.toArray(markers);

                /* now update activeArticles */
                updateActiveMarkers();
            }
        };

        $scope.queryMap = function () {
            leafletData.getMap('map').then(function (map) {
                $scope.mapQueried = true;
                MapEvents.register(map);
            }, function (err) {
                $log.debug(err);
            });
        };

        function updateActiveMarkers() {
            $scope.activeArticles = _.filter(Article.articles, function (article) {
                var keep = false;
                angular.forEach($scope.activeFilters, function (filter, key) {
                    if (article.category === key) {
                        keep = true;
                    }
                });
                return keep;
            });
        }

        if (!$scope.mapQueried) {
            $scope.queryMap();
        }
    })
    .controller('MapListCtrl', function ($scope, leafletData, Article) {
        $scope.articleSearch = "";

        $scope.listCollapsed = false;
        $scope.collapseList = function () {
            $scope.listCollapsed = !$scope.listCollapsed;
        };

        $scope.toggleFilter = function (filter) {
            if (filter) {
                $scope.applyFilter(filter);
            }
        };
    })
    .controller('MapListArticlesCtrl', function () {
    });
