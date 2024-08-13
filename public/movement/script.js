const sprite = document.querySelector("#sprite");
const chaser = document.querySelector("#chaser");
const box = document.querySelector("#box");
const healthDisplay = document.querySelector("#healthBar");

let speed = 5;
let chaserSpeed = 1;
let keysPressed = {};
let health = 100;

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

  const currentSpeed = keysPressed[" "] ? 7 : speed;

  if (keysPressed["ArrowLeft"]) {
    left = Math.max(left - currentSpeed, 0);
  }
  if (keysPressed["ArrowRight"]) {
    left = Math.min(left + currentSpeed, box.clientWidth - sprite.clientWidth);
  }
  if (keysPressed["ArrowUp"]) {
    bottom = Math.min(
      bottom + currentSpeed,
      box.clientHeight - sprite.clientHeight
    );
  }
  if (keysPressed["ArrowDown"]) {
    bottom = Math.max(bottom - currentSpeed, 0);
  }

  sprite.style.left = left + "px";
  sprite.style.bottom = bottom + "px";

  updateChaserPosition(left, bottom);
  checkCollision();

  requestAnimationFrame(updatePosition);
};

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
    reduceHealth(5);
  }
};

const reduceHealth = (amount) => {
  health = Math.max(health - amount, 0);
  healthDisplay.textContent = `Health: ${health}/100`;
};

const resetGame = () => {
  health = 100;
  healthDisplay.textContent = `Health: ${health}/100`;
  sprite.style.left = "0px";
  sprite.style.bottom = "0px";
  chaser.style.left = box.clientWidth - chaser.clientWidth + "px";
  chaser.style.bottom = box.clientHeight - chaser.clientHeight + "px";
};

const handleKeyDown = (e) => {
  keysPressed[e.key] = true;
};

const handleKeyUp = (e) => {
  keysPressed[e.key] = false;
};

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

requestAnimationFrame(() => updatePosition(true));
