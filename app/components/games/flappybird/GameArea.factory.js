(function() {
    'use strict'
    angular.module('app.games')
        .factory('GameArea', GameArea)

    GameArea.$inject = ['GamePiece', '$interval']

    function GameArea(GamePiece, $interval) {
        /**
         * @class GameArea
         * @classdesc Creates a new game area.
         */
        var GameArea = function(canvasContainer, infos) {
            var game = this
                // private vars
            var canvaWidth = 320
            var canvaHeight = 180
            game.obstacles = []
            game.canvas = angular.element('<canvas id="canvas-flappybird" width="' + canvaWidth + '" height="' + canvaHeight + '"></canvas>')
            canvasContainer.append(game.canvas)
            game.context = game.canvas[0].getContext('2d')
            game.frameNo = 0
            game.bird = null
            infos.isRunning = false
            infos.score = 0
            game.start = function() {
                game.bird = new GamePiece(game, 50, 50, 'red', 10, 75, null, true)
                game.interval = $interval(game.updateGameArea, 20)
                infos.isRunning = true
                infos.score = 0
            }
            game.stop = function() {
                $interval.cancel(game.interval)
                infos.isRunning = false
            }
            game.clear = function() {
                game.context.clearRect(0, 0, canvaWidth, canvaHeight)
            }
            game.updateGameArea = function() {
                var x, y, min, max, height, gap
                for (var i = 0; i < game.obstacles.length; i += 1) {
                    if (game.bird.crashWith(game.obstacles[i])) {
                        game.stop()
                        return
                    }
                }
                if (infos.isRunning === true) {
                    game.clear()
                    game.frameNo += 1
                    infos.score += 1
                    if (game.frameNo === 1 || game.everyinterval(150)) {
                        x = canvaWidth
                        y = canvaHeight - 100
                        min = 20
                        max = 100
                        height = Math.floor(Math.random() * (max - min + 1) + min)
                        min = 50
                        max = 100
                        gap = Math.floor(Math.random() * (max - min + 1) + min)
                        game.obstacles.push(new GamePiece(game, 10, height, 'pink', x, 0, null, false))
                        game.obstacles.push(new GamePiece(game, 10, x - height - gap, 'pink', x, height + gap, null, false))
                    }
                    for (i = 0; i < game.obstacles.length; i += 1) {
                        game.obstacles[i].x += -1
                        game.obstacles[i].update()
                    }
                    game.bird.x += game.bird.speedX
                    game.bird.y += game.bird.speedY
                    game.bird.update()
                }
            }

            game.everyinterval = function(n) {
                if ((game.frameNo / n) % 1 === 0) {
                    return true
                }
                return false
            }
        }
        return GameArea
    };
})()