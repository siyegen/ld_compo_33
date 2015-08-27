(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

console.log("Cool code!");
var InputComponent = require('./input_component.js').InputComponent;
var RandomInputComponent = require('./input_component.js').RandomInputComponent;
console.log(InputComponent);
console.log(RandomInputComponent);

function lerp(v0, v1, t) {
  return (1 - t) * v0 + t * v1;
}

function normalAcc(v0, v1) {
  return lerp(v0, v1, .5);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
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

    this.gameState = {
      gameOver: false
    };
    this.gameOverText = new PIXI.Text("Game Over! CTRL+R to restart", { font: '38px Arial', fill: 0xdd3863, align: 'center' });
    // not used atm, was used for control limiting
    this.currentTime = new Date();
    this.prevTime = new Date();

    // Turn tracking + simple hud setup
    this.turn = 0;
    this.turnText = new PIXI.Text("Turn " + this.turn, { font: '24px Arial', fill: 0x3f3863, align: 'center' });
    this.bottomHud = new PIXI.Container();
    this.bottomHud.addChild(this.turnText);
    this.bottomHud.position = new PIXI.Point(this.width - (this.turnText.width + 50), this.height - this.turnText.height);
    console.log("hud pos", this.bottomHud.position);

    this.renderer = PIXI.autoDetectRenderer(this.width, this.height);

    // stage holds everything right now, grid draws level
    this.stage = new PIXI.Container();
    this.grid = new PIXI.Graphics();

    // setup for the level, simple and hardcoded atm
    this.level = new Level(this.width, this.height, 50);
    var texture = new PIXI.Texture.fromImage('./images/test-sky.png');
    var tilingSprite = new PIXI.extras.TilingSprite(texture, this.width + 300, this.height + 300);

    // setup for enemeies
    this.enemies = [];
    this.enemySprites = [];
    for (var i = 0; i < 1; i++) {
      var enemySprite = new PIXI.Sprite.fromImage('./images/duck_front.png');
      var enemy = new GameEntity(0 + getRandomInt(0, this.level.numCols - 1 - i), 4 + i, new RandomInputComponent(null));
      enemySprite.anchor.set(0.5, 0.5);
      enemySprite.position = enemy.position;
      this.enemies.push(enemy);
      this.enemySprites.push(enemySprite);
      // add enemy to the level!
      var enemyStartTile = enemy.tilePos;
      var enemyTile = this.level.tileAtColRow(enemyStartTile[0], enemyStartTile[1]);
      if (enemyTile != undefined && enemyTile == 0) {
        enemy.moveTo(enemyStartTile[0], enemyStartTile[1], this.level.tileSize);
      } else {
        throw new RangeError("Enemy outside of valid range");
      }
    };

    // setup for player
    this.pSprite = new PIXI.Sprite.fromImage('./images/moorawr.png');
    this.player = new GameEntity(3, 3, new InputComponent(this.inputState));
    this.pSprite.anchor.set(0.5, 0.5);
    this.pSprite.position = this.player.position;

    // basic starting point, does a check to make sure it will work
    var startTile = [3, 3];
    var tile = this.level.tileAtColRow(startTile[0], startTile[1]);
    if (tile != undefined && tile == 0) {
      this.player.moveTo(startTile[0], startTile[1], this.level.tileSize);
    } else {
      throw new RangeError("Player outside of valid range");
    }

    this.hpStatusHud = new PIXI.Graphics();
    // and then we add grid, sprite, bg, and hud to the stage
    this.stage.addChild(this.grid);
    this.stage.addChild(this.pSprite);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.enemySprites[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var enemySprite = _step.value;

        enemySprite._hpHud = new PIXI.Graphics();
        enemySprite.addChild(enemySprite._hpHud);
        this.stage.addChild(enemySprite);
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

    this.stage.addChildAt(tilingSprite, 0); // bottom position
    this.stage.addChild(this.bottomHud);
    this.pSprite.addChild(this.hpStatusHud);
  }

  _createClass(Game, [{
    key: 'update',
    value: function update() {
      this.player.update();
      if (this.player.isDead()) {
        this.gameState.gameOver = true;
        this.stage.addChild(this.gameOverText);
        return;
      }
      if (!this.player.isActing) {
        return;
      }
      var didMove = this.level.update(this.player);

      // for now, we'll only move enemies when player moved
      // turn manager?
      if (didMove) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.enemies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var enemy = _step2.value;

            var didEnemyMove = false,
                attempt = 0;
            do {
              enemy.update();
              didEnemyMove = this.level.update(enemy);
              attempt++;
            } while (!didEnemyMove && attempt < 4);
            enemy.updateAttack();
            enemy.direction.x = 0, enemy.direction.y = 0;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this.turn++;
        this.turnText.text = "Turn " + this.turn;
      }

      // safe to always set this back
      this.player.isActing = false;
      this.player.direction.x = 0;
      this.player.direction.y = 0;
    }
  }, {
    key: 'render',
    value: function render() {
      this.renderer.render(this.stage);
      this.grid.clear();
      this.grid.lineStyle(2, 0x112299, 0.7);

      // Drawing tiles
      this.grid.beginFill(0x998899, 1);
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.level.tiles.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _step3$value = _slicedToArray(_step3.value, 2);

          var index = _step3$value[0];
          var tile = _step3$value[1];

          if (tile == 1) {
            var _level$idxToTileCoord = this.level.idxToTileCoord(index);

            var _level$idxToTileCoord2 = _slicedToArray(_level$idxToTileCoord, 2);

            var col = _level$idxToTileCoord2[0];
            var row = _level$idxToTileCoord2[1];

            this.grid.drawRect(col * this.level.tileSize, row * this.level.tileSize, this.level.tileSize, this.level.tileSize);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this.grid.endFill();
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
      // draw player hp
      this.hpStatusHud.clear();
      this.hpStatusHud.beginFill(0x000000, 1);
      this.hpStatusHud.drawRect(-(this.pSprite.width / 2 + 5), this.pSprite.height / 2 - 4, 40, 5);
      this.hpStatusHud.endFill();
      this.hpStatusHud.beginFill(0x22CC22, 1);
      this.hpStatusHud.drawRect(-(this.pSprite.width / 2 + 5), this.pSprite.height / 2 - 4, Math.max(0, Math.floor(this.player.currentHP / this.player.maxHP * 40)), 5);
      this.hpStatusHud.endFill();
      // draw enemy hp
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.enemySprites[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var enemySprite = _step4.value;

          enemySprite._hpHud.clear();
          enemySprite._hpHud.beginFill(0x000000, 1);
          enemySprite._hpHud.drawRect(-(enemySprite.width / 2 + 5), enemySprite.height / 2 - 4, 40, 5);
          enemySprite._hpHud.endFill();
          enemySprite._hpHud.beginFill(0x22CC22, 1);
          enemySprite._hpHud.drawRect(-(enemySprite.width / 2 + 5), enemySprite.height / 2 - 4, Math.max(0, Math.floor(this.enemies[0].currentHP / this.enemies[0].maxHP * 40)), 5);
          enemySprite._hpHud.endFill();
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      if (this.gameState.gameOver) {
        return;
      }
    }
  }, {
    key: 'handleInput',
    value: function handleInput() {
      if (this.inputState.buttons.SPACE) {
        // some nice debug info
        console.log(this.player.tilePos);
        this.player.currentHP -= 10;
        console.log("width", this.player.width);
        console.log("numCols", this.level.numCols);
        console.log("index", this.player.tilePos[1] * this.level.numCols + this.player.tilePos[0]);
        console.log(this.level.tileAtColRow(this.player.tilePos[0], this.player.tilePos[1]));
      }
    }
  }, {
    key: 'loop',
    value: function loop() {
      var _this = this;

      this.currentTime = new Date();
      this.handleInput(); // only used for debug and global handlers now
      if (!this.gameState.gameOver) {
        // should render based on states
        this.update();
      }
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

var BasicEnemyAI = (function () {
  function BasicEnemyAI(entity) {
    _classCallCheck(this, BasicEnemyAI);

    this._entity = entity;
  }

  _createClass(BasicEnemyAI, [{
    key: 'update',
    value: function update(level) {
      var adjTiles = level.getAdjTiles.apply(level, _toConsumableArray(this._entity.tilePos));
    }
  }]);

  return BasicEnemyAI;
})();

var GameEntity = (function () {
  function GameEntity(col, row, input) {
    _classCallCheck(this, GameEntity);

    this.tilePos = [col, row];
    this.position = new PIXI.Point(10, 10);
    this.direction = { x: 0, y: 0 };
    this.maxHP = 100;
    this.currentHP = 100;
    this._input = input;
    this.isActing = false;
  }

  _createClass(GameEntity, [{
    key: 'isDead',
    value: function isDead() {
      if (this.currentHP <= 0) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'update',
    value: function update() {
      return this._input.update(this);
    }
  }, {
    key: 'moveTo',
    value: function moveTo(col, row, tileSize) {
      // tilePos to PIXI.Point
      this.tilePos[0] = col, this.tilePos[1] = row;
      this.position.set(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2);
    }
  }]);

  return GameEntity;
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
    key: 'update',
    value: function update(entity) {
      var _entity$tilePos = _slicedToArray(entity.tilePos, 2);

      var col = _entity$tilePos[0];
      var row = _entity$tilePos[1];

      col += entity.direction.x;
      row += entity.direction.y;

      if (this.canMove(col, row)) {
        entity.moveTo(col, row, this.tileSize);
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'canMove',
    value: function canMove(col, row) {
      var attemptedMoveTile = this.tileAtColRow(col, row);
      if (attemptedMoveTile != undefined && attemptedMoveTile != 1) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'getAdjTiles',
    value: function getAdjTiles(col, row) {
      return [];
    }
  }, {
    key: 'tileAtColRow',
    value: function tileAtColRow(col, row) {
      if (col > this.numCols - 1 || col < 0) {
        return undefined;
      }
      return this.tiles[row * this.numCols + col];
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

},{"./input_component.js":2}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputComponent = (function () {
  function InputComponent(inputState) {
    _classCallCheck(this, InputComponent);

    this.inputState = inputState;
  }

  _createClass(InputComponent, [{
    key: "update",
    value: function update(entity) {
      if (this.inputState.buttons.LEFT == true) {
        entity.direction.x = -1;
        this.inputState.buttons.LEFT = false;
        entity.isActing = true;
      } else if (this.inputState.buttons.RIGHT == true) {
        entity.direction.x = 1;
        this.inputState.buttons.RIGHT = false;
        entity.isActing = true;
      }

      if (this.inputState.buttons.DOWN == true) {
        entity.direction.y = 1;
        this.inputState.buttons.DOWN = false;
        entity.isActing = true;
      } else if (this.inputState.buttons.UP == true) {
        entity.direction.y = -1;
        this.inputState.buttons.UP = false;
        entity.isActing = true;
      }
    }
  }]);

  return InputComponent;
})();

var MOVES = ["UP", "RIGHT", "DOWN", "LEFT"];

var RandomInputComponent = (function () {
  function RandomInputComponent(inputState) {
    _classCallCheck(this, RandomInputComponent);

    this.inputState = inputState;
    this.directionMap = { UP: [0, -1], RIGHT: [1, 0], DOWN: [0, 1], LEFT: [-1, 0] };
  }

  _createClass(RandomInputComponent, [{
    key: "update",
    value: function update(entity) {
      var direction = this.directionMap[MOVES[this._getRandomInt(0, 4)]]; // 0 up, 1 right, 2 down, 3 left
      console.log("direction", direction);
      entity.direction.x += direction[0];
      entity.direction.y += direction[1];
    }
  }, {
    key: "_getRandomInt",
    value: function _getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }]);

  return RandomInputComponent;
})();

module.exports = {
  InputComponent: InputComponent,
  RandomInputComponent: RandomInputComponent
};

},{}]},{},[1])