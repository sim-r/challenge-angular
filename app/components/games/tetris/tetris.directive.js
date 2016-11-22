(function () {
  'use strict'

  angular
    .module('app.games')
    .directive('tetris', tetris)

  function tetris () {
    var directive = {
      bindToController: true,
      controller: 'tetrisCtrl',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {},
      templateUrl: '/app/components/games/tetris/tetris.template.html'
    }

    return directive
  }
})()
