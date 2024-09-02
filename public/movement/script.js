import { Player } from "./Player.js";
import { Chaser } from "./Chaser.js";
import { checkCollision, getRandomEdge, getRandomColour } from "./utilities.js";

const box = document.querySelector("#box");

const playerStats = document.querySelector("#playerStats");

const arenaDims = [box.clientWidth, box.clientHeight];
const emoji = document.createElement("div");

const player = new Player(arenaDims);
const chasers = [];

// appends
for (let i = 0; i < chasers.length; i++) {
  const chaserSelect = chasers[i];
  box.append(chaserSelect.getElement());
}

player.addToBox(box);
player.addPlayerStatsToBox(playerStats);

const SPEED_OFFSET = 10;
const SPEED_RANGE = 30;
function getRandomSize() {
  return Math.random() * SPEED_RANGE + SPEED_OFFSET;
}

// function getSpeedFromSize(size) {
//   const speed = (size + 55) / -15;
//   console.log(size, speed);
//   return speed * -1;
// }

function createChaser() {
  const chaserSize = getRandomSize();

  //  speed-10 / 30 =  1

  // 10 / 40 = 1/4

  // if (chaserSize <= 19) {
  //   speedIncrease = 3;
  // } else if (chaserSize >= 20 || chaserSize < 30) {
  //   speedIncrease = 1.5;
  // } else {
  //   speedIncrease = 0.7;
  // }

  const speedIncrease = 1 + getTimeDifference() / 100000;
  // const speedIncrease = 1;
  console.log(speedIncrease);

  const newChaser = new Chaser(arenaDims, {
    speed: speedIncrease,
    color: getRandomColour(),
    position: getRandomEdge(arenaDims),
    size: chaserSize,
  });

  box.append(newChaser.getElement());

  return newChaser;
}

function showEmoji(position) {
  emoji.innerText = "🦆";
  emoji.style.position = "absolute";
  emoji.style.fontSize = "24px";
  emoji.style.left = position[0] + "px";
  emoji.style.bottom = position[1] + "px";

  box.append(emoji);

  setTimeout(() => {
    emoji.remove();
  }, 1000);
}

let keysPressed = {};

const handleKeyDown = (e) => {
  keysPressed[e.key] = true;
};

const handleKeyUp = (e) => {
  delete keysPressed[e.key];
};

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

const timeAtGameStart = performance.now();
function getTimeDifference() {
  return performance.now() - timeAtGameStart;
}

// Main Game Loop
setInterval(() => {
  player.updateSpeed(2);
  player.onKeysPressed(keysPressed);
  player.draw();

  // loop for drawing chasers
  for (let i = 0; i < chasers.length; i++) {
    const chaserSelect = chasers[i];
    chaserSelect.updateChaserPosition(player.getPosition());
    chaserSelect.draw();

    // collision detection
    const hasCollided = checkCollision(player, chaserSelect);

    if (hasCollided) {
      player.getHit();
      chaserSelect.element.remove();
      chasers.splice(i, 1);

      showEmoji(player.getPosition());
    }
  }
  // runs at 60 frames per second
}, 1000 / 60);

function addNewChaser(time) {
  setTimeout(() => {
    const newChaser = createChaser();
    chasers.push(newChaser);

    const newTime = time - 100;
    if (newTime > 1500) {
      addNewChaser(newTime);
    } else {
      addNewChaser(time);
    }
  }, time);
}

addNewChaser(3000);
