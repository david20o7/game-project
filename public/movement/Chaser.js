import { Entity } from "./Entity.js";
import { Health } from "./Health.js";

export class Chaser extends Entity {
  constructor(arenaDims, initialState) {
    super(arenaDims, {
      position: [100, 100],
      size: 15,
      color: [114, 50, 4],
      elementId: "chaser",
      speed: 1,
      ...initialState,
    });

    this.healthBar = new Health(50, this.state.size);
  }

  _initEntity() {
    super._initEntity();
    this.element.append(this.healthBar.healthContainer);
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

  getHit() {
    this.healthBar.takeDamage(5);
  }

  draw() {
    super.draw();
    this.healthBar.draw();
  }
}
