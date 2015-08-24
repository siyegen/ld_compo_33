(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.log("Cool code!");

function lerp(v0, v1, t) {
  return (1 - t) * v0 + t * v1;
}

function normalAcc(v0, v1) {
  return lerp(v0, v1, .5);
}

var Game = (function () {
  function Game() {
    _classCallCheck(this, Game);

    this.width = 1000;
    this.height = 800;

    this.inputState = {
      moving: false,
      buttons: {
        RIGHT: false,
        LEFT: false
      }
    };

    this.gameState = { shouldUpdate: false };

    this.currentTime = new Date();
    this.prevTime = new Date();

    this.turn = 0;
    this.turnText = new PIXI.Text("Turn " + this.turn, { font: '24px Arial', fill: 0x3f3863, align: 'center' });
    this.bottomHud = new PIXI.Container();
    this.bottomHud.addChild(this.turnText);
    this.bottomHud.position = new PIXI.Point(this.width - (this.turnText.width + 50), this.height - this.turnText.height);
    console.log("hud pos", this.bottomHud.position);

    this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
    this.stage = new PIXI.Container();

    this.grid = new PIXI.Graphics();

    this.level = new Level(this.width, this.height, 50);

    var texture = new PIXI.Texture.fromImage('./images/test-sky.png');
    var tilingSprite = new PIXI.extras.TilingSprite(texture, this.width + 300, this.height + 300);

    var sprite = new PIXI.Sprite.fromImage('./images/moorawr.png');
    this.player = new Player(3, 3);
    sprite.anchor.x = 0.5, sprite.anchor.y = 0.5;
    sprite.position = this.player.position;

    var startTile = [3, 3];
    var tile = this.level.tileAtColRow(startTile[0], startTile[1]);
    if (tile != undefined && tile == 0) {
      this.player.moveTo(startTile[0], startTile[1], this.level.tileSize);
    } else {
      throw new RangeError("Player outside of valid range");
    }
    this.stage.addChild(this.grid);
    this.stage.addChild(sprite);
    this.stage.addChildAt(tilingSprite, 0);
    this.stage.addChild(this.bottomHud);
  }

  _createClass(Game, [{
    key: "update",
    value: function update() {
      var _player$tilePos = _slicedToArray(this.player.tilePos, 2);

      var col = _player$tilePos[0];
      var row = _player$tilePos[1];

      if (this.player.direction.x != 0) {
        var moveToTile = this.level.tileAtColRow(col + this.player.direction.x, row);
        if (moveToTile != undefined && moveToTile != 1) {
          console.log("Moving!", moveToTile);
          this.player.moveTo(col + this.player.direction.x, row, this.level.tileSize);
        }
      }
      if (this.player.direction.y != 0) {
        var moveToTile = this.level.tileAtColRow(col, row + this.player.direction.y);
        if (moveToTile != undefined && moveToTile != 1) {
          console.log("Moving!", moveToTile);
          this.player.moveTo(col, row + this.player.direction.y, this.level.tileSize);
        }
      }
      this.turnText.text = "Turn " + this.turn;
      this.player.direction.x = 0;
      this.player.direction.y = 0;
    }
  }, {
    key: "render",
    value: function render() {
      this.renderer.render(this.stage);
      this.grid.clear();
      this.grid.lineStyle(2, 0x112233, 0.9);
      // Columns
      for (var i = this.level.numCols; i >= 0; i--) {
        this.grid.moveTo(i * this.level.tileSize, 0);
        this.grid.lineTo(i * this.level.tileSize, this.level.height);
      }
      // Rows
      for (var i = this.level.numRows; i >= 0; i--) {
        this.grid.moveTo(0, i * this.level.tileSize);
        this.grid.lineTo(this.level.width, i * this.level.tileSize);
      }

      this.grid.beginFill(0x333333, 1);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.level.tiles.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var index = _step$value[0];
          var tile = _step$value[1];

          if (tile == 1) {
            var _level$idxToTileCoord = this.level.idxToTileCoord(index);

            var _level$idxToTileCoord2 = _slicedToArray(_level$idxToTileCoord, 2);

            var col = _level$idxToTileCoord2[0];
            var row = _level$idxToTileCoord2[1];

            this.grid.drawRect(col * this.level.tileSize, row * this.level.tileSize, this.level.tileSize, this.level.tileSize);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.grid.endFill();
    }
  }, {
    key: "handleInput",
    value: function handleInput() {
      if (this.inputState.buttons.LEFT == true) {
        this.player.direction.x = -1;
        this.inputState.buttons.LEFT = false;
        this.player.isActing = true;
        this.gameState.shouldUpdate = true;
      } else if (this.inputState.buttons.RIGHT == true) {
        this.player.direction.x = 1;
        this.inputState.buttons.RIGHT = false;
        this.player.isActing = true;
        this.gameState.shouldUpdate = true;
      }

      if (this.inputState.buttons.DOWN == true) {
        this.player.direction.y = 1;
        this.inputState.buttons.DOWN = false;
        this.player.isActing = true;
        this.gameState.shouldUpdate = true;
        console.log("moving, should update");
      } else if (this.inputState.buttons.UP == true) {
        this.player.direction.y = -1;
        this.inputState.buttons.UP = false;
        this.player.isActing = true;
        this.gameState.shouldUpdate = true;
      }

      if (this.inputState.buttons.SPACE) {
        console.log(this.player.tilePos);
        console.log("numCols", this.level.numCols);
        console.log("index", this.player.tilePos[1] * this.level.numCols + this.player.tilePos[0]);
        console.log(this.level.tileAtColRow(this.player.tilePos[0], this.player.tilePos[1]));
      }
    }
  }, {
    key: "loop",
    value: function loop() {
      var _this = this;

      this.currentTime = new Date();
      this.handleInput();
      // should only update after a move
      // if (this.currentTime - this.prevTime >= 150) {
      if (this.gameState.shouldUpdate) {
        console.log("update");
        this.turn++;
        this.update();
        this.prevTime = this.currentTime;
        this.gameState.shouldUpdate = false;
      }
      // }
      // Time.sleep(500);
      this.render();
      requestAnimationFrame(function () {
        return _this.loop();
      });
    }
  }, {
    key: "start",
    value: function start() {
      console.log("Start game");
      document.body.appendChild(this.renderer.view);
      this.loop();
    }
  }]);

  return Game;
})();

var Player = (function () {
  function Player(col, row) {
    _classCallCheck(this, Player);

    this.tilePos = [col, row];
    this.position = new PIXI.Point(10, 10);
    this.direction = { x: 0, y: 0 };
    this.isActing = false;
  }

  _createClass(Player, [{
    key: "moveTo",
    value: function moveTo(col, row, tileSize) {
      // tilePos to PIXI.Point
      this.tilePos[0] = col, this.tilePos[1] = row;
      this.position.set(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2);
    }
  }]);

  return Player;
})();

var Level = (function () {
  function Level(width, height, tileSize) {
    _classCallCheck(this, Level);

    this.width = width;
    this.height = height;

    this.tileSize = tileSize;
    this.tiles = [];

    this.numCols = Math.floor(this.width / this.tileSize);
    this.numRows = Math.floor(this.height / this.tileSize);
    this.generate();
  }

  _createClass(Level, [{
    key: "generate",
    value: function generate() {
      var number = this.numCols * this.numRows;
      for (var i = 0; i < number; i++) {
        this.tiles.push(0);
      };

      this.tiles[6] = 1;
      this.tiles[21] = 1;
      console.log("moo gen");
    }
  }, {
    key: "tileAtColRow",
    value: function tileAtColRow(col, row) {
      if (col > this.numCols - 1 || col < 0) {
        return undefined;
      }
      return this.tiles[row * this.numCols + col];
    }
  }, {
    key: "idxToTileCoord",
    value: function idxToTileCoord(index) {
      return [index % this.numCols, Math.trunc(index / this.numCols)];
    }
  }]);

  return Level;
})();

var game = new Game();
game.start();

var keyConfig = {
  65: "LEFT",
  83: "DOWN",
  68: "RIGHT",
  87: "UP",
  37: "CAMLEFT",
  39: "CAMRIGHT",
  32: "SPACE",
  90: "ZOOM"
};

window.addEventListener('click', function (e) {
  var point = new PIXI.Point(e.clientX, e.clientY);
  console.log("point!", point);
  game.inputState.buttons['LEFT_CLICK'] = true;
  game.inputState.position = point;
});

window.addEventListener('keyup', function (e) {
  var key = keyConfig[e.keyCode];

  if (key != undefined) {
    game.inputState.buttons[key] = false;
  }
});

window.addEventListener('keydown', function (e) {
  var key = keyConfig[e.keyCode];

  if (key != undefined) {
    game.inputState.buttons[key] = true;
  }
});

},{}]},{},[1])