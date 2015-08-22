console.log("Cool code!");

function lerp(v0, v1, t) {
  return (1-t)*v0 + t*v1;
}

function normalAcc(v0, v1) {
  return lerp(v0, v1, .5);
}

class Game {
  constructor(){
    this.width = 1000;
    this.height = 800;

    this.inputState = {
      moving: false,
      buttons: {
        RIGHT: false,
        LEFT: false,
      },
    };

    this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
    this.stage = new PIXI.Container();

    this.grid = new PIXI.Graphics();

    let texture = new PIXI.Texture.fromImage('./images/test-sky.png');
    let tilingSprite = new PIXI.extras.TilingSprite(texture, this.width+300, this.height+300);

    let sprite = new PIXI.Sprite.fromImage('./images/moorawr.png');
    this.player = new Player(new PIXI.Point(150, 80));
    sprite.anchor.x = 0.5, sprite.anchor.y = 0.5;
    sprite.position = this.player.position;
    this.stage.addChild(this.grid);
    this.stage.addChild(sprite);
    this.stage.addChildAt(tilingSprite, 0);
  }

  update() {
    if (this.player.direction.x != 0) {
      this.player.position.x += 1*this.player.direction.x;
    }
    if (this.player.direction.y != 0) {
      this.player.position.y += 1*this.player.direction.y;
    }
    this.player.direction.x = 0;
    this.player.direction.y = 0;
  }

  render() {
    this.grid.clear();
    this.grid.lineStyle(2, 0x886622, 0.8);
    for (let i = 10; i >= 0; i--) {
      this.grid.moveTo(i*50, 0);
      this.grid.lineTo(i*50, this.height);
    }
    for (let i = 10; i >= 0; i--) {
      this.grid.moveTo(0, i*50);
      this.grid.lineTo(this.width, i*50);
    }
    this.renderer.render(this.stage);
  }

  handleInput() {
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

  loop() {
    this.handleInput();
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  }

  start () {
    console.log("Start game");
    document.body.appendChild(this.renderer.view);
    this.loop();
  }
}

class Player {
  constructor(position) {
    this.position = position;
    this.direction = {x: 0, y: 0};
  }
}

class Level {

}

let game = new Game();
game.start();

let keyConfig = {
  65: "LEFT",
  83: "DOWN",
  68: "RIGHT",
  87: "UP",
  37: "CAMLEFT",
  39: "CAMRIGHT",
  32: "SPACE",
  90: "ZOOM",
};

window.addEventListener('keyup', function(e) {
  let key = keyConfig[e.keyCode];

  if (key != undefined) {
    game.inputState.buttons[key] = false;
  }
});

window.addEventListener('keydown', function(e) {
  let key = keyConfig[e.keyCode];

  if (key != undefined) {
    game.inputState.buttons[key] = true;
  }

});