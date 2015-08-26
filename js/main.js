console.log("Cool code!");
let InputComponent = require('./input_component.js');

function lerp(v0, v1, t) {
  return (1-t)*v0 + t*v1;
}

function normalAcc(v0, v1) {
  return lerp(v0, v1, .5);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
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

    // used to control whether to udpate
    this.gameState = {shouldUpdate: false};

    // not used atm, was used for control limiting
    this.currentTime = new Date();
    this.prevTime = new Date();

    // Turn tracking + simple hud setup
    this.turn = 0;
    this.turnText = new PIXI.Text("Turn " + this.turn,{font : '24px Arial', fill : 0x3f3863, align : 'center'})
    this.bottomHud = new PIXI.Container();
    this.bottomHud.addChild(this.turnText);
    this.bottomHud.position = new PIXI.Point(this.width - (this.turnText.width+50), this.height - this.turnText.height);
    console.log("hud pos", this.bottomHud.position);

    this.renderer = PIXI.autoDetectRenderer(this.width, this.height);

    // stage holds everything right now, grid draws level
    this.stage = new PIXI.Container();
    this.grid = new PIXI.Graphics();

    // setup for the level, simple and hardcoded atm
    this.level = new Level(this.width, this.height, 50);
    let texture = new PIXI.Texture.fromImage('./images/test-sky.png');
    let tilingSprite = new PIXI.extras.TilingSprite(texture, this.width+300, this.height+300);

    // setup for enemeies
    this.enemies = [];
    this.enemySprites = [];
    for (let i = 0; i < 1; i++) {
      let enemySprite = new PIXI.Sprite.fromImage('./images/duck_front.png');
      let enemy = new Enemy(0+getRandomInt(0,this.level.numCols-1 -  i), 4+i);
      enemySprite.anchor.set(0.5, 0.5);
      enemySprite.position = enemy.position;
      this.enemies.push(enemy);
      this.enemySprites.push(enemySprite);
      // add enemy to the level!
      let enemyStartTile = enemy.tilePos;
      let enemyTile = this.level.tileAtColRow(enemyStartTile[0], enemyStartTile[1]);
      if (enemyTile != undefined && enemyTile == 0) {
        enemy.moveTo(enemyStartTile[0], enemyStartTile[1], this.level.tileSize);
      } else {
        throw new RangeError("Enemy outside of valid range");
      }
    };

    // let enemyStartTile = this.enemy.tilePos;
    // let enemyTile = this.level.tileAtColRow(enemyStartTile[0], enemyStartTile[1]);
    // if (enemyTile != undefined && enemyTile == 0) {
    //   this.enemy.moveTo(enemyStartTile[0], enemyStartTile[1], this.level.tileSize);
    // } else {
    //   throw new RangeError("Enemy outside of valid range");
    // }

    // setup for player
    this.pSprite = new PIXI.Sprite.fromImage('./images/moorawr.png');
    this.player = new Player(3, 3, new InputComponent(this.inputState));
    this.pSprite.anchor.set(0.5, 0.5);
    this.pSprite.position = this.player.position;

    // basic starting point, does a check to make sure it will work
    let startTile = [3,3];
    let tile = this.level.tileAtColRow(startTile[0], startTile[1]);
    if (tile != undefined && tile == 0) {
      this.player.moveTo(startTile[0], startTile[1], this.level.tileSize);
    } else {
      throw new RangeError("Player outside of valid range");
    }

    this.hpStatusHud = new PIXI.Graphics();
    // and then we add grid, sprite, bg, and hud to the stage
    this.stage.addChild(this.grid);
    this.stage.addChild(this.pSprite);
    for (let enemySprite of this.enemySprites) {
      this.stage.addChild(enemySprite);
    }
    this.stage.addChildAt(tilingSprite, 0); // bottom position
    this.stage.addChild(this.bottomHud);
    this.pSprite.addChild(this.hpStatusHud);
  }

  update() {
    this.player.update();
    if (!this.player.isActing) {
      return;
    }
    // needed for move checks
    let didMove = false;
    let [col, row] = this.player.tilePos;
    col += this.player.direction.x;
    row += this.player.direction.y;

    if (this.level.canMove(col, row)) {
      this.player.moveTo(col, row, this.level.tileSize);
      didMove = true;
    }

    // for now, we'll only move enemies when player moved
    if (didMove) {
      for(let enemy of this.enemies) {
        let findMove = true, attempt = 0;
        do {
          let randomTilePos = enemy.updateAI();
          if (this.level.canMove(...randomTilePos)) {
            enemy.moveTo(randomTilePos[0], randomTilePos[1], this.level.tileSize);
            findMove = false;
          }
          attempt++;
        } while(findMove && attempt < 4)
      }
      this.turn++;
      this.turnText.text = "Turn " + this.turn;
    }

    // safe to always set this back
    this.player.isActing = false;
    this.player.direction.x = 0;
    this.player.direction.y = 0;
  }

  render() {
    this.renderer.render(this.stage);
    this.grid.clear();
    this.grid.lineStyle(2, 0x112299, 0.7);

    // Drawing tiles
    this.grid.beginFill(0x998899, 1);
    for (let [index, tile] of this.level.tiles.entries()) {
      if (tile == 1) {
        let [col, row] = this.level.idxToTileCoord(index);
        this.grid.drawRect(col*this.level.tileSize, row*this.level.tileSize, this.level.tileSize, this.level.tileSize);
      }
    }
    this.grid.endFill();
    // Columns
    for (let i = this.level.numCols; i >= 0; i--) {
      this.grid.moveTo(i*this.level.tileSize, 0);
      this.grid.lineTo(i*this.level.tileSize, this.level.height);
    }
    // Rows
    for (let i = this.level.numRows; i >= 0; i--) {
      this.grid.moveTo(0, i*this.level.tileSize)
      this.grid.lineTo(this.level.width, i*this.level.tileSize);
    }
    // draw player hp
    this.hpStatusHud.clear();
    this.hpStatusHud.beginFill(0x000000, 1);
    this.hpStatusHud.drawRect(-(this.pSprite.width/2+5), (this.pSprite.height/2-4), 40, 5);
    this.hpStatusHud.endFill();
    this.hpStatusHud.beginFill(0x22CC22, 1);
    this.hpStatusHud.drawRect(-(this.pSprite.width/2+5), (this.pSprite.height/2-4), Math.max(0,Math.floor((this.player.currentHP/this.player.maxHP)*40)), 5);
    this.hpStatusHud.endFill();
  }

  handleInput() {
    if (this.inputState.buttons.SPACE) { // some nice debug info
      console.log(this.player.tilePos);
      this.player.currentHP -=10;
      console.log("width", this.player.width);
      console.log("numCols", this.level.numCols);
      console.log("index",this.player.tilePos[1]*this.level.numCols + this.player.tilePos[0]);
      console.log(this.level.tileAtColRow(this.player.tilePos[0], this.player.tilePos[1]));
    }
  }

  loop() {
    this.currentTime = new Date();
    this.handleInput(); // only used for debug and global handlers now
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

const MOVES = ["UP","RIGHT","DOWN","LEFT"];

class Enemy {
  constructor(col, row) {
    this.tilePos = [col, row];
    this.position = new PIXI.Point(10,10);
    this.direction = {x: 0, y: 0};
    this.directionMap = {UP: [0,-1], RIGHT: [1,0], DOWN: [0,1], LEFT: [-1,0]};
    this.maxHP = 100;
    this.currentHP = 100;
  }
  updateAI() {
    return this.randomMove();
  }
  moveTo(col, row, tileSize) { // tilePos to PIXI.Point
    this.tilePos[0] = col, this.tilePos[1] = row;
    this.position.set((col*tileSize)+tileSize/2,(row*tileSize)+tileSize/2);
  }
  randomMove() {
    let direction = this.directionMap[MOVES[getRandomInt(0, 4)]]; // 0 up, 1 right, 2 down, 3 left
    return [this.tilePos[0]+direction[0],this.tilePos[1]+direction[1]];
  }
}

class Player {
  constructor(col, row, input) {
    this.tilePos = [col, row];
    this.position = new PIXI.Point(10,10);
    this.direction = {x: 0, y: 0};
    this.isActing = false;
    this._input = input;
    this.maxHP = 100;
    this.currentHP = 100;
  }
  update() {
    this._input.update(this);
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
    // let [col, row] = this.player.tilePos;
    // let didMove = false;
    // if (this.player.direction.x != 0) {
    //   let moveToTile = this.level.tileAtColRow(col+this.player.direction.x, row);
    //   if (moveToTile != undefined && moveToTile != 1) {
    //     this.player.moveTo(col+this.player.direction.x, row, this.level.tileSize);
    //     didMove = true;
    //   }
    // }
  canMove(col, row) {
    let attemptedMoveTile = this.tileAtColRow(col, row);
    if (attemptedMoveTile != undefined && attemptedMoveTile !=1) {
      return true;
    } else {
      return false;
    }
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