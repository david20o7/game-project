import { Entity } from "./Entity.js";
import { AreaAttack } from "./AreaAttack.js";
import { Stamina } from "./Stamina.js";
import { HealthBar } from "./HealthBar.js";

// move sprite frames
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

// still sprite frames
const wizardStill = ["sprites/wizard/walk-0.png", "sprites/wizard/walk-9.png"];

// attack sprite frames
const wizardAttack = [
  "sprites/wizard/attack-5.png",
  "sprites/wizard/attack-6.png",
  "sprites/wizard/attack-7.png",
  "sprites/wizard/attack-8.png",
  "sprites/wizard/attack-9.png",
  "sprites/wizard/walk-0.png",
];

// defined constants to check when to use the animations
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
  // objects that define the arena and the player
  constructor(arenaDims, initialState) {
    super(arenaDims, {
      position: [400, 400],
      size: 75,
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
  // initialises the player entity with healthbar, idle animation and
  _initEntity() {
    super._initEntity();
    this.element.append(this.healthBar.healthContainer);
    this.idleAnimation();
  }

  // movement logic
  // will set the direction to true if the key is pressed
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
    // if shift is pressed then it will set attacking to true and will display the attacking animation to the player
    if (keysPressed[" "] && !this.attack.isAttacking() && this.animationState !== ATTACKING) {
      this.attack.doAttack();
      if (this.animationState !== ATTACKING) {
        this.attackAnimation();
        this.animationState = ATTACKING;
        return;
      }
    }

    const trySprint = !!keysPressed["Shift"] && Object.keys(keysPressed).length > 1;
    this.sprint(trySprint); // handle the sprinting logic

    const position = this.move(left, right, up, down);

    this.attack.updatePosition(position);

    const standingStill = !left && !right && !up && !down;

    // switch to idle animation when player is still
    // try to only start the animation once
    if (standingStill && this.animationState !== IDLE) {
      this.idleAnimation();
      this.animationState = IDLE;
    } else if (
      // switch to moving animation when player is moving and not sprinting
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

    // checks whether the player can still sprint of if they're out of stamina
    const canSprint = this.stamina.canUseStamina();

    // the player should sprint if they  want to sprint and are able to do so
    const shouldSprint = canSprint && trySprinting;

    this.updateSpeed(shouldSprint ? this.state.sprintingSpeed : this.state.walkingSpeed);
    // if the player is sprinting then switch to sprinting animation
    if (shouldSprint && this.animationState !== SPRINTING) {
      this.sprintAnimation();
      this.animationState = SPRINTING;
      // if the player is done sprinting then switch to the moving animation
    } else if (!shouldSprint && this.animationState === SPRINTING) {
      this.moveAnimation();
      this.animationState = MOVING;
    }
  }
  // handles the player taking damage
  getHit() {
    // don't do anything if the player is currently immune
    if (this.hasImmunity === true) {
      return;
    }

    // reduce health by 25 when hit
    this.healthBar.takeDamage(25);

    // after 2 seconds it will cancel player immunity
    setTimeout(() => {
      this.hasImmunity = false;
      this._updateEntityFlashing(false);
    }, 2000);
    // gives player immunity after getting hit
    this.hasImmunity = true;
    this._updateEntityFlashing(true);
  }

  // upades the player's drawn elements on the screen
  draw() {
    super.draw();
    this.attack.draw();
    this.healthBar.draw();
  }

  // add the player and the attack to the box
  addToBox(box) {
    box.append(this.element, this.attack.element);
  }
  // resets player to its initial state
  resetPlayer() {
    this.state.position = [400, 400];
    this.healthBar.resetHealth();
    this.stamina.resetStamina();
    this.draw();
  }
  // checks if player is dead
  isDead() {
    return this.healthBar.getHealth() <= 0;
  }
  // gets the current stamina data
  getStaminaData() {
    return {
      value: this.stamina.getStamina(),
      colour: this.stamina.getStaminaColour(),
    };
  }

  // starts the moving animation
  moveAnimation() {
    this.animateSquare(wizardMove);
  }
  // starts the attack animation
  attackAnimation() {
    this.animateSquare(wizardAttack, 100, true);
  }
  // starts the idle animation
  idleAnimation() {
    this.animateSquare(wizardStill, 500);
  }

  // starts the sprint animation
  sprintAnimation() {
    this.animateSquare(wizardMove, 50);
  }
  // decides if the player is going left
  // if the player is going left it will invert the images' X coordinate to make it face left
  // otherwise it will remain in the same direction
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
