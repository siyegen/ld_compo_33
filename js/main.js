console.log("Cool code!");
let InputComponent = require('./input_component.js').InputComponent;
let RandomInputComponent = require('./input_component.js').RandomInputComponent;
let TurnManager = require('./turn_manager.js');
console.log(InputComponent);
console.log(RandomInputComponent);
console.log(TurnManager);

const NUM_ENEMIES = 4;

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

    this.gameOverText = new PIXI.Text("Game Over! CTRL+R to restart",{font : '38px Arial', fill : 0xdd3863, align : 'center'})

    // Turn tracking + simple hud setup
    this.turnManager = new TurnManager();
    this.turnText = new PIXI.Text(this.turnManager.turnText(),{font : '24px Arial', fill : 0x3f3863, align : 'center'})
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

    // and then we add grid and hud to the stage
    this.stage.addChild(this.grid);
    this.stage.addChildAt(tilingSprite, 0); // bottom position
    this.stage.addChild(this.bottomHud);
  }

  update() {
    // check state from turn manager
    this.turnManager.update();
    this.turnText.text = this.turnManager.turnText();
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
    // draw enemy hp
    for (let [index, enemySprite] of this.enemySprites.entries()) {
      enemySprite._hpHud.clear();
      enemySprite._hpHud.beginFill(0x000000, 1);
      enemySprite._hpHud.drawRect(-(enemySprite.width/2+5), (enemySprite.height/2-4), 40, 5);
      enemySprite._hpHud.endFill();
      enemySprite._hpHud.beginFill(0x22CC22, 1);
      enemySprite._hpHud.drawRect(-(enemySprite.width/2+5), (enemySprite.height/2-4), Math.max(0,Math.floor((this.enemies[index].currentHP/this.enemies[index].maxHP)*40)), 5);
      enemySprite._hpHud.endFill();
    }
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
    if (this.turnManager.gameState == "PLAYING") { // should render based on states
      this.update();
    } else if(this.turnManager.gameState !== "GAMEOVER") {
      this.stage.addChild(this.gameOverText);
      this.turnManager.gameState = "GAMEOVER";
    }
    this.render();
    requestAnimationFrame(() => this.loop());
  }

  start () {
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
    for (let i = 0; i < NUM_ENEMIES; i++) {
      let enemy = new GameEntity(0+getRandomInt(0,this.level.numCols-1 -  i), 4+i, new RandomInputComponent(null));
      let enemySprite = new PIXI.Sprite.fromImage('./images/duck_front.png');
      enemySprite.anchor.set(0.5, 0.5);
      enemySprite.position = enemy.position;
      this.enemies.push(enemy);
      this.enemySprites.push(enemySprite);
      this.beginEntity(enemy, enemy.tilePos);
    };

    for (let enemySprite of this.enemySprites) {
      enemySprite._hpHud = new PIXI.Graphics();
      enemySprite.addChild(enemySprite._hpHud);
      this.stage.addChild(enemySprite);
    }
    // This should happen on squad
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
  beginEntity(entity, startTile) {
    if (this.level.canMove(startTile[0], startTile[1])) {
      entity.moveTo(startTile[0], startTile[1], this.level.tileSize);
      // also add unit(s) to level, but this is a poor way to do it
      if (entity.type == ENTITY_TYPES.SQUAD) {
        console.log("unit1", entity.unit1);
        entity.unit1.moveTo(entity.unit1.tilePos[0], entity.unit1.tilePos[1], this.level.tileSize);
      }
    } else {
      throw new RangeError(`${entity.type} outside of valid range`);
    }
  }
}

class BasicEnemyAI {
  constructor(entity) {
    this._entity = entity;
  }
  update(level) {
    let adjTiles = level.getAdjTiles(...this._entity.tilePos);
  }
}

const ENTITY_TYPES = {MOB:"MOB",PLAYER:"PLAYER",UNIT:"UNIT",SQUAD:"SQUAD"};

class Squad {
  constructor(mainUnit, unit1, unit2, input) {
    this.mainUnit = mainUnit;
    this.unit1 = unit1; // grid area is x-1, y+1
    this.unit2 = unit2;
    this.direction = {x: 0, y:0};
    this._input = input;
    this.type = ENTITY_TYPES.SQUAD;
    this.isActing = false;
  }
  isDead() {
    return false; // No death atm
  }
  update() {
    return this._input.update(this);
  }
  moveTo(col, row, tileSize) { // always for mainUnit
    // this.mainUnit.tilePos[0] = col, this.mainUnit.tilePos[1] = row;
    // this.mainUnit.position.set((col*tileSize)+tileSize/2,(row*tileSize)+tileSize/2);
    this.mainUnit.moveTo(col, row, tileSize);
    this.unit1.moveTo(col-1, row+1, tileSize);
  }
}

class GameEntity {
  constructor(col, row, input, type=ENTITY_TYPES.MOB) {
    this.tilePos = [col, row];
    this.position = new PIXI.Point(10,10);
    this.direction = {x: 0, y: 0};
    this.maxHP = 100;
    this.currentHP = 100;
    this._input = input;
    this.isActing = false;
    this.type = type;
  }
  isDead() {
    if (this.currentHP <=0) {
      return true;
    } else {
      return false;
    }
  }
  update() {
    return this._input.update(this);
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
  getActingEntity(entity) {
    if (entity.type == ENTITY_TYPES.SQUAD) {
      return entity.mainUnit;
    } else {
      return entity;
    }
  }
  update (entity) {
    let [col, row] = this.getActingEntity(entity).tilePos; // need to do this differently for squads
    col += entity.direction.x;
    row += entity.direction.y;

    if (this.canMove(col, row)) {
      entity.moveTo(col, row, this.tileSize);
      return true;
    } else {
      return false;
    }
  }
  canMove(col, row) {
    let attemptedMoveTile = this.tileAtColRow(col, row);
    if (attemptedMoveTile != undefined && attemptedMoveTile !=1) {
      return true;
    } else {
      return false;
    }
  }
  getAdjTiles(col, row) {
    return [];
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