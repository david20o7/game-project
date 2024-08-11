const sprite = document.querySelector("#sprite");
const chaser = document.querySelector("#chaser");
const box = document.querySelector("#box");

let speed = 5;
let chaserSpeed = 1;
let keysPressed = {};

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

  if (keysPressed["ArrowLeft"]) {
    left = Math.max(left - speed, 0);
  }
  if (keysPressed["ArrowRight"]) {
    left = Math.min(left + speed, box.clientWidth - sprite.clientWidth);
  }
  if (keysPressed["ArrowUp"]) {
    bottom = Math.min(bottom + speed, box.clientHeight - sprite.clientHeight);
  }
  if (keysPressed["ArrowDown"]) {
    bottom = Math.max(bottom - speed, 0);
  }

  sprite.style.left = left + "px";
  sprite.style.bottom = bottom + "px";

  updateChaserPosition(left, bottom);

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

const handleKeyDown = (e) => {
  keysPressed[e.key] = true;
};

const handleKeyUp = (e) => {
  keysPressed[e.key] = false;
};

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

requestAnimationFrame(() => updatePosition(true));
