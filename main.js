(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
      if (this.player.direction.x != 0) {
        this.player.position.x += 1 * this.player.direction.x;
      }
      if (this.player.direction.y != 0) {
        this.player.position.y += 1 * this.player.direction.y;
      }
      this.player.direction.x = 0;
      this.player.direction.y = 0;
    }
  }, {
    key: 'render',
    value: function render() {
      this.grid.clear();
      this.grid.lineStyle(2, 0x886622, 0.8);
      for (var i = 10; i >= 0; i--) {
        this.grid.moveTo(i * 50, 0);
        this.grid.lineTo(i * 50, this.height);
      }
      for (var i = 10; i >= 0; i--) {
        this.grid.moveTo(0, i * 50);
        this.grid.lineTo(this.width, i * 50);
      }
      this.renderer.render(this.stage);
    }
  }, {
    key: 'handleInput',
    value: function handleInput() {
      if (this.inputState.buttons.LEFT == true) {
        this.player.direction.x = -1;
      } else if (this.inputState.buttons.RIGHT == true) {
        this.player.direction.x = 1;
      } else {
        this.player.direction.x = 0;
      }
      if (this.inputState.buttons.DOWN == true) {
        this.player.direction.y = 1;
      } else if (this.inputState.buttons.UP == true) {
        this.player.direction.y = -1;
      } else {
        this.player.direction.y = 0;
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

var Level = function Level() {
  _classCallCheck(this, Level);
};

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