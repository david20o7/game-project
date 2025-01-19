import { Entity } from "./Entity.js";
import { HealthBar } from "./HealthBar.js";

// enemy moving frames
const spritesMove = [
  "sprites/slime-move-0.png",
  "sprites/slime-move-1.png",
  "sprites/slime-move-2.png",
  "sprites/slime-move-3.png",
];

export class Chaser extends Entity {
  hasImmunity = false;
  isGoingRight = false;

  tolerance = 20;

  constructor(arenaDims, initialState) {
    // initialises the character
    super(arenaDims, {
      position: [100, 100],
      size: 15,
      elementId: "chaser",
      speed: 1,
      ...initialState,
    });

    this.healthBar = new HealthBar(50, this.state.size);
  }
  // initialises the enemies healthBar and begins the moveAnimation
  _initEntity() {
    super._initEntity();
    this.element.append(this.healthBar.healthContainer);
    this.moveAnimation();
  }

  // determine which direction to move at
  updateChaserPosition(playerPosition) {
    const [spriteLeft, spriteBottom] = playerPosition;
    let [chaserLeft, chaserBottom] = this.state.position;

    let [left, right, up, down] = [false, false, false, false];
    // Chaser moving to player logic
    // tolerance ensure the chaser will not be directly beneath the player as it causes a sprite bug
    if (spriteLeft - chaserLeft > this.tolerance) {
      right = true;
    } else if (chaserLeft - spriteLeft > this.tolerance) {
      left = true;
    }
    if (spriteBottom - chaserBottom > this.tolerance) {
      up = true;
    } else if (chaserBottom - spriteBottom > this.tolerance) {
      down = true;
    }
    // change direction if moving left or right
    if (left !== right) {
      this.changeDirection(right);
    }

    this.move(left, right, up, down);
  }
  // check if chaser is dead
  chaserDead() {
    return this.healthBar.health <= 0;
  }

  // gives immunity to chaser for 0.5s every time it is hit
  // deals 25 damage to chaser when hit
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
  // gets the chaser's movement animation
  moveAnimation() {
    this.animateSquare(spritesMove);
  }

  // method used to invert the html element so the sprite and the directions line up
  // because the healthBar is inside the sprite it also gets inverted, so it is inverted again so it faces the same direction
  changeDirection(isGoingRight) {
    this.goingRight = isGoingRight;

    if (this.goingRight === true) {
      this.element.style.setProperty("transform", "scaleX(-1)");
      this.healthBar.healthContainer.style.setProperty("transform", "scaleX(-1)");
    } else {
      this.element.style.removeProperty("transform");
      this.healthBar.healthContainer.style.removeProperty("transform");
    }
  }

  // removes the chaser from the area and stops its animation
  remove() {
    this.element.remove();
    this.stopAnimation();
  }
}
