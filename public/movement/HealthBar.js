export class HealthBar {
  health;
  maxHealth;
  healthBarHeight = 3;
  healthBarWidth;

  healthContainer = document.createElement("div"); // index.html <div></div>
  healthBar = document.createElement("div"); // index.html <div></div>

  constructor(maxHealth, healthBarWidth, healthBarHeight = 3) {
    this.healthBarWidth = healthBarWidth;
    this.healthBarHeight = healthBarHeight;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.initElements();
  }

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
  // calculates the percentage of the new health
  healthPercentage() {
    return (this.health / this.maxHealth) * 100;
  }
  resetHealth() {
    this.health = this.maxHealth;
  }
  // displays health bar above player with a percentage of the width
  draw() {
    this.healthBar.style.setProperty("width", this.healthPercentage() + "%");
  }
  getHealth() {
    return this.health;
  }
}
