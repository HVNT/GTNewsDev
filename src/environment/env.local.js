/**
 * Created with JetBrains WebStorm.
 * User: hbrennick
 * Date: 4/24/13
 * Time: 8:32 PM
 * File: /core/config/dev.js
 */

'use strict';

angular.module('nd.config', [])
    .config(function ($logProvider) {
        $logProvider.debugEnabled(true);
    })
    .factory('Environment', function () {
        var url = {
            dev: '',
            remote: '',
            test: 'http://cc-nebula.cc.gatech.edu/geonewsapi'
        };

        return {
            name: 'local',
            path: url.test,
            config: {}
        };
    });