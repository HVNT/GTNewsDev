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

        /* social metrics filters */
        $scope.socialFilters = MapFilters.socialFilters;
        $scope.activeSocialFilters = {'twitter': MapFilters.socialFilters['twitter']}; //twitter by default

        /* article category filters */
        $scope.categoryFilters = _.toArray(MapFilters.categoryFilters);
        $scope.activeCategoryFilters = MapFilters.categoryFilters;


        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (toParams) {
                Article.queryBBox(toParams.in_bbox).then(function (response) {
                    Marker.$$leafletMarkers = {};
                    if (response && response.length > 0) {
                        for (var i = 0; i < response.length; i++) {
                            new Marker(response[i]);
                        }
                    }
                    $scope.updateMarkers();
                    $scope.updateArticles();
                });
            }
        });

        $scope.queryMap = function () {
            leafletData.getMap('map').then(function (map) {
                $scope.mapQueried = true;
                MapEvents.register(map);
            }, function (err) {
                $log.debug(err);
            });
        };

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

        $scope.updateMarkers = function (uMarkers) {
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

            /* need to $timeout this because marker initialization is done asynchronously by leafletjs */
            $timeout(function () {
                leafletData.getMarkers().then(function (response) {
                    angular.forEach(response, function (value, key) {
                        value.on('click', function (event) {
                            console.log('Marker clicked :', event);
                        });
                    });
                });
            }, 100);
        };

        $scope.updateArticles = function () {
            $scope.activeArticles = _.filter(Article.articles, function (article) {
                return $scope.activeCategoryFilters.hasOwnProperty(article.category);
            });
        };


        if (!$scope.mapQueried) {
            $scope.queryMap();
        }
    })
    .controller('MapListCtrl', function ($scope, $window, $log, leafletData, Article, Marker) {
        $scope.articleSearch = "";
        $scope.listCollapsed = false;


        $scope.collapseList = function () {
            $scope.listCollapsed = !$scope.listCollapsed;
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

                /* update article list */
                $scope.updateArticles();
            }
        };

        $scope.togglePinSizing = function (filter, $event) {
            event.stopPropagation();

            if (filter && filter.key) {
                !$scope.activeSocialFilters[filter.key]
                    ? $scope.activeSocialFilters[filter.key] = filter
                    : delete $scope.activeSocialFilters[filter.key];

                Marker.updateSizingBy($scope.activeSocialFilters);
                $scope.$$markers = Marker.$$leafletMarkers;
                $scope.markers = _.toArray($scope.$$markers);
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