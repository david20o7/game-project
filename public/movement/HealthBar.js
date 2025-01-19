export class HealthBar {
  health;
  maxHealth;
  healthBarHeight = 3;
  healthBarWidth;

  // health bar container into which the health bar expands
  healthContainer = document.createElement("div");

  // actual health bar
  healthBar = document.createElement("div");

  // initialise health values and element dimension
  constructor(maxHealth, healthBarWidth, healthBarHeight = 3) {
    this.healthBarWidth = healthBarWidth;
    this.healthBarHeight = healthBarHeight;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.initElements();
  }
  // set up the health bar's appearance
  initElements() {
    this.healthContainer.classList.add("health-bar");
    this.healthContainer.style.setProperty("position", "relative");
    this.healthContainer.style.setProperty("height", this.healthBarHeight + "px");
    this.healthContainer.style.setProperty("width", this.healthBarWidth + "px");

    this.healthBar.style.setProperty("height", "100%");
    this.healthBar.style.setProperty("width", "100%");
    this.healthBar.style.setProperty("background-color", "green");

    this.healthContainer.style.setProperty("left", 0 + "px");
    this.healthContainer.style.setProperty("top", -10 + "px");
    this.healthContainer.append(this.healthBar);
  }

  // the health decreases
  takeDamage(damage) {
    this.health = this.health - damage;
  }

  // calculates the percentage of the new health, used for drawing the health bar
  healthPercentage() {
    return (this.health / this.maxHealth) * 100;
  }

  // resets the health to the max health
  resetHealth() {
    this.health = this.maxHealth;
  }

  // displays health bar above player with a percentage of the width
  // calculated from the percentage
  draw() {
    this.healthBar.style.setProperty("width", this.healthPercentage() + "%");
  }
  getHealth() {
    return this.health;
  }
}
