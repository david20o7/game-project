import { clamp } from "./utilities.js";

export class Stamina {
  stamina = 100;
  maxStamina = 100;
  staminaLock = false;
  canRegenerate = true;
  staminaBarColor = "green";

  staminaContainer = document.createElement("div"); // index.html <div></div>
  staminaBar = document.createElement("div"); // index.html <div></div>

  constructor() {
    this.initElements();
  }

  // display stamina elements

  initElements() {
    this.staminaContainer.style.setProperty("height", "30px");
    this.staminaContainer.style.setProperty("width", "300px");
    this.staminaContainer.style.setProperty("border", "1px solid white");

    this.staminaBar.style.setProperty("height", "100%");
    this.staminaBar.style.setProperty("width", "100%");
    this.staminaBar.style.setProperty("background-color", "green");

    this.staminaContainer.append(this.staminaBar);
  }
  /*if stamina is used until stamina = 0, there will be a stamina lock for 1 second meaning the player will not be able to use the 
 stamina until it is above 50 */
  manageStaminaLock() {
    if (this.stamina === 0) {
      if (!this.staminaLock) {
        this.staminaLock = true;
        this.canRegenerate = false;

        setTimeout(() => {
          this.canRegenerate = true;
        }, 1000); // Lock for 1 second
      }

      // stay for a second
    } else if (this.stamina >= 50) {
      this.staminaLock = false;
    }
  }

  // changes the gradient of the stamina from green to red

  updateStaminaColor() {
    const greenValue = this.stamina * 2.5;
    const redValue = 255 - greenValue;

    const rgb = [redValue, greenValue, 0];

    this.staminaBarColor = "rgb(" + rgb.join(",") + ")";
  }

  useStamina(isUsing) {
    let newStaminaValue = this.stamina;

    if (isUsing && !this.staminaLock) {
      newStaminaValue -= 1;
    } else if (this.canRegenerate) {
      newStaminaValue += 1;
    }

    this.stamina = clamp(newStaminaValue, 0, this.maxStamina);

    this.manageStaminaLock();
  }

  canUseStamina() {
    return !this.staminaLock;
  }

  // displays stamina
  resetStamina() {
    this.stamina = this.maxStamina;
  }

  draw() {
    this.updateStaminaColor();
    this.staminaBar.style.setProperty("width", this.stamina + "%");

    this.staminaBar.style.setProperty("background-color", this.staminaBarColor);
  }
}
