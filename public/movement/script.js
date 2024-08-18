const sprite = document.querySelector("#sprite");
const chaser = document.querySelector("#chaser");
const box = document.querySelector("#box");
const healthDisplay = document.querySelector("#healthCount");
const staminaCount = document.querySelector("#staminaCount");
const staminaBar = document.querySelector("#staminaBar");
const attack = document.querySelector("#attack");

let speed = 2;
let chaserSpeed = 1;
let keysPressed = {};
let health = 100;
let stamina = 100;
let staminaLock = false;
let isStaminaLocked = false; // To track if the stamina is currently locked

let attackCircle;

const toNum = (pxVal) => parseInt(pxVal, 10) || 0;

const updatePosition = (isInit = false) => {
  let left = 0;
  let bottom = 0;

  if (isInit) {
    const style = window.getComputedStyle(sprite);
    left = toNum(style.left);
    bottom = toNum(style.bottom);
  } else {
    left = toNum(sprite.style.left);
    bottom = toNum(sprite.style.bottom);
  }

  let currentSpeed = speed;

  if (keysPressed["Shift"] && staminaLock === false && !isStaminaLocked) {
    currentSpeed = 7;
    stamina = Math.max(stamina - 1, 0);
    if (stamina <= 0) {
      staminaLock = true;
      isStaminaLocked = true; // Set lock
      setTimeout(() => {
        staminaLock = false;
        isStaminaLocked = false; // Unlock after 1 seconds
      }, 1000); // Lock for 1 seconds
    }
  } else if (!isStaminaLocked) {
    stamina = Math.min(stamina + 1, 100);
    if (stamina >= 50) {
      staminaLock = false;
    }
  }

  changeStaminaDisplay(stamina);

  // sprite movement
  if (keysPressed["ArrowLeft"] || keysPressed["a"] || keysPressed["A"]) {
    left = Math.max(left - currentSpeed, 0);
  }
  if (keysPressed["ArrowRight"] || keysPressed["d"] || keysPressed["D"]) {
    left = Math.min(left + currentSpeed, box.clientWidth - sprite.clientWidth);
  }
  if (keysPressed["ArrowUp"] || keysPressed["w"] || keysPressed["W"]) {
    bottom = Math.min(bottom + currentSpeed, box.clientHeight - sprite.clientHeight);
  }
  if (keysPressed["ArrowDown"] || keysPressed["s"] || keysPressed["S"]) {
    bottom = Math.max(bottom - currentSpeed, 0);
  }

  // attack stuff
  if (keysPressed[" "]) {
    attack.style.opacity = 1;
    //show circle
  } else {
    attack.style.opacity = 0;
    //make invisible
  }

  sprite.style.left = left + "px";
  sprite.style.bottom = bottom + "px";

  moveToCenter(sprite, attack, left, bottom);

  const isEnemyHit = areCircleAndSquareColliding(attack, chaser) && attack.style.opacity === "1";
  if (isEnemyHit) {
    attack.style.borderColor = "blue";
  } else {
    attack.style.borderColor = "wheat";
  }
  updateChaserPosition(left, bottom);
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

const updateChaserPosition = (spriteLeft, spriteBottom) => {
  let chaserLeft = toNum(chaser.style.left);
  let chaserBottom = toNum(chaser.style.bottom);

  if (chaserLeft < spriteLeft) {
    chaserLeft = Math.min(chaserLeft + chaserSpeed, spriteLeft);
  } else if (chaserLeft > spriteLeft) {
    chaserLeft = Math.max(chaserLeft - chaserSpeed, spriteLeft);
  }

  if (chaserBottom < spriteBottom) {
    chaserBottom = Math.min(chaserBottom + chaserSpeed, spriteBottom);
  } else if (chaserBottom > spriteBottom) {
    chaserBottom = Math.max(chaserBottom - chaserSpeed, spriteBottom);
  }

  chaser.style.left = chaserLeft + "px";
  chaser.style.bottom = chaserBottom + "px";
};

const checkCollision = () => {
  const spriteRect = sprite.getBoundingClientRect();
  const chaserRect = chaser.getBoundingClientRect();

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

const resetGame = () => {
  healthDisplay.textContent = 100;
  staminaCount.textContent = 100;
  sprite.style.left = "0px";
  sprite.style.bottom = "0px";
  chaser.style.left = box.clientWidth - chaser.clientWidth + "px";
  chaser.style.bottom = box.clientHeight - chaser.clientHeight + "px";
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
