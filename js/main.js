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

    this.level = new Level(this.width, this.height, 50);

    let texture = new PIXI.Texture.fromImage('./images/test-sky.png');
    let tilingSprite = new PIXI.extras.TilingSprite(texture, this.width+300, this.height+300);

    let sprite = new PIXI.Sprite.fromImage('./images/moorawr.png');
    this.player = new Player(3, 3);
    sprite.anchor.x = 0.5, sprite.anchor.y = 0.5;
    sprite.position = this.player.position;

    let startTile = [3,3];
    let tile = this.level.tileAtColRow(startTile[0], startTile[1]);
    if (tile != undefined && tile == 0) {
      this.player.moveTo(startTile[0], startTile[1], this.level.tileSize);
    } else {
      throw new RangeError("Player outside of valid range");
    }
    this.stage.addChild(this.grid);
    this.stage.addChild(sprite);
    this.stage.addChildAt(tilingSprite, 0);
  }

  update() {
    let [col, row] = this.player.tilePos;
    if (this.player.direction.x != 0) {
      let moveToTile = this.level.tileAtColRow(col+this.player.direction.x, row);
      if (moveToTile != undefined && moveToTile != 1) {
        console.log("Moving!", moveToTile);
        this.player.moveTo(col+this.player.direction.x, row, this.level.tileSize);
      }
    }
    if (this.player.direction.y != 0) {
      let moveToTile = this.level.tileAtColRow(col, row+this.player.direction.y);
      if (moveToTile != undefined && moveToTile != 1) {
        console.log("Moving!", moveToTile);
        this.player.moveTo(col, row+this.player.direction.y, this.level.tileSize);
      }
    }
    this.player.direction.x = 0;
    this.player.direction.y = 0;
  }

  render() {
    this.renderer.render(this.stage);
    this.grid.clear();
    this.grid.lineStyle(2, 0x112233, 0.9);
    // Columns
    for (let i = this.level.numCols; i >= 0; i--) {
      this.grid.moveTo(i*this.level.tileSize, 0);
      this.grid.lineTo(i*this.level.tileSize, this.level.height);
    }
    // Rows
    for (let i = this.level.numRows; i >= 0; i--) {
      this.grid.moveTo(0, i*this.level.tileSize);
      this.grid.lineTo(this.level.width, i*this.level.tileSize);
    }

    this.grid.beginFill(0x333333, 1);
    for (let [index, tile] of this.level.tiles.entries()) {
      if (tile == 1) {
        let [col, row] = this.level.idxToTileCoord(index);
        this.grid.drawRect(col*this.level.tileSize, row*this.level.tileSize, this.level.tileSize, this.level.tileSize);
      }
    }
    this.grid.endFill();
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
      console.log("down!");
      this.player.direction.y = 1;
    } else if (this.inputState.buttons.UP == true) {
      this.player.direction.y = -1;
    } else {
      this.player.direction.y = 0;
    }

    if (this.inputState.buttons.SPACE) {
      console.log(this.player.tilePos);
      console.log("numCols", this.level.numCols);
      console.log("index",this.player.tilePos[1]*this.level.numCols + this.player.tilePos[0]);
      console.log(this.level.tileAtColRow(this.player.tilePos[0], this.player.tilePos[1]));
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
  constructor(col, row) {
    this.tilePos = [col, row];
    this.position = new PIXI.Point(10,10);
    this.direction = {x: 0, y: 0};
  }
  moveTo(col, row, tileSize) { // tilePos to PIXI.Point
    this.tilePos[0] = col, this.tilePos[1] = row;
    this.position.set((col*tileSize)+tileSize/2,(row*tileSize)+tileSize/2);
  }
}

class Level {
  constructor(width, height, tileSize) {
    this.width = width;
    this.height = height;

    this.tileSize = tileSize;
    this.tiles = [];

    this.numCols = Math.floor(this.width / this.tileSize);
    this.numRows = Math.floor(this.height / this.tileSize);
    this.generate();
  }
  generate() {
    let number = this.numCols * this.numRows;
    for (var i = 0; i < number; i++) {
      this.tiles.push(0);
    };

    this.tiles[6] = 1;
    this.tiles[21] = 1;
    console.log("moo gen");
  }
  tileAtColRow(col, row) {
    if (col > this.numCols-1 || col < 0) {
      return undefined;
    }
    return this.tiles[row*this.numCols + col]
  }
  idxToTileCoord(index) {
    return [index%this.numCols, Math.trunc(index/this.numCols)];
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
};

window.addEventListener('click', function(e) {
  let point = new PIXI.Point(e.clientX, e.clientY);
  console.log("point!", point)
  game.inputState.buttons['LEFT_CLICK'] = true;
  game.inputState.position = point;
});

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