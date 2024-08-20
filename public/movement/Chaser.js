import { Entity } from "./Entity.js";

export class Chaser extends Entity {
  constructor(arenaDims, initialState) {
    super(arenaDims, {
      position: [100, 100],
      size: 15,
      color: [114, 50, 4],
      elementId: "chaser",
      speedMultiplier: 1,
      ...initialState,
    });
  }

  updateChaserPosition(playerPosition) {
    const [spriteLeft, spriteBottom] = playerPosition;
    let [chaserLeft, chaserBottom] = this.state.position;

    let [left, right, up, down] = [false, false, false, false];
    // Chaser moving to player logic
    if (chaserLeft < spriteLeft) {
      right = true;
    } else if (chaserLeft > spriteLeft) {
      left = true;
    }

    if (chaserBottom < spriteBottom) {
      up = true;
    } else if (chaserBottom > spriteBottom) {
      down = true;
    }

    this.move(left, right, up, down);
  }
}
