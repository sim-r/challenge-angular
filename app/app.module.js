'use strict'
angular.module('app', ['app.games',
  'ui.router'])

.config(function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/login')
})

