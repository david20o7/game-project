import { Entity } from "./Entity.js";
import { HealthBar } from "./HealthBar.js";

export class Chaser extends Entity {
  hasImmunity = false;

  constructor(arenaDims, initialState) {
    super(arenaDims, {
      position: [100, 100],
      size: 15,
      color: [114, 50, 4],
      elementId: "chaser",
      speed: 1,
      ...initialState,
    });

    this.healthBar = new HealthBar(50, this.state.size);
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

  chaserDead() {
    return this.healthBar.health <= 0;
  }

  getHit() {
    if (this.hasImmunity === false) {
      this.healthBar.takeDamage(25);

      setTimeout(() => {
        this.hasImmunity = false;
      }, 500);

      this.hasImmunity = true;
    }
  }

  draw() {
    super.draw();
    this.healthBar.draw();
  }
}
