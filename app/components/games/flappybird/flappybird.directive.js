(function () {
  'use strict'

  angular
    .module('app.games')
    .directive('flappybird', flappybird)

  function flappybird () {
    var directive = {
      bindToController: true,
      controller: 'flappybirdCtrl',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {},
      templateUrl: '/app/components/games/flappybird/flappybird.template.html'
    }

    return directive
  }
})()

