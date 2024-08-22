import { Player } from "./Player.js";
import { Chaser } from "./Chaser.js";

const box = document.querySelector("#box");

const playerStats = document.querySelector("#playerStats");

const arenaDims = [box.clientWidth, box.clientHeight];

const player = new Player(arenaDims);

const chaser = new Chaser(arenaDims);

const chaser2 = new Chaser(arenaDims, {
  speedMultiplier: 1.1,
  color: [255, 0, 0],
  position: [100, 800],
});

const sprite = player.getElement();
const healthDisplay = document.querySelector("#healthCount");

// appends
box.append(chaser.getElement(), chaser2.getElement());

player.addToBox(box);
player.addPlayerStatsToBox(playerStats);

let keysPressed = {};
let health = 100;
let staminaLock = false;

const updatePosition = (isInit = false) => {
  player.updateSpeed(2);

  player.onKeysPressed(keysPressed);

  player.draw();

  // Update chaser position based on player's position
  chaser.updateChaserPosition(player.getPosition());
  chaser2.updateChaserPosition(player.getPosition());

  chaser.draw();
  chaser2.draw();

  checkCollision();
};

function areCircleAndSquareColliding(circleElement, squareElement) {
  // Get the bounding rectangles for both elements
  const circleRect = circleElement.getBoundingClientRect();
  const squareRect = squareElement.getBoundingClientRect();

  // Calculate the circle's center and radius
  const circleRadius = circleRect.width / 2;
  const circleCenterX = circleRect.left + circleRadius;
  const circleCenterY = circleRect.top + circleRadius;

  // Find the closest point on the square to the circle's center
  const closestX = Math.max(squareRect.left, Math.min(circleCenterX, squareRect.right));
  const closestY = Math.max(squareRect.top, Math.min(circleCenterY, squareRect.bottom));

  // Calculate the distance from the closest point to the circle's center
  const distanceX = circleCenterX - closestX;
  const distanceY = circleCenterY - closestY;

  // Determine if the distance is less than the circle's radius
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  return distanceSquared < circleRadius * circleRadius;
}

const checkCollision = () => {
  const spriteRect = sprite.getBoundingClientRect();
  const chaserRect = chaser.getElement().getBoundingClientRect();

  if (
    spriteRect.left < chaserRect.right &&
    spriteRect.right > chaserRect.left &&
    spriteRect.top < chaserRect.bottom &&
    spriteRect.bottom > chaserRect.top
  ) {
    reduceHealthDisplay(1);
  }
};

const reduceHealthDisplay = (amount) => {
  health = Math.max(health - amount, 0);
  healthDisplay.textContent = health;
};

const handleKeyDown = (e) => {
  keysPressed[e.key] = true;
};

const handleKeyUp = (e) => {
  delete keysPressed[e.key];
};

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

let first = true;

setInterval(() => {
  updatePosition(first);
  if (first) {
    first = false;
  }
  // runs at 60 frames per second
}, 1000 / 60);
