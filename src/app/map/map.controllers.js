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
    function ($scope, $state, $timeout, $window, $log, leafletData, MapStyles, MapEvents, MapFilters, Article, Marker, MarkerCategories) {

        $scope.Article = Article;
        $scope.Marker = Marker;
        $scope.MarkerCategories = MarkerCategories;
        angular.extend($scope, MapStyles.defaultConfig);

        $scope.map = {};
        $scope.activeMarker = {};
        $scope.markerModels = {};
        $scope.markers = [];
        $scope.$$markers = {};

        $scope.socialFilters = MapFilters.socialFilters;
        $scope.activeSocialFilters = {'twitter': MapFilters.socialFilters['twitter']}; //twitter by default

        $scope.categoryFilters = _.toArray(MapFilters.categoryFilters);
        $scope.activeCategoryFilters = MapFilters.categoryFilters;

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //TODO debounce vs query blocking?
            if (toParams) {
                Article.queryBBox(toParams.in_bbox).then(function (response) {
                    var markers = {};
                    Marker.$$leafletMarkers = {};

                    if (response && response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            new Marker(response[i]);
                        }
                    }
                    $scope.updateActiveMarkers();
                });
            }
        });

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

                    Marker.setActiveLeafletMarker(article.id);
                    $scope.centering = true;

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

                // this logic safely puts the pin you are trying to center around to the front of the map
                var _markers = _.extend({}, Marker.$$leafletMarkers);
                if (Marker.$$prevMarkerId) {
                    var activeMarker = _.extend({}, _markers[Marker.$$prevMarkerId]);
                    delete _markers[Marker.$$prevMarkerId];
                }
                var markers = _.toArray(_markers);
                if (activeMarker) markers.push(activeMarker);
                $scope.$$markers = Marker.$$leafletMarkers;
                $scope.markers = markers;
            } else {
                $log.debug('Need source url to nav.');
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

        $scope.updateActiveMarkers = function (uMarkers) {
            var _markers = uMarkers
                ? _.extend({}, uMarkers)
                : _.extend({}, Marker.$$leafletMarkers);

            if (Marker.$$prevMarkerId) {
                var activeMarker = _.extend({}, _markers[Marker.$$prevMarkerId]);
                delete _markers[Marker.$$prevMarkerId];
            }
            var markers = _.toArray(_markers);
            if (activeMarker) markers.push(activeMarker);
            $scope.$$markers = Marker.$$leafletMarkers;
            $scope.markers = markers;

            $scope.$$markers = markers;
            $scope.markers = _.toArray(markers);

            $scope.activeArticles = _.filter(Article.articles, function (article) {
                var keep = false;

                /* if is any of the current active filters keep it */
                angular.forEach($scope.activeCategoryFilters, function (filter, key) {
                    if (article.category === key) {
                        keep = true;
                    }
                });
                return keep;
            });
        };

        if (!$scope.mapQueried) {
            $scope.queryMap();
        }
    })
    .controller('MapListCtrl', function ($scope, leafletData, Article, Marker) {
        $scope.articleSearch = "";

        $scope.listCollapsed = false;
        $scope.collapseList = function () {
            $scope.listCollapsed = !$scope.listCollapsed;
        };

        $scope.toggleCategoryFilter = function (filter) {
            if (filter) {
                filter.toggle();

                !!filter.toggled /* add/remove toggled filter from active filters */
                    ? $scope.activeCategoryFilters[filter.key] = filter
                    : delete $scope.activeCategoryFilters[filter.key];

                var markerModels = {};
                angular.forEach(Marker.$$markers, function (markerModel, key) {
                    if ($scope.activeCategoryFilters.hasOwnProperty(markerModel.category)) {
                        markerModels[key] = markerModel;
                    }
                });

                var markers = {};
                angular.forEach(markerModels, function (markerModel, key) {
                    markers[key] = Marker.$$leafletMarkers[key];
                });

                /* now update activeArticles */
                $scope.updateActiveMarkers(markers);
            }
        };

        $scope.togglePinSizing = function (filter) {
            if (filter && filter.key) {
                !$scope.activeSocialFilters[filter.key]
                    ? $scope.activeSocialFilters[filter.key] = filter
                    : delete $scope.activeSocialFilters[filter.key];

                Marker.updateSizingBy($scope.activeSocialFilters);
                $scope.$$markers = Marker.$$leafletMarkers;
                $scope.markers = _.toArray($scope.$$markers);
            }
        }
    })
    .controller('MapListArticlesCtrl', function () {
    });
