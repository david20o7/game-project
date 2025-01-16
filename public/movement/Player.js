import { Entity } from "./Entity.js";
import { AreaAttack } from "./AreaAttack.js";
import { Stamina } from "./Stamina.js";
import { HealthBar } from "./HealthBar.js";

const wizardMove = [
  "sprites/wizard/walk-0.png",
  "sprites/wizard/walk-1.png",
  "sprites/wizard/walk-2.png",
  "sprites/wizard/walk-3.png",
  "sprites/wizard/walk-4.png",
  "sprites/wizard/walk-5.png",
  "sprites/wizard/walk-6.png",
  "sprites/wizard/walk-7.png",
  "sprites/wizard/walk-8.png",
  "sprites/wizard/walk-9.png",
];

const wizardStill = ["sprites/wizard/walk-0.png", "sprites/wizard/walk-9.png"];

const wizardAttack = [
  "sprites/wizard/attack-5.png",
  "sprites/wizard/attack-6.png",
  "sprites/wizard/attack-7.png",
  "sprites/wizard/attack-8.png",
  "sprites/wizard/attack-9.png",
  "sprites/wizard/walk-0.png",
];

const MOVING = "moving";
const IDLE = "idle";
const ATTACKING = "attacking";
const SPRINTING = "sprint";

export class Player extends Entity {
  // defines some inits
  hasImmunity = false;
  isGoingLeft = false;

  animationState = "idle";

  attack = new AreaAttack();
  stamina = new Stamina();
  healthBar;
  // objects that define the player
  constructor(arenaDims, initialState) {
    super(arenaDims, {
      position: [400, 400],
      size: 75,
      // color: [233, 180, 194],
      color: null,
      elementId: "player",
      speed: 2,
      walkingSpeed: 2,
      sprintingSpeed: 7,
      maxHealth: 100,

      ...initialState,
    });

    this.attack.updatePosition(this.state.position);

    this.healthBar = new HealthBar(this.state.maxHealth, this.state.size);
  }

  _initEntity() {
    super._initEntity();
    this.element.append(this.healthBar.healthContainer);
    this.idleAnimation();
    this.healthBar.takeDamage(25);
  }

  // movement logic
  onKeysPressed(keysPressed) {
    let [left, right, up, down] = [false, false, false, false];

    if (this.attack.isAttacking()) {
      return;
    }

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

    // attack logic
    if (keysPressed[" "] && !this.attack.isAttacking() && this.animationState !== ATTACKING) {
      this.attack.doAttack();
      if (this.animationState !== ATTACKING) {
        this.attackAnimation();
        this.animationState = ATTACKING;
        return;
      }
    }

    const trySprint = !!keysPressed["Shift"] && Object.keys(keysPressed).length > 1;
    this.sprint(trySprint);

    const position = this.move(left, right, up, down);

    this.attack.updatePosition(position);

    const standingStill = !left && !right && !up && !down;

    if (standingStill && this.animationState !== IDLE) {
      this.idleAnimation();
      this.animationState = IDLE;
    } else if (
      !standingStill &&
      this.animationState !== MOVING &&
      this.animationState !== SPRINTING
    ) {
      this.moveAnimation();
      this.animationState = MOVING;
    }
    if (left !== right) {
      this.changeDirection(left);
    }
  }
  // if user is sprinting and has enough stamina, the speed is set to sprinting speed
  // otherwise, the speed is set to walking speed.
  sprint(trySprinting) {
    this.stamina.useStamina(trySprinting);
    const canSprint = this.stamina.canUseStamina();

    const shouldSprint = canSprint && trySprinting;
    this.updateSpeed(shouldSprint ? this.state.sprintingSpeed : this.state.walkingSpeed);

    if (shouldSprint && this.animationState !== SPRINTING) {
      this.sprintAnimation();
      this.animationState = SPRINTING;
    } else if (!shouldSprint && this.animationState === SPRINTING) {
      this.moveAnimation();
      this.animationState = MOVING;
    }
  }

  getHit() {
    if (this.hasImmunity === false) {
      this.healthBar.takeDamage(25);

      setTimeout(() => {
        this.hasImmunity = false;
        this._updateEntityFlashing(false);
      }, 2000);

      this.hasImmunity = true;
      this._updateEntityFlashing(true);
    }
  }

  draw() {
    super.draw();
    this.attack.draw();
    this.stamina.draw();
    this.healthBar.draw();
  }

  addToBox(box) {
    box.append(this.element, this.attack.element);
  }

  resetPlayer() {
    this.state.position = [400, 400];
    this.healthBar.resetHealth();
    this.stamina.resetStamina();
    this.draw();
  }

  isDead() {
    return this.healthBar.getHealth() <= 0;
  }

  getStaminaData() {
    return {
      value: this.stamina.getStamina(),
      colour: this.stamina.getStaminaColour(),
    };
  }
  moveAnimation() {
    console.log("move");
    this.animateSquare(wizardMove);
  }

  attackAnimation() {
    this.animateSquare(wizardAttack, 100, true);
  }

  idleAnimation() {
    this.animateSquare(wizardStill, 500);
  }

  sprintAnimation() {
    this.animateSquare(wizardMove, 50);
  }

  changeDirection(isGoingLeft) {
    this.isGoingLeft = isGoingLeft;

    if (this.isGoingLeft === true) {
      this.element.style.setProperty("transform", "scaleX(-1)");
      this.healthBar.healthContainer.style.setProperty("transform", "scaleX(-1)");
    } else {
      this.element.style.removeProperty("transform");
      this.healthBar.healthContainer.style.removeProperty("transform");
    }
  }
  // overrides the method on Entity to make the player seem smaller
  getBounds() {
    return {
      left: this.state.position[0] - this.state.size / 5,
      right: this.state.position[0] + this.state.size / 5,
      top: this.state.position[1] + this.state.size / 5,
      bottom: this.state.position[1] - this.state.size / 5,
    };
  }
}
