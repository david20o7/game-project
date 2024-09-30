import { Entity } from "./Entity.js";
import { AreaAttack } from "./AreaAttack.js";
import { Stamina } from "./Stamina.js";
import { HealthBar } from "./HealthBar.js";

export class Player extends Entity {
  // defines some inits
  hasImmunity = false;

  attack = new AreaAttack();
  stamina = new Stamina();
  healthBar;
  // objects that define the player
  constructor(arenaDims, initialState) {
    super(arenaDims, {
      position: [400, 400],
      size: 25,
      color: [233, 180, 194],
      elementId: "player",
      speed: 2,
      walkingSpeed: 2,
      sprintingSpeed: 7,

      ...initialState,
    });

    this.attack.updatePosition(this.state.position);

    this.healthBar = new HealthBar(100, this.state.size);
  }

  _initEntity() {
    super._initEntity();
    this.element.append(this.healthBar.healthContainer);
  }

  // movement logic
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
    // attack logic
    if (keysPressed[" "]) {
      this.attack.doAttack();
    }

    this.sprint(keysPressed["Shift"] && Object.keys(keysPressed).length > 1);

    const position = this.move(left, right, up, down);

    this.attack.updatePosition(position);
  }
  // if user is sprinting and has enough stamina, the speed is set to sprinting speed
  // otherwise, the speed is set to walking speed.
  sprint(isSprinting) {
    this.stamina.useStamina(isSprinting);
    const canSprint = this.stamina.canUseStamina();

    this.updateSpeed(
      canSprint && isSprinting ? this.state.sprintingSpeed : this.state.walkingSpeed
    );
  }

  getHit() {
    if (this.hasImmunity === false) {
      this.healthBar.takeDamage(25);

      setTimeout(() => {
        this.hasImmunity = false;
      }, 2000);

      this.hasImmunity = true;
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

  // box is different than the box above ^ (stamina box)
  addPlayerStatsToBox(box) {
    box.append(this.stamina.staminaContainer);
  }
}
