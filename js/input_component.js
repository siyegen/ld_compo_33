class InputComponent {
	constructor(inputState) {
    this.inputState = inputState;
	}
  update(entity) {
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
}

const MOVES = ["UP","RIGHT","DOWN","LEFT"];

class RandomInputComponent {
  constructor(inputState) {
    this.inputState = inputState;
    this.directionMap = {UP: [0,-1], RIGHT: [1,0], DOWN: [0,1], LEFT: [-1,0]};
  }
  update(entity) {
    let direction = this.directionMap[MOVES[this._getRandomInt(0, 4)]]; // 0 up, 1 right, 2 down, 3 left
    console.log("direction", direction);
    entity.direction.x += direction[0];
    entity.direction.y += direction[1];
  }
  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

module.exports = {
  InputComponent: InputComponent,
  RandomInputComponent: RandomInputComponent,
};

