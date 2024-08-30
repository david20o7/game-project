export class Health {
  static name = "Health";

  health;
  maxHealth;
  healthBarHeight = 3;
  healthBarWidth;

  healthContainer = document.createElement("div"); // index.html <div></div>
  healthBar = document.createElement("div"); // index.html <div></div>

  constructor(maxHealth, healthBarWidth, position) {
    this.healthBarWidth = healthBarWidth;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.initElements();
  }

  initElements() {
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

  takeDamage(damage) {
    this.health = this.health - damage;
  }

  healthPercentage() {
    return (this.health / this.maxHealth) * 100;
  }

  draw() {
    this.healthBar.style.setProperty("width", this.healthPercentage() + "%");
  }
}