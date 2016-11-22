(function () {
  'use strict'
  angular.module('app.games')
.factory('GamePiece', GamePiece)

  GamePiece.$inject = []

  function GamePiece () {
    var GamePiece = function (gameArea, width, height, color, x, y, type, isLogo) {
      var game = this
      var imgLogo = new Image()
      imgLogo.src = 'app/components/games/flappybird/assets/img/logoGame.png'
      game.type = type
      if (type === 'text') {
        game.text = color
      }
      game.score = 0
      game.width = width
      game.height = height
      game.speedX = 0
      game.speedY = 0
      game.x = x
      game.y = y
      game.isLogo = isLogo

      game.update = function () {
        var ctx = gameArea.context
        if (game.type === 'text') {
          ctx.font = game.width + ' ' + game.height
          ctx.fillStyle = color
          ctx.fillText(game.text, game.x, game.y)
        } else {
          ctx.fillStyle = color
          console.log('islogo :', game.isLogo)
          if (game.isLogo) {
            ctx.drawImage(imgLogo, game.x, game.y, game.width, game.height)
          } else {
            ctx.fillRect(game.x, game.y, game.width, game.height)
          }
        }
      }
      game.crashWith = function (otherobj) {
        var myleft = game.x
        var myright = game.x + (game.width)
        var mytop = game.y
        var mybottom = game.y + (game.height)
        var otherleft = otherobj.x
        var otherright = otherobj.x + (otherobj.width)
        var othertop = otherobj.y
        var otherbottom = otherobj.y + (otherobj.height)
        var crash = true
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
          crash = false
        }
        return crash
      }
    }
    return GamePiece
  }
})()
