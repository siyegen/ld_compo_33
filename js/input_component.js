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

module.exports = InputComponent;