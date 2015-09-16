if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () {};

angular.module('nd.app', [
    'ui.router',
    'nd.core',
    'nd.map',
    'nd.config',
    'nd.auth'
]);
