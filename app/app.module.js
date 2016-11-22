'use strict'
angular.module('app', ['app.games',
    'ui.router',
    'LocalStorageModule'
])

.config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
})