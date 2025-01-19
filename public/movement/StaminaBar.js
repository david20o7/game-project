// class which holds the stamina state and draws the stamina bar
export class StaminaBar {
  // initialise properties for stamina and the bar color
  stamina = 100;
  staminaBarColor = "green";

  constructor() {
    this.initElements();
  }

  //  creates html elements for the stamina bar
  staminaContainer = document.createElement("div");
  staminaBar = document.createElement("div");

  // initialises the stamina bar elements
  initElements() {
    // sets the styles of the container
    this.staminaContainer.style.setProperty("height", "15px");
    this.staminaContainer.style.setProperty("width", "800px");
    this.staminaContainer.style.setProperty("border", "1px solid white");

    // sets the styles of the bar
    this.staminaBar.style.setProperty("height", "100%");
    this.staminaBar.style.setProperty("width", "100%");
    this.staminaBar.style.setProperty("background-color", "green");

    this.staminaContainer.append(this.staminaBar);
  }
  // updates the stamina bar's appearance (colour and width);
  updateStaminaBar(stamina, staminaBarColor) {
    this.stamina = stamina;
    this.staminaBarColor = staminaBarColor;
    this.staminaBar.style.setProperty("width", this.stamina + "%");
    this.staminaBar.style.setProperty("background-color", this.staminaBarColor);
  }
}
