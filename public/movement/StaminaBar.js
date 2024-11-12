export class StaminaBar {
  stamina = 100;
  staminaBarColor = "green";

  constructor() {
    this.initElements();
  }

  // display stamina elements
  staminaContainer = document.createElement("div");
  staminaBar = document.createElement("div");

  initElements() {
    this.staminaContainer.style.setProperty("height", "15px");
    this.staminaContainer.style.setProperty("width", "800px");
    this.staminaContainer.style.setProperty("border", "1px solid white");

    this.staminaBar.style.setProperty("height", "100%");
    this.staminaBar.style.setProperty("width", "100%");
    this.staminaBar.style.setProperty("background-color", "green");

    this.staminaContainer.append(this.staminaBar);
  }

  updateStaminaBar(stamina, staminaBarColor) {
    this.stamina = stamina;
    this.staminaBarColor = staminaBarColor;

    this.staminaBar.style.setProperty("width", this.stamina + "%");
    this.staminaBar.style.setProperty("background-color", this.staminaBarColor);
  }
}
