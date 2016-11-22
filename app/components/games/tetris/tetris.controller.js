(function () {
  'use strict'
  angular
    .module('app.games')
    .controller('tetrisCtrl', tetrisCtrl)
  tetrisCtrl.$inject = ['$scope', 'TetrisFactory']
  function tetrisCtrl ($scope, TetrisFactory) {
    this.game = TetrisFactory
    this.game.start()
    this.game.on('scorechanged', function (e) {
      $scope.score = e.detail.score
    })
  }
})()
