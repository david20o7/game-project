import { clamp } from "./utilities.js";

export class Stamina {
  stamina = 100;
  maxStamina = 100;
  staminaLock = false;
  canRegenerate = true;
  staminaBarColor = "green";

  //if stamina is used until stamina = 0, there will be a stamina lock for 1 second meaning the player will not be able to use the
  // stamina until it is above 50
  manageStaminaLock() {
    if (this.stamina === 0) {
      if (!this.staminaLock) {
        this.staminaLock = true;
        this.canRegenerate = false;
        // waits 1 second before stamina can start regenerating
        setTimeout(() => {
          this.canRegenerate = true;
        }, 1000); // Lock for 1 second
      }

      // player cant sprint until they have regian 50 stamina
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
  // function to lose stamina when using it and regeneration
  useStamina(isUsing) {
    let newStaminaValue = this.stamina;

    if (isUsing && !this.staminaLock) {
      newStaminaValue -= 1;
    } else if (this.canRegenerate) {
      newStaminaValue += 1;
    }
    // makes sure stamina stays between 0 and its maximum value
    this.stamina = clamp(newStaminaValue, 0, this.maxStamina);
    // update stamina lock depending on the new value
    this.manageStaminaLock();
  }
  // stops the stamina lock from taking place
  canUseStamina() {
    return !this.staminaLock;
  }

  // gets the initial stamina
  resetStamina() {
    this.stamina = this.maxStamina;
  }

  getStamina() {
    return this.stamina;
  }
  // gets the stamina colour
  getStaminaColour() {
    this.updateStaminaColor();
    return this.staminaBarColor;
  }
}
