import { Player } from "./Player.js";

const box = document.querySelector("#box");

const player = new Player([box.clientWidth, box.clientHeight]);

const player2 = new Player([box.clientWidth, box.clientHeight], {
  color: [0, 255, 0],
  position: [200, 200],
  elementId: "player2",
});

const sprite = player.getElement();
const chaser = document.querySelector("#chaser");
const healthDisplay = document.querySelector("#healthCount");
const staminaCount = document.querySelector("#staminaCount");
const staminaBar = document.querySelector("#staminaBar");
const attack = document.querySelector("#attack");

// appends
box.append(sprite, player2.getElement());

let chaserSpeed = 1;
let keysPressed = {};
let health = 100;
let stamina = 100;
let staminaLock = false;
let isStaminaLocked = false; // To track if the stamina is currently locked

let attackCircle;

const toNum = (pxVal) => parseInt(pxVal, 10) || 0;

const updatePosition = (isInit = false) => {
  player.updateSpeed(2);
  player2.updateSpeed(3);

  if (keysPressed["Shift"] && staminaLock === false && !isStaminaLocked) {
    player.updateSpeed(7);
    player2.updateSpeed(10);

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
  player2.onKeysPressed(keysPressed);

  // attack stuff
  if (keysPressed[" "]) {
    attack.style.opacity = 1;
    //show circle
  } else {
    attack.style.opacity = 0;
    //make invisible
  }

  player.draw();
  player2.draw();

  const [left, bottom] = player.getPosition();

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
