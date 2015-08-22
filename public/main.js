(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.log("Cool code!");

var Game = (function () {
  function Game() {
    _classCallCheck(this, Game);

    this.width = 1000;
    this.height = 800;

    this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
    this.stage = new PIXI.Container();

    var sprite = new PIXI.Sprite.fromImage('./images/test-player.png');
    this.player = new Player(new PIXI.Point(150, 80));
    sprite.anchor.x = 0.5, sprite.anchor.y = 0.5;
    sprite.position = this.player.position;
    this.stage.addChild(sprite);
  }

  _createClass(Game, [{
    key: "update",
    value: function update() {
      if (this.player.direction.x != 0) {
        this.player.position.x += 1 * this.player.direction.x;
      }
      if (this.player.direction.y != 0) {}
      this.player.direction.x = 0;
      this.player.direction.y = 0;
    }
  }, {
    key: "render",
    value: function render() {
      this.renderer.render(this.stage);
    }
  }, {
    key: "loop",
    value: function loop() {
      var _this = this;

      this.update();
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

var Player = function Player(position) {
  _classCallCheck(this, Player);

  this.position = position;
  this.direction = { x: 0, y: 0 };
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
  90: "ZOOM",
  70: "FOLLOW"
};

window.addEventListener('keydown', function (e) {
  var key = keyConfig[e.keyCode];
  switch (key) {
    case "FOLLOW":
      break;
    case "UP":
      game.player.direction.y = -1;
      break;
    case "DOWN":
      game.player.direction.y = 1;
      break;
    case "LEFT":
      game.player.direction.x = -1;
      break;
    case "RIGHT":
      game.player.direction.x = 1;
      break;
  }
});

},{}]},{},[1])