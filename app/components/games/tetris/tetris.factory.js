(function () {
  'use strict'
  class Tetris {
    constructor (width, height, rows, cols, canvas, difficulty) {
      this.c = canvas || document.getElementById('canvas-tetris')
      this.ctx = this.c.getContext('2d')
      this.w = width || 350
      this.h = height || 600
      this.ROWS = rows || 20
      this.COLS = cols || 10
      this.BLOCK_W = this.w / this.COLS
      this.BLOCK_H = this.h / this.ROWS
      this.shape = []
      this.tetrisBoard = []
      this.currX = 0
      this.currY = 0
      this.difficulty = difficulty || 'normal'
      this.difficulties = {
        easy: 500,
        normal: 250,
        hard: 125
      }
      this.firstTime = true
      this.pieceSize = 0
      this.gameOver = false
      this.paused = false
      this.score = 0
      this.linesKilled = 0
      this.pieces = [
      [1, 1, 1, 1],
        [2, 2, 2,
          2
        ],
        [3, 3, 3,
          0, 0, 3
        ],
        [4, 4, 4,
          0, 4, 0
        ],
        [0, 5, 5,
          0, 5, 5
        ],
        [0, 6, 6,
          6, 6
        ],
        [7, 7, 0,
          0, 7, 7
        ]
      ]
      this.colors = [
        'cyan', 'orange', 'deepskyblue', 'yellow', 'tomato', 'lime', 'violet'
      ]
      this.baseScore = [40, 100, 300, 1200]
      this.levels = [4800, 10800, 22800, 33600, 52800, 68400, 94800, 115200, 148800, 174000, 214800, 244800, 292800, 327600, 382800, 422400, 484800, 529200, 598800, 648000, 724800, 778800, 862800, 921600, 999999]
      this.level = 0
      window.addEventListener('resize', this.resizeCanvas.bind(this), false)
      window.addEventListener('keydown', this.controls.bind(this), false)
    }

    destroy () {
      window.removeEventListener('resize', this.resizeCanvas, false)
      window.removeEventListener('keydown', this.controls.bind(this), false)
      this.c = null
      this.ctx = null
    }

    on (event, callback) {
      this.c.addEventListener(event, callback, true)
      return {
        callback: callback,
        remove: () => this.canvas.removeEventListener(event, callback, true)
      }
    }

    emit (event, data) {
      this.c.dispatchEvent(new CustomEvent(event, {detail: data}))
    }

    controls (e) {
      e.preventDefault()
      if (e.keyCode == 13) {
        this.paused = !this.paused
        if (this.paused) window.clearInterval(this.ticker)
        this.ticker = null
        if (!this.paused) this.ticker = window.setInterval(this.tick.bind(this), this.difficulties[this.difficulty])
      } else if (!this.paused) {
        switch (e.keyCode) {
          case 38:
            let rotShape = this.rotate()
            if (this.valid(0, 0, rotShape)) {
              this.shape = rotShape
            }
            break
          case 39:
            if (this.valid(1)) {
              this.currX++
            }
            break
          case 37:
            if (this.valid(-1)) {
              this.currX--
            }
            break
          case 40:
            if (this.valid(0, 1)) {
              this.currY++
            }
            break
          case 32:
            this.dropDown()
            break
          case 82:
            this.newGame()
            break
        }
      }
    }

    createShape () {
      let randomShape = Math.floor(Math.random() * this.pieces.length)
      if (randomShape === 0) { // if I shape, the matrix will be 4x4
        this.pieceSize = 4
      } else {
        this.pieceSize = 3
      }

      let counter = -this.pieceSize
      this.shape = []
      for (let i = 0; i < this.pieceSize; i++) {
        this.shape[i] = []
        for (let j = 0; j < this.pieceSize; j++) {
          if (counter < this.pieces[randomShape].length && i > 0) {
            this.shape[i][j] = this.pieces[randomShape][counter]
          } else {
            this.shape[i][j] = 0
          }
          counter++
        }
      }

    // set dimensions for the shape on the board
      this.currX = 3
      this.currY = -1
    }

    rotate () {
      let shapeString = this.shape.toString()
      let boxString = [
      [0, 0, 0],
      [0, 5, 5],
      [0, 5, 5]
      ].toString()

    // don't rotate the square
      if (shapeString == boxString) {
        return this.shape
      }
      var rotShape = []
      for (let i = 0; i < this.pieceSize; ++i) {
        rotShape[i] = []
        for (let j = 0; j < this.pieceSize; ++j) {
          rotShape[i][j] = this.shape[this.pieceSize - j - 1][i]
        }
      }
    // set the shape to be that of the rotated shape
      return rotShape
    }

    init () {
      for (let i = 0; i < this.ROWS; i++) {
        this.tetrisBoard[i] = []
        for (let j = 0; j < this.COLS; j++) {
          this.tetrisBoard[i][j] = 0
        }
      }
    }

    draw () {
      if (this.ctx && !this.paused) {
        for (let x = 0; x < this.COLS; ++x) {
          for (let y = 0; y < this.ROWS; ++y) {
            if (this.tetrisBoard[y][x]) {
              this.ctx.strokeStyle = 'black'
              this.ctx.lineWidth = '4'
              this.ctx.fillStyle = this.colors[this.tetrisBoard[y][x] - 1]
              this.ctx.fillRect(this.BLOCK_W * x, this.BLOCK_H * y, this.BLOCK_W - 1, this.BLOCK_H - 1)
              this.ctx.strokeRect(this.BLOCK_W * x, this.BLOCK_H * y, this.BLOCK_W - 1, this.BLOCK_H - 1)
            } else {
              this.ctx.strokeStyle = 'black'
              this.ctx.lineWidth = '0.5'
              this.ctx.fillStyle = 'white'
              this.ctx.fillRect(this.BLOCK_W * x + 1, this.BLOCK_H * y + 1, this.BLOCK_W - 1, this.BLOCK_H - 1)
              this.ctx.strokeRect(this.BLOCK_W * x, this.BLOCK_H * y, this.BLOCK_W - 1, this.BLOCK_H - 1)
            }
          }
        }

        this.ctx.strokeStyle = 'black'
        for (let y = 0; y < this.pieceSize; ++y) {
          for (let x = 0; x < this.pieceSize; ++x) {
            if (this.shape[y][x]) {
              this.ctx.fillStyle = this.colors[this.shape[y][x] - 1]
              this.ctx.lineWidth = '4'
              this.ctx.fillRect(this.BLOCK_W * (x + this.currX), this.BLOCK_H * (y + this.currY), this.BLOCK_W - 1, this.BLOCK_H - 1)
              this.ctx.strokeRect(this.BLOCK_W * (x + this.currX), this.BLOCK_H * (y + this.currY), this.BLOCK_W - 1, this.BLOCK_H - 1)
            }
          }
        }
      }
      window.requestAnimationFrame(this.draw.bind(this))
    }

    tick () {
      if (this.paused) return
      if (this.valid(0, 1)) {
        this.currY++
      } else {
        this.modifyBoard()
        this.lineCheck()
        if (this.gameOver) {
          this.emit('gameover', {score: this.score, level: this.level})
          this.newGame()
          this.draw()
          this.paused = true
          return
        }
        this.createShape()
      }
    }

    lineCheck () {
      let linesKilled = 0
      for (let y = this.ROWS - 1; y >= 0; --y) {
        let clearLine = true
        for (let x = 0; x < this.COLS; ++x) {
          if (!this.tetrisBoard[y][x]) {
            clearLine = false
            break
          }
        }
        if (clearLine) {
          linesKilled++
          for (let i = y; i > 0; --i) {
            for (let j = 0; j < this.COLS; ++j) {
              this.tetrisBoard[i][j] = this.tetrisBoard[i - 1][j]
            }
          }
          y++
        }
      }
      if (linesKilled) {
        this.linesKilled += linesKilled
        this.score += this.baseScore[linesKilled - 1] * (this.level + 1)
        for (let i = 0; i < this.levels.length; i++) {
          if (i + 1 < this.levels.length && this.score > this.levels[i] && this.score < this.levels[i + 1]) {
            this.level = this.levels[i]
            break
          }
        }
        this.emit('scorechanged', {score: this.score})
      }
    }

    modifyBoard () {
      for (let y = 0; y < this.pieceSize; ++y) {
        for (let x = 0; x < this.pieceSize; ++x) {
          if (this.shape[y][x]) {
            this.tetrisBoard[this.currY + y][this.currX + x] = this.shape[y][x]
          }
        }
      }
    }

    valid (offsetX, offsetY, newCurrent) {
      offsetX = offsetX || 0
      offsetY = offsetY || 0
      offsetX = this.currX + offsetX
      offsetY = this.currY + offsetY
      newCurrent = newCurrent || this.shape

      for (let y = 0; y < this.pieceSize; ++y) {
        for (let x = 0; x < this.pieceSize; ++x) {
          if (newCurrent[y][x]) {
            if (typeof this.tetrisBoard[y + offsetY] === 'undefined' || typeof this.tetrisBoard[y + offsetY][x + offsetX] === 'undefined' || this.tetrisBoard[y + offsetY][x + offsetX] || x + offsetX < 0 || y + offsetY >= this.ROWS || x + offsetX >= this.COLS) {
              if ((offsetY === 0 || offsetY == 1) && (offsetX >= 0 && offsetX < 11 - this.pieceSize)) {
                this.gameOver = true
              }
              return false
            }
          }
        }
      }
      return true
    }

    dropDown () {
      for (let y = this.pieceSize - 1; y >= 0; --y) {
        for (let x = this.pieceSize - 1; x >= 0; --x) {
          if (this.shape[y][x]) {
            for (let offsetY = this.currY; offsetY < this.ROWS; ++offsetY) {
              if (this.valid(0, 1)) {
                this.currY++
              }
            }
          }
        }
      }
    }

    newGame () {
      this.init()
      this.score = 0
      this.level = 0
      this.gameOver = false
      this.createShape()
    }

    start () {
      this.resizeCanvas()
      this.init()
      this.createShape()
      this.ticker = setInterval(this.tick.bind(this), this.difficulties[this.difficulty])
      window.requestAnimationFrame(this.draw.bind(this))
      this.emit('started')
    }

    resizeCanvas () {
      this.c.width = ((window.innerHeight / 1.3) / 1.714)
      this.c.height = window.innerHeight / 1.3
      this.w = this.c.width
      this.h = this.c.height
      this.BLOCK_W = this.w / this.COLS
      this.BLOCK_H = this.h / this.ROWS
      this.emit('resize')
    }
}

  angular.module('app.games')
    .factory('TetrisFactory', TetrisFactory)

  TetrisFactory.$inject = []

  function TetrisFactory () {
    if (Tetris) {
      var tetris = new Tetris()
      return tetris
    } else {
      return null
    }
  }
})()
