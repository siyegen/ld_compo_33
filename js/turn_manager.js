const ENTITY_TYPES = {MOB:"MOB",PLAYER:"PLAYER",UNIT:"UNIT",SQUAD:"SQUAD"};

class TurnManager {
  constructor() {
    this.turn = 0;
    this.increment = 1;
    this.enemies = [];
    this.gameState = "PLAYING";
  }
  addPlayer(player) {
    this.player = player;
  }
  addEnemy(enemy) {
    this.enemies.push(enemy);
  }
  addEnemies(enemies) {
    this.enemies = enemies;
  }
  setCurrentLevel(level) {
    // track who is where on level, yeah?
    this.level = level;
  }
  update() {
    this.player.update();
    if (this.player.isDead()) {
      this.gameState = "LOST";
      return;
    }
    if (!this.player.isActing) {
      return;
    }
    // let didMove = this.level.update(this.player);
    let didMove = this._updateMove(this.player);

    if (didMove) {
      for(let enemy of this.enemies) {
        let didEnemyMove = false, attempt = 0;
        do {
          enemy.update();
          didEnemyMove = this.level.update(enemy);
          attempt++;
        } while(!didEnemyMove && attempt < 4)
        enemy.direction.x = 0, enemy.direction.y = 0;
      }
      this.turn += this.increment;
    }

    // safe to always set this back
    this.player.isActing = false;
    this.player.direction.x = 0;
    this.player.direction.y = 0;
  }
  _updateMove (entity) {
    console.log("moving from: ", entity.currentTile(), entity.direction);
    let [tryCol, tryRow] = entity.currentTile();
    tryCol += entity.direction.x;
    tryRow += entity.direction.y;
    console.log("trying to move to: ", tryCol, tryRow);

    // now check move and then move, with entity and level
    // check if form can snap back
    return this.checkAndMove(tryCol, tryRow, entity, this.level);

    // if (this.canMove(col, row, entity)) {
    //   entity.moveTo(col, row, this.tileSize);
    //   return true;
    // } else {
    //   return false;
    // }
  }
  checkAndMove(col, row, entity, level) {
    if (entity.type == ENTITY_TYPES.SQUAD) {
      return this._canMoveSquad(col, row, entity, level);
    } else {
      return this._canMoveSingle(col, row);
    }
  }
  // _canMoveSingle(col, row) {
  //   let attemptedMoveTile = this.tileAtColRow(col, row);
  //   if (attemptedMoveTile != undefined && attemptedMoveTile !=1) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  _canMoveSquad(col, row, squad, level) {
    // first check if main can move, then check if sub can move or if needs to "break form"
    let canMove = false;
    let attemptedMoveTile = level.tileAtColRow(col, row);
    if (attemptedMoveTile != undefined && attemptedMoveTile !=1) { // main unit can move, check squad
      canMove = true;
      squad.mainUnit.moveTo(col, row, level.tileSize);
      attemptedMoveTile = level.tileAtColRow(col+squad.currentForm[0][0], row+squad.currentForm[0][1]);
      if (attemptedMoveTile != undefined && attemptedMoveTile !=1) { // main unit can move, check squad
        // squad.unit1.moveTo(col+squad.currentForm[0][0], row+squad.currentForm[0][1], level.tileSize);
        // noop
      } else {
        squad.breakForm();// first spot behind main, check first
      }
      squad.unit1.moveTo(col+squad.currentForm[0][0], row+squad.currentForm[0][1], level.tileSize);
    }
    return canMove;
  }
  turnText() {
    return "Turn " + this.turn;
  }
}

module.exports = TurnManager;