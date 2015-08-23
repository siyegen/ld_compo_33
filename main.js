(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

    this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
    this.stage = new PIXI.Container();

    this.grid = new PIXI.Graphics();

    this.level = new Level(this.width, this.height, 50);

    var texture = new PIXI.Texture.fromImage('./images/test-sky.png');
    var tilingSprite = new PIXI.extras.TilingSprite(texture, this.width + 300, this.height + 300);

    var sprite = new PIXI.Sprite.fromImage('./images/moorawr.png');
    this.player = new Player(new PIXI.Point(150, 80));
    sprite.anchor.x = 0.5, sprite.anchor.y = 0.5;
    sprite.position = this.player.position;
    this.stage.addChild(this.grid);
    this.stage.addChild(sprite);
    this.stage.addChildAt(tilingSprite, 0);
  }

  _createClass(Game, [{
    key: 'update',
    value: function update() {
      // if (this.player.direction.x != 0) {
      //   this.player.position.x += 1*this.player.direction.x;
      // }
      // if (this.player.direction.y != 0) {
      //   this.player.position.y += 1*this.player.direction.y;
      // }
      // this.player.direction.x = 0;
      // this.player.direction.y = 0;
    }
  }, {
    key: 'render',
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
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
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
    key: 'handleInput',
    value: function handleInput() {
      if (this.inputState.buttons.LEFT == true) {
        // this.player.direction.x = -1;
      } else if (this.inputState.buttons.RIGHT == true) {
          // this.player.direction.x = 1;
        } else {
            this.player.direction.x = 0;
          }
      if (this.inputState.buttons.DOWN == true) {
        // this.player.direction.y = 1;
      } else if (this.inputState.buttons.UP == true) {
          // this.player.direction.y = -1;
        } else {
            this.player.direction.y = 0;
          }

      if (this.inputState.buttons.LEFT_CLICK == true) {
        this.player.moveTo = this.inputState.position;
        this.inputState.buttons.LEFT_CLICK = false;
      }
    }
  }, {
    key: 'loop',
    value: function loop() {
      var _this = this;

      this.handleInput();
      this.update();
      this.render();
      requestAnimationFrame(function () {
        return _this.loop();
      });
    }
  }, {
    key: 'start',
    value: function start() {
      console.log("Start game");
      document.body.appendChild(this.renderer.view);
      this.loop();
    }
  }]);

  return Game;
})();

var Player = function Player(position) {
  _classCallCheck(this, Player);

  this.position = position;
  this.direction = { x: 0, y: 0 };
};

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
    key: 'generate',
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
    key: 'idxToTileCoord',
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