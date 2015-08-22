console.log("Cool code!");

class Game {
  constructor(){
    this.width = 1000;
    this.height = 800;

    this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
    this.stage = new PIXI.Container();

    let sprite = new PIXI.Sprite.fromImage('./images/test-player.png');
    this.player = new Player(new PIXI.Point(150, 80));
    sprite.anchor.x = 0.5, sprite.anchor.y = 0.5;
    sprite.position = this.player.position;
    this.stage.addChild(sprite);
  }

  update() {
    if (this.player.direction.x != 0) {
      this.player.position.x += 1*this.player.direction.x;
    }
    if (this.player.direction.y != 0) {
      
    }
    this.player.direction.x = 0;
    this.player.direction.y = 0;
  }

  render() {
    this.renderer.render(this.stage);
  }

  loop() {
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
  70: "FOLLOW",
};

window.addEventListener('keydown', function(e) {
  let key = keyConfig[e.keyCode];
  switch(key) {
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