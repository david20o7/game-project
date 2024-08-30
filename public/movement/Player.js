import { Entity } from "./Entity.js";
import { AreaAttack } from "./AreaAttack.js";
import { Stamina } from "./Stamina.js";
import { Health } from "./Health.js";

export class Player extends Entity {
  // defines some inits

  attack = new AreaAttack();
  stamina = new Stamina();
  healthBar;

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

    this.healthBar = new Health(100, this.state.size);
  }

  _initEntity() {
    super._initEntity();
    this.element.append(this.healthBar.healthContainer);
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

    if (keysPressed[" "]) {
      this.attack.doAttack();
    }

    this.sprint(keysPressed["Shift"] && Object.keys(keysPressed).length > 1);

    const position = this.move(left, right, up, down);

    this.attack.updatePosition(position);
  }

  sprint(isSprinting) {
    this.stamina.useStamina(isSprinting);
    const canSprint = this.stamina.canUseStamina();

    this.updateSpeed(
      canSprint && isSprinting ? this.state.sprintingSpeed : this.state.walkingSpeed
    );
  }

  getHit() {
    this.healthBar.takeDamage(5);
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

  // box is different than the box above ^
  addPlayerStatsToBox(box) {
    box.append(this.stamina.staminaContainer);
  }
}
