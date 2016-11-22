 (function () {
   'use strict'

   angular
    .module('app.games')
    .controller('flappybirdCtrl', flappybirdCtrl)

   flappybirdCtrl.$inject = ['$scope', 'GameArea', 'GamePiece']

   function flappybirdCtrl ($scope, GameArea) {
      // subscribe to any keydown/keyup events (@see index.html)
     $scope.$on('keydown-evt', function (targetScope, evt) {
       console.log('A key was pressed by an user:', evt.keyCode)
     })
     $scope.$on('keyup-evt', function (targetScope, evt) {
       console.log('A key was released by an user:', evt.keyCode)
     })

      // private vars
     var game = null
     var canvasContainer = angular.element(document.getElementById('canvascontainer'))

      // scoped vars
     var vm = this
     vm.infos = {
       isRunning: false,
       score: 0
     }
     vm.restartGame = restartGame

      // run
     startGame()

      /** @method restartGame */
     function restartGame () {
       canvasContainer.empty()
       game.stop()
       game.clear()
       startGame()
     }

     function startGame () {
       game = new GameArea(canvasContainer, vm.infos)
       game.start()
     }

     function moveup (e) {
       game.bird.speedY = -1
     }

     function movedown () {
       game.bird.speedY = 1
     }

     function moveleft () {
       game.bird.speedX = -1
     }

     function moveright () {
       game.bird.speedX = 1
     }

     function clearmove (e) {
       game.bird.speedX = 0
       game.bird.speedY = 0
     }
   }
 })()
