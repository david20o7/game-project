import { Entity } from "./Entity.js";
import { HealthBar } from "./HealthBar.js";

const spritesIdle = [
  "sprites/slime-idle-0.png",
  "sprites/slime-idle-1.png",
  "sprites/slime-idle-2.png",
  "sprites/slime-idle-3.png",
];
const spritesMove = [
  "sprites/slime-move-0.png",
  "sprites/slime-move-1.png",
  "sprites/slime-move-2.png",
  "sprites/slime-move-3.png",
];

export class Chaser extends Entity {
  hasImmunity = false;
  isGoingRight = false;

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
    this.moveAnimation();
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

    this.changeDirection(right);
    this.move(left, right, up, down);
  }

  chaserDead() {
    return this.healthBar.health <= 0;
  }

  // gives immunity to chaser for 0.5s every time it is hit
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

  moveAnimation() {
    this.animateSquare(spritesMove);
  }

  idleAnimation() {
    this.animateSquare(spritesIdle);
  }

  changeDirection(isGoingRight) {
    this.goingRight = isGoingRight;

    if (this.goingRight === true) {
      this.element.style.setProperty("transform", "scaleX(-1)");
    } else {
      this.element.style.removeProperty("transform");
    }
  }

  remove() {
    this.element.remove();
    this.stopAnimation();
  }
}
