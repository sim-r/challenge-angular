'use strict'

angular.module('app')
    .config(function ($stateProvider) {
      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'app/components/games/flappybird/login/login.html',
          controller: 'loginCtrl',
          controllerAs: 'vm'
        })
    })

    .controller('loginCtrl', ['$scope', loginCtrl])

function loginCtrl ($scope) {
  var vm = this

  vm.isGameOn = false

  vm.initGame = initGame

  function initGame () {
    vm.isGameOn = true
  }
}
