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
    function ($scope, $state, $timeout, $window, $log, leafletData, leafletMarkerEvents, MapArchitect, MapStyles, MapFilters, Article, Marker, MarkerCategories) {

        $scope.Article = Article;
        $scope.Marker = Marker;
        $scope.MarkerCategories = MarkerCategories;
        $scope.MapFilters = MapFilters;
        angular.extend($scope, MapStyles.defaultConfig);

        $scope.map = {};
        $scope.activeMarker = {};
        $scope.markerModels = {};
        $scope.markers = [];
        $scope.$$markers = {};
        $scope.articleSearch = "";

        /* noise filters */
        $scope.noiseFilters = _.toArray(MapFilters.noiseFilters);

        /* date filters */
        $scope.dateFilters = _.toArray(MapFilters.dateFilters);

        /* social metrics filters */
        $scope.socialFilters = _.toArray(MapFilters.socialFilters);
        $scope.activeSocialFilters = {'facebook': MapFilters.socialFilters['facebook']}; //twitter by default

        /* article category filters */
        $scope.categoryFilters = _.toArray(MapFilters.categoryFilters);
        $scope.activeCategoryFilters = MapFilters.categoryFilters;

        $scope.requestPins = _.debounce(
            function () {
                Article.queryBBox($scope.bbox, $scope.articleSearch)
                    .then(function (response) {
                        Marker.reset();
                        if (response && response.length > 0) {
                            for (var i = 0; i < response.length; i++) {
                                new Marker(response[i]);
                            }
                        }
                        $scope.updateModels();
                    });
            }, 0);

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (toParams) {
                $scope.bbox = toParams.in_bbox;
                $scope.requestPins();
            }
        });

        $scope.queryMap = function () {
            leafletData.getMap('map').then(function (map) {
                $scope.mapQueried = true;
                MapArchitect.register(map);
            }, function (err) {
                $log.debug(err);
            });
        };

        $scope.centerMap = function (article) {
            $log.debug('[centering] map');
            if (article && !$scope.centering) {
                //TODO set old marker to focus=false (done implicitly by leaflet??)

                var targetMarker = $scope.markers[article.id];
                if (targetMarker) {
                    var currZoom = MapArchitect.map.getZoom();
                    Marker.setActiveLeafletMarker(article.id);

                    $scope.markers = Marker.$$leafletMarkers;
                    $scope.centerMarker = {
                        $$id: targetMarker.$$id,
                        lat: targetMarker.lat,
                        lng: targetMarker.lng,
                        zoom: currZoom < 4 ? 4 : currZoom
                    };
                    $scope.activeMarker = _.extend({}, $scope.centerMarker);
                    targetMarker.focus = true;
                }
            } else {
                $log.debug('Need source url to nav.');
            }
        };

        $scope.updateMarkers = function (uMarkers) {
            $scope.markers = uMarkers
                ? _.extend({}, uMarkers)
                : _.extend({}, Marker.$$leafletMarkers);
        };

        $scope.updateArticles = function () {
            $scope.activeArticles = _.filter(Article.articles, function (article) {
                return $scope.activeCategoryFilters.hasOwnProperty(article.category);
            });
        };

        $scope.search = function (predicate) {
            $scope.articleSearch = predicate;
            $scope.requestPins();
        };

        if (!$scope.mapQueried) {
            $scope.queryMap();
        }

        $scope.updateModels = function (uMarkers) {
            $scope.markers = uMarkers
                ? _.extend({}, uMarkers)
                : _.extend({}, Marker.$$leafletMarkers);

            /* update map markers */
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

            $scope.updateMarkers(markers);
            $scope.updateArticles();
        };

        $scope.$on('leafletDirectiveMarkersClick', function (event, args) {
            var articleIdx = +args;
            if (articleIdx >= 0 && Article.$$articles[articleIdx]) {
                $scope.centerMap(Article.$$articles[articleIdx]);
            }
        });
    })
    .controller('MapListCtrl', function ($scope, $state, $window, $log, $timeout, leafletData, MapFilters, Article, Marker) {

        $scope.listCollapsed = false;

        $scope.collapseList = function () {
            $scope.listCollapsed = !$scope.listCollapsed;
        };

        $scope.toggleDateFilter = function (filter) {
            if (filter && $state.params) {
                $scope.bbox = $state.params.in_bbox;
                MapFilters.setDateFilter(filter);
                $scope.requestPins();
            }
        };

        $scope.toggleNoiseFilter = function (filter) {
            if (filter && $state.params) {
                $scope.bbox = $state.params.in_bbox;
                MapFilters.setNoiseFilter(filter);
                $scope.requestPins()
            }
        };

        $scope.toggleCategoryFilter = function (filter) {
            if (filter) {
                filter.toggle();

                /* add/delete toggled filter from active filters */
                !!filter.toggled
                    ? $scope.activeCategoryFilters[filter.key] = filter
                    : delete $scope.activeCategoryFilters[filter.key];

                /* update map markers */
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
                $scope.updateMarkers(markers);
                $scope.updateArticles();
            }
        };

        $scope.togglePinSizing = function (filter, $event) {
            if (filter && filter.key) {
                !$scope.activeSocialFilters[filter.key]
                    ? $scope.activeSocialFilters[filter.key] = filter
                    : delete $scope.activeSocialFilters[filter.key];

                Marker.updateSizingBy($scope.activeSocialFilters);
                $scope.updateMarkers();
            }
        };

        $scope.goArticleSource = function (articleUrl) {
            if (articleUrl && articleUrl.length > 0) {
                $window.open(articleUrl, '_blank');
            } else {
                $log.debug('Need source url to nav.');
            }
        };
    });