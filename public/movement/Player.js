import { Entity } from "./Entity.js";
import { AreaAttack } from "./AreaAttack.js";

export class Player extends Entity {
  // defines some inits

  attack = new AreaAttack();
  constructor(arenaDims, initialState) {
    super(arenaDims, {
      position: [400, 400],
      size: 25,
      color: [233, 180, 194],
      elementId: "player",
      speedMultiplier: 2,
      ...initialState,
    });

    this.attack.updatePosition(this.state.position);
  }

  onKeysPressed(keysPressed) {
    let [left, right, up, down] = [false, false, false, false];

    if (keysPressed["ArrowLeft"] || keysPressed["a"] || keysPressed["A"]) {
      left = true;
    }
    if (keysPressed["ArrowRight"] || keysPressed["d"] || keysPressed["D"]) {
      right = true;
    }
    if (keysPressed["ArrowUp"] || keysPressed["w"] || keysPressed["W"]) {
      up = true;
    }
    if (keysPressed["ArrowDown"] || keysPressed["s"] || keysPressed["S"]) {
      down = true;
    }

    this.attack.showOrHide(keysPressed[" "]);

    const position = this.move(left, right, up, down);

    this.attack.updatePosition(position);
  }

  draw() {
    super.draw();
    this.attack?.draw();
  }

  addToBox(box) {
    box.append(this.element, this.attack.element);
  }
}
