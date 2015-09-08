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
    let didMove = this.level.update(this.player);

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
  turnText() {
    return "Turn " + this.turn;
  }
}

module.exports = TurnManager;