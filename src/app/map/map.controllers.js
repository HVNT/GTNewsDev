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
    function ($scope, $state, $timeout, $window, $log, leafletData, leafletMarkerEvents, MapStyles, MapArchitect, MapFilters, Article, Marker, MarkerCategories) {

        $scope.Article = Article;
        $scope.Marker = Marker;
        $scope.MarkerCategories = MarkerCategories;
        angular.extend($scope, MapStyles.defaultConfig);

        $scope.map = {};
        $scope.activeMarker = {};
        $scope.markerModels = {};
        $scope.markers = [];
        $scope.$$markers = {};

        /* date filters */
        $scope.dateFilters = _.toArray(MapFilters.dateFilters);
        $scope.activeDateFilter = $scope.dateFilters[0];

        /* social metrics filters */
        $scope.socialFilters = MapFilters.socialFilters;
        $scope.activeSocialFilters = {'twitter': MapFilters.socialFilters['twitter']}; //twitter by default

        /* article category filters */
        $scope.categoryFilters = _.toArray(MapFilters.categoryFilters);
        $scope.activeCategoryFilters = MapFilters.categoryFilters;


        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (toParams) {
                var activeDateKey = $scope.activeDateFilter
                    ? $scope.activeDateFilter.key
                    : 'lastWeek';

                Article.queryBBox(toParams.in_bbox, activeDateKey).then(function (response) {
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
                MapArchitect.register(map);
            }, function (err) {
                $log.debug(err);
            });
        };

        $scope.centerMap = function (article) {
            console.log('centering map');
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
                    $scope.$broadcast('NDCenteringMarker')
                }
            } else {
                $log.debug('Need source url to nav.');
            }
        };

        $scope.updateMarkers = function (uMarkers) {
            $scope.markers =  uMarkers
                ? _.extend({}, uMarkers)
                : _.extend({}, Marker.$$leafletMarkers);
        };

        $scope.updateArticles = function () {
            $scope.activeArticles = _.filter(Article.articles, function (article) {
                return $scope.activeCategoryFilters.hasOwnProperty(article.category);
            });
        };


        if (!$scope.mapQueried) {
            $scope.queryMap();
        }

        $scope.$on('leafletDirectiveMarkersClick', function(event, args){
            var articleIdx = +args;
            if (articleIdx >= 0 && Article.$$articles[articleIdx]) {
                $scope.centerMap(Article.$$articles[articleIdx]);
            }
        });
    })
    .controller('MapListCtrl', function ($scope, $state, $window, $log, leafletData, Article, Marker) {
        $scope.articleSearch = "";
        $scope.listCollapsed = false;


        $scope.collapseList = function () {
            $scope.listCollapsed = !$scope.listCollapsed;
        };

        $scope.toggleDateFilter = function (filter) {
            if (filter && $state.params) {
                var currBBox = $state.params.in_bbox;
                if (currBBox) {
                    $scope.activeDateFilter = filter;
                    Article.queryBBox(currBBox, filter.key).then(function (response) {
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