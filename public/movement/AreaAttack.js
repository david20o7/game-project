import { clamp } from "./utilities.js";
// creates objects that describe the areaAttack
export class AreaAttack {
  state = {
    elementId: undefined,
    position: [100, 100],
    radius: 1,
    borderColor: [150, 150, 255],
    opacity: 1,

    maxRadius: 120,

    expandSpeed: 0.05,
    attacking: false,
    expand: 0,
  };

  element = document.createElement("div");

  constructor(initialState) {
    this.updateInitialState(initialState);
    this.initializeAttack();
  }
  // slowly expands the attack of the player until it reaches the maximum radius.
  attackExpand() {
    if (this.state.attacking) {
      this.state.expand += this.state.expandSpeed;
      this.state.radius = clamp(this.state.expand * this.state.maxRadius, 0, this.state.maxRadius);

      if (this.state.radius === this.state.maxRadius) {
        this.state.radius = 0;
        setTimeout(() => {
          this.state.attacking = false;
        }, 100);
      }
    }
  }

  //  Sets the initial HTML/CSS attributes of the attack
  //  Is only needed to be run once

  initializeAttack() {
    this.element.setAttribute("id", this.state.elementId);
    this.element.style.setProperty("position", "absolute");
    this.element.style.setProperty("border", `3px solid rgb(${this.state.borderColor.join(",")})`);
    this.element.style.setProperty("border-radius", "50%");
  }

  updateInitialState(state) {
    Object.assign(this.state, state);
  }

  drawElementPosition() {
    this.element.style.setProperty("width", this.state.radius * 2 + "px");
    this.element.style.setProperty("height", this.state.radius * 2 + "px");
    this.element.style.setProperty("left", this.state.position[0] - this.state.radius + "px");
    this.element.style.setProperty("bottom", this.state.position[1] - this.state.radius + "px");
  }

  drawElementOpacity() {
    this.element.style.setProperty("opacity", this.state.opacity);
  }

  //starts attacking
  doAttack() {
    this.state.attacking = true;
    this.state.radius = 0;
    this.state.expand = 0;
    this.attackExpand();
  }
  //displays the attack in the game
  draw() {
    this.drawElementPosition();
    this.drawElementOpacity();
    this.attackExpand();
  }

  updatePosition(newPosition) {
    this.state.position = newPosition;
  }

  // gets the circle dimentions and position of the circle
  getCircle() {
    return {
      center: this.state.position,
      radius: this.state.radius,
    };
  }
  // validates if the player is attacking
  isAttacking() {
    return this.state.attacking;
  }
}
