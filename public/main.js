(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

console.log("Cool code!");
var InputComponent = require('./input_component.js').InputComponent;
var RandomInputComponent = require('./input_component.js').RandomInputComponent;
var TurnManager = require('./turn_manager.js');
console.log(InputComponent);
console.log(RandomInputComponent);
console.log(TurnManager);

var NUM_ENEMIES = 4;

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

    this.gameOverText = new PIXI.Text("Game Over! CTRL+R to restart", { font: '38px Arial', fill: 0xdd3863, align: 'center' });

    // Turn tracking + simple hud setup
    this.turnManager = new TurnManager();
    this.turnText = new PIXI.Text(this.turnManager.turnText(), { font: '24px Arial', fill: 0x3f3863, align: 'center' });
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

    // and then we add grid and hud to the stage
    this.stage.addChild(this.grid);
    this.stage.addChildAt(tilingSprite, 0); // bottom position
    this.stage.addChild(this.bottomHud);
  }

  _createClass(Game, [{
    key: 'update',
    value: function update() {
      // check state from turn manager
      this.turnManager.update();
      this.turnText.text = this.turnManager.turnText();
    }
  }, {
    key: 'render',
    value: function render() {
      this.renderer.render(this.stage);
      this.grid.clear();
      this.grid.lineStyle(2, 0x112299, 0.7);

      // Drawing tiles
      this.grid.beginFill(0x998899, 1);
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
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.enemySprites.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2);

          var index = _step2$value[0];
          var enemySprite = _step2$value[1];

          enemySprite._hpHud.clear();
          enemySprite._hpHud.beginFill(0x000000, 1);
          enemySprite._hpHud.drawRect(-(enemySprite.width / 2 + 5), enemySprite.height / 2 - 4, 40, 5);
          enemySprite._hpHud.endFill();
          enemySprite._hpHud.beginFill(0x22CC22, 1);
          enemySprite._hpHud.drawRect(-(enemySprite.width / 2 + 5), enemySprite.height / 2 - 4, Math.max(0, Math.floor(this.enemies[index].currentHP / this.enemies[index].maxHP * 40)), 5);
          enemySprite._hpHud.endFill();
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
      if (this.turnManager.gameState == "PLAYING") {
        // should render based on states
        this.update();
      } else if (this.turnManager.gameState !== "GAMEOVER") {
        this.stage.addChild(this.gameOverText);
        this.turnManager.gameState = "GAMEOVER";
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
      // setup for player
      this.pSprite = new PIXI.Sprite.fromImage('./images/moorawr.png');
      this.player = new GameEntity(3, 3, null, ENTITY_TYPES.UNIT); // null should be NullInput for squad units
      this.pSprite.anchor.set(0.5, 0.5);
      this.pSprite.position = this.player.position;
      // this.beginEntity(this.player, this.player.tilePos);
      this.squad1Sprite = new PIXI.Sprite.fromImage('./images/moorawr.png');
      this.squad1 = new GameEntity(2, 4, null, ENTITY_TYPES.UNIT);
      this.squad1Sprite.anchor.set(0.5, 0.5);
      this.squad1Sprite.position = this.squad1.position;
      // this.beginEntity(this.squad1, this.squad1.tilePos);

      this.playerSquad = new Squad(this.player, this.squad1, null, new InputComponent(this.inputState));
      this.beginEntity(this.playerSquad, this.player.tilePos); // shouldn't use mainUnit tilePos

      // setup for enemeies
      this.enemies = [];
      this.enemySprites = [];
      for (var i = 0; i < NUM_ENEMIES; i++) {
        var enemy = new GameEntity(0 + getRandomInt(0, this.level.numCols - 1 - i), 4 + i, new RandomInputComponent(null));
        var enemySprite = new PIXI.Sprite.fromImage('./images/duck_front.png');
        enemySprite.anchor.set(0.5, 0.5);
        enemySprite.position = enemy.position;
        this.enemies.push(enemy);
        this.enemySprites.push(enemySprite);
        this.beginEntity(enemy, enemy.tilePos);
      };

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.enemySprites[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var enemySprite = _step3.value;

          enemySprite._hpHud = new PIXI.Graphics();
          enemySprite.addChild(enemySprite._hpHud);
          this.stage.addChild(enemySprite);
        }
        // This should happen on squad
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

      this.stage.addChild(this.pSprite);
      this.stage.addChild(this.squad1Sprite);

      // add hp status last
      this.hpStatusHud = new PIXI.Graphics();
      this.pSprite.addChild(this.hpStatusHud);

      // game setup!
      this.turnManager.setCurrentLevel(this.level);
      this.turnManager.addPlayer(this.playerSquad);
      this.turnManager.addEnemies(this.enemies);
      this.loop();
    }

    // this belongs on whatever owns level / game interactions
  }, {
    key: 'beginEntity',
    value: function beginEntity(entity, startTile) {
      if (this.level.canMove(startTile[0], startTile[1])) {
        entity.moveTo(startTile[0], startTile[1], this.level.tileSize);
        // also add unit(s) to level, but this is a poor way to do it
        if (entity.type == ENTITY_TYPES.SQUAD) {
          console.log("unit1", entity.unit1);
          entity.unit1.moveTo(entity.unit1.tilePos[0], entity.unit1.tilePos[1], this.level.tileSize);
        }
      } else {
        throw new RangeError(entity.type + ' outside of valid range');
      }
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

var ENTITY_TYPES = { MOB: "MOB", PLAYER: "PLAYER", UNIT: "UNIT", SQUAD: "SQUAD" };

var Squad = (function () {
  function Squad(mainUnit, unit1, unit2, input) {
    _classCallCheck(this, Squad);

    this.mainUnit = mainUnit;
    this.unit1 = unit1; // grid area is x-1, y+1
    this.unit2 = unit2;
    this.direction = { x: 0, y: 0 };
    this._input = input;
    this.type = ENTITY_TYPES.SQUAD;
    this.isActing = false;
  }

  _createClass(Squad, [{
    key: 'isDead',
    value: function isDead() {
      return false; // No death atm
    }
  }, {
    key: 'update',
    value: function update() {
      return this._input.update(this);
    }
  }, {
    key: 'moveTo',
    value: function moveTo(col, row, tileSize) {
      // always for mainUnit
      // this.mainUnit.tilePos[0] = col, this.mainUnit.tilePos[1] = row;
      // this.mainUnit.position.set((col*tileSize)+tileSize/2,(row*tileSize)+tileSize/2);
      this.mainUnit.moveTo(col, row, tileSize);
      this.unit1.moveTo(col - 1, row + 1, tileSize);
    }
  }]);

  return Squad;
})();

var GameEntity = (function () {
  function GameEntity(col, row, input) {
    var type = arguments.length <= 3 || arguments[3] === undefined ? ENTITY_TYPES.MOB : arguments[3];

    _classCallCheck(this, GameEntity);

    this.tilePos = [col, row];
    this.position = new PIXI.Point(10, 10);
    this.direction = { x: 0, y: 0 };
    this.maxHP = 100;
    this.currentHP = 100;
    this._input = input;
    this.isActing = false;
    this.type = type;
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
    key: 'getActingEntity',
    value: function getActingEntity(entity) {
      if (entity.type == ENTITY_TYPES.SQUAD) {
        return entity.mainUnit;
      } else {
        return entity;
      }
    }
  }, {
    key: 'update',
    value: function update(entity) {
      var _getActingEntity$tilePos = _slicedToArray(this.getActingEntity(entity).tilePos, 2);

      var col = _getActingEntity$tilePos[0];
      var row = _getActingEntity$tilePos[1];
      // need to do this differently for squads
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

},{"./input_component.js":2,"./turn_manager.js":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TurnManager = (function () {
  function TurnManager() {
    _classCallCheck(this, TurnManager);

    this.turn = 0;
    this.increment = 1;
    this.enemies = [];
    this.gameState = "PLAYING";
  }

  _createClass(TurnManager, [{
    key: "addPlayer",
    value: function addPlayer(player) {
      this.player = player;
    }
  }, {
    key: "addEnemy",
    value: function addEnemy(enemy) {
      this.enemies.push(enemy);
    }
  }, {
    key: "addEnemies",
    value: function addEnemies(enemies) {
      this.enemies = enemies;
    }
  }, {
    key: "setCurrentLevel",
    value: function setCurrentLevel(level) {
      // track who is where on level, yeah?
      this.level = level;
    }
  }, {
    key: "update",
    value: function update() {
      this.player.update();
      if (this.player.isDead()) {
        this.gameState = "LOST";
        return;
      }
      if (!this.player.isActing) {
        return;
      }
      var didMove = this.level.update(this.player);

      if (didMove) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.enemies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var enemy = _step.value;

            var didEnemyMove = false,
                attempt = 0;
            do {
              enemy.update();
              didEnemyMove = this.level.update(enemy);
              attempt++;
            } while (!didEnemyMove && attempt < 4);
            enemy.direction.x = 0, enemy.direction.y = 0;
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

        this.turn += this.increment;
      }

      // safe to always set this back
      this.player.isActing = false;
      this.player.direction.x = 0;
      this.player.direction.y = 0;
    }
  }, {
    key: "turnText",
    value: function turnText() {
      return "Turn " + this.turn;
    }
  }]);

  return TurnManager;
})();

module.exports = TurnManager;

},{}]},{},[1])