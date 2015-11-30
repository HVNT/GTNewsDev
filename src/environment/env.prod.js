/**
 * Created with JetBrains WebStorm.
 * User: hbrennick
 * Date: 4/24/13
 * Time: 8:32 PM
 * File: /core/config/prod.js
 */

'use strict';

angular.module('nd.config', [])
    .config(function ($logProvider, $compileProvider) {
        $logProvider.debugEnabled(false);
    })
    .factory('Environment', function () {
        var url = {
            prod: '/geonewsapi',
            dev: '',
            remote: '',
            test: '/geonewsapi'
        };

        return {
            name: 'prod',
            path: url.prod,
            config: {}
        };
    });