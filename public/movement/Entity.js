import { clamp } from "./utilities.js";

export class Entity {
  hasInit = false;
  state = {
    elementId: undefined,
    position: [100, 100],
    size: 5,
    speed: 1,
    color: [255, 0, 0],
  };

  element = document.createElement("div");

  // defines some inits
  constructor(arenaDims, initialState) {
    /** @type { [width:number, height:number] }  */
    this.arena = arenaDims;

    this._updateEntityState(initialState);
    // this._initEntity();
    // this.draw();
  }

  _updateEntityState(state) {
    Object.assign(this.state, state);
  }

  _initEntity() {
    this.element.setAttribute("id", this.state.elementId);
    this.element.style.setProperty("position", "absolute");
  }

  _drawElementPosition() {
    this.element.style.setProperty("left", this.state.position[0] - this.state.size / 2 + "px");
    this.element.style.setProperty("bottom", this.state.position[1] - this.state.size / 2 + "px");
  }

  _updateElementSize() {
    this.element.style.setProperty("width", this.state.size + "px");
    this.element.style.setProperty("height", this.state.size + "px");
  }

  draw() {
    if (!this.hasInit) {
      this._initEntity();
      this.hasInit = true;
    }

    this._updateElementSize();
    this._drawElementPosition();
    this.element.style.setProperty("background-color", `rgb(${this.state.color.join(",")})`);
  }

  updateSpeed(speed) {
    this.state.speed = speed;
  }

  move(left, right, up, down) {
    const newSpeed = [0, 0];
    // sprite movement
    if (left) {
      newSpeed[0] = -this.state.speed;
    }
    if (right) {
      newSpeed[0] = this.state.speed;
    }
    if (up) {
      newSpeed[1] = this.state.speed;
    }
    if (down) {
      newSpeed[1] = -this.state.speed;
    }

    const halfSize = this.state.size / 2;

    const newX = clamp(this.state.position[0] + newSpeed[0], halfSize, this.arena[0] - halfSize);
    const newY = clamp(this.state.position[1] + newSpeed[1], halfSize, this.arena[1] - halfSize);

    const newPosition = [newX, newY];
    this._updateEntityState({ position: newPosition });
    return newPosition;
  }

  getElement() {
    return this.element;
  }

  getPosition() {
    return this.state.position;
  }

  /**
   *
   * ________
   * |      |
   * |  X   |
   * |______|
   */
  getBounds() {
    return {
      left: this.state.position[0] - this.state.size / 2,
      right: this.state.position[0] + this.state.size / 2,
      top: this.state.position[1] + this.state.size / 2,
      bottom: this.state.position[1] - this.state.size / 2,
    };
  }
}
