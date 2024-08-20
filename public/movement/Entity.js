import { clamp } from "./utilities.js";

export class Entity {
  state = {
    elementId: undefined,

    /** @type {[x:number, y:number]} */
    position: [100, 100],

    /** @type {number} */
    size: 5,

    /** @type { number } */
    speedMultiplier: 1,

    color: [255, 0, 0],
  };

  /** @private @type { HTMLDivElement} */
  element = document.createElement("div");

  // defines some inits
  constructor(arenaDims, initialState) {
    /** @type { [width:number, height:number] }  */
    this.arena = arenaDims;

    this.updateEntityState(initialState);
    this.initPlayer();
    this.draw();
  }

  /**
   * @private
   */
  updateEntityState(state) {
    Object.assign(this.state, state);
  }

  /**
   * @private
   */
  initPlayer() {
    this.element.setAttribute("id", this.state.elementId);
    this.element.style.setProperty("position", "absolute");
  }

  /**
   * @private
   * Updates the player's position in the arena
   */
  updateElementPosition() {
    this.element.style.setProperty("left", this.state.position[0] + "px");
    this.element.style.setProperty("bottom", this.state.position[1] + "px");
  }

  /**
   * @private
   * Updates the player's size
   */
  updateElementSize() {
    this.element.style.setProperty("width", this.state.size + "px");
    this.element.style.setProperty("height", this.state.size + "px");
  }

  draw() {
    this.updateElementSize();
    this.updateElementPosition();
    this.element.style.setProperty("background-color", `rgb(${this.state.color.join(",")})`);
  }

  updateSpeed(speed) {
    this.state.speedMultiplier = speed;
  }

  move(left, right, up, down) {
    const newSpeed = [0, 0];
    // sprite movement
    if (left) {
      newSpeed[0] = -this.state.speedMultiplier;
    }
    if (right) {
      newSpeed[0] = this.state.speedMultiplier;
    }
    if (up) {
      newSpeed[1] = this.state.speedMultiplier;
    }
    if (down) {
      newSpeed[1] = -this.state.speedMultiplier;
    }

    const newX = clamp(this.state.position[0] + newSpeed[0], 0, this.arena[0] - this.state.size);
    const newY = clamp(this.state.position[1] + newSpeed[1], 0, this.arena[1] - this.state.size);

    this.updateEntityState({ position: [newX, newY] });
  }

  getElement() {
    return this.element;
  }

  getPosition() {
    return this.state.position;
  }
}
