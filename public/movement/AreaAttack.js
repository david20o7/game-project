export class AreaAttack {
  state = {
    elementId: undefined,
    position: [100, 100],
    radius: 50,
    borderColor: [255, 255, 255],
    opacity: 0,

    expand: 0,
  };

  element = document.createElement("div");

  constructor(initialState) {
    this.updateInitialState(initialState);
    this.initializeAttack();
  }

  /**
   * Sets the initial HTML/CSS attributes of the attack
   * Is only needed to be run once
   */

  initializeAttack() {
    this.element.setAttribute("id", this.state.elementId);
    this.element.style.setProperty("position", "absolute");
    this.element.style.setProperty("width", this.state.radius * 2 + "px");
    this.element.style.setProperty("height", this.state.radius * 2 + "px");
    this.element.style.setProperty("border", `1px solid rgb(${this.state.borderColor.join(",")})`);
    this.element.style.setProperty("border-radius", "50%");
  }

  updateInitialState(state) {
    Object.assign(this.state, state);
  }

  drawElementPosition() {
    this.element.style.setProperty("left", this.state.position[0] - this.state.radius + "px");
    this.element.style.setProperty("bottom", this.state.position[1] - this.state.radius + "px");
  }

  drawElementOpacity() {
    this.element.style.setProperty("opacity", this.state.opacity);
  }

  showOrHide(isVisible) {
    this.state.opacity = isVisible ? 1 : 0;
  }

  draw() {
    this.drawElementPosition();
    this.drawElementOpacity();
  }

  updatePosition(newPosition) {
    this.state.position = newPosition;
  }
}
