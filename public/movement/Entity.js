import { clamp } from "./utilities.js";

// This class is inherited by both Player and Chaser classes
// It contains the following shared logic:
// 1. logic for drawing the element,
// 2. logic for  keeping, updating and retrieving their positions and sizes
// 3. Logic for animating an element when given a series of sprites
export class Entity {
  hasInit = false;
  animationId = null;
  isMoving = false;

  // default properties
  state = {
    elementId: undefined,
    position: [100, 100],
    size: 5,
    speed: 1,
  };
  // create div to represent an entity
  element = document.createElement("div");

  // defines some inits
  constructor(arenaDims, initialState) {
    this.arena = arenaDims;

    this._updateEntityState(initialState);
  }
  // updates entity's state
  _updateEntityState(state) {
    Object.assign(this.state, state);
  }
  // initialises the html entity of the entity
  _initEntity() {
    this.element.setAttribute("id", this.state.elementId);
    this.element.style.setProperty("position", "absolute");

    this.element.style.setProperty("background-size", "contain");
    this.element.style.setProperty("background-repeat", "no-repeat");
  }

  // draws the element at its current position
  // the position is the center of the element, so the left and bottom are half of the element's size away
  _drawElementPosition() {
    this.element.style.setProperty("left", this.state.position[0] - this.state.size / 2 + "px");
    this.element.style.setProperty("bottom", this.state.position[1] - this.state.size / 2 + "px");
  }

  _updateElementSize() {
    this.element.style.setProperty("width", this.state.size + "px");
    this.element.style.setProperty("height", this.state.size + "px");
  }

  _updateEntityFlashing(willFlash) {
    if (willFlash) {
      this.element.classList.add("flash");
    } else {
      this.element.classList.remove("flash");
    }
  }

  draw() {
    // initialise if it hasn't already
    if (!this.hasInit) {
      this._initEntity();
      this.hasInit = true;
    }

    this._updateElementSize();
    this._drawElementPosition();
  }

  // updates the entity's movement speed
  updateSpeed(speed) {
    this.state.speed = speed;
  }
  // handles sprite movement logic for an entity
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

    // clamp the position with the area dimension so it doesn't exceed the arena limits
    const newX = clamp(this.state.position[0] + newSpeed[0], halfSize, this.arena[0] - halfSize);
    const newY = clamp(this.state.position[1] + newSpeed[1], halfSize, this.arena[1] - halfSize);

    const newPosition = [newX, newY];
    // update state with the new position
    this._updateEntityState({ position: newPosition });
    return newPosition;
  }

  // returns the element of an entity
  getElement() {
    return this.element;
  }

  // gets the position of the entity
  getPosition() {
    return this.state.position;
  }

  // gets the left, right, up and down bounds of entity
  getBounds() {
    return {
      left: this.state.position[0] - this.state.size / 2,
      right: this.state.position[0] + this.state.size / 2,
      top: this.state.position[1] + this.state.size / 2,
      bottom: this.state.position[1] - this.state.size / 2,
    };
  }

  // animates an entity using a list of sprites
  animateSquare(spriteList, spriteSpeed = 100, once = false) {
    let currentFrame = 0; // tracks the current animation frame

    // stops the current animation
    this.stopAnimation();

    const animationFunction = () => {
      // override the element's background image
      this.element.style.backgroundImage = `url(${spriteList[currentFrame]})`;
      currentFrame = currentFrame + 1;

      // if the once parameter is passed, go through the animations only one time
      if (once && currentFrame === spriteList.length) {
        this.topAnimation();
      }
      currentFrame = currentFrame % spriteList.length;
    };

    animationFunction(); // start the animation
    this.animationId = setInterval(animationFunction, spriteSpeed);
  }

  // stop the current animation
  stopAnimation() {
    clearInterval(this.animationId);
    this.animationId = null;
  }
}
