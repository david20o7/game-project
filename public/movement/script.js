import { Player } from "./Player.js";
import { Chaser } from "./Chaser.js";

const box = document.querySelector("#box");

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
const staminaCount = document.querySelector("#staminaCount");
const staminaBar = document.querySelector("#staminaBar");

// appends
box.append(chaser.getElement(), chaser2.getElement());
player.addToBox(box);

let keysPressed = {};
let health = 100;
let stamina = 100;
let staminaLock = false;
let isStaminaLocked = false; // To track if the stamina is currently locked

const updatePosition = (isInit = false) => {
  player.updateSpeed(2);

  if (keysPressed["Shift"] && staminaLock === false && !isStaminaLocked) {
    player.updateSpeed(7);

    stamina = Math.max(stamina - 1, 0);

    if (stamina <= 0) {
      staminaLock = true;
      isStaminaLocked = true;
      setTimeout(() => {
        staminaLock = false;
        isStaminaLocked = false;
      }, 1000); // Lock for 1 second
    }
  } else if (!isStaminaLocked) {
    stamina = Math.min(stamina + 1, 100);
    if (stamina >= 50) {
      staminaLock = false;
    }
  }

  changeStaminaDisplay(stamina);

  player.onKeysPressed(keysPressed);

  player.draw();

  const [left, bottom] = player.getPosition();

  // Update chaser position based on player's position
  chaser.updateChaserPosition(player.getPosition());
  chaser2.updateChaserPosition(player.getPosition());

  chaser.draw();
  chaser2.draw();

  checkCollision();
};

function moveToCenter(originalElement, elementToMove, originalLeft, originalBottom) {
  const originalElementPosition = originalElement.getBoundingClientRect();
  const elementToMovePosition = elementToMove.getBoundingClientRect();

  const newElementLeft = originalElementPosition.width / 2 - elementToMovePosition.width / 2;
  const newElementBottom = originalElementPosition.height / 2 - elementToMovePosition.height / 2;

  const x = newElementLeft + originalLeft;
  const y = newElementBottom + originalBottom;
  elementToMove.style.left = x + "px";
  elementToMove.style.bottom = y + "px";

  return {
    x: x + elementToMovePosition.width / 2,
    y: y + elementToMovePosition.height / 2,
    radius: elementToMovePosition.width / 2,
  };
}

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

const changeStaminaDisplay = (amount) => {
  staminaCount.textContent = amount;
  staminaBar.style.color = staminaLock === true ? "orange" : "green";
};

const handleKeyDown = (e) => {
  keysPressed[e.key] = true;
  // console.log(e.key);
};

const handleKeyUp = (e) => {
  keysPressed[e.key] = false;
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
