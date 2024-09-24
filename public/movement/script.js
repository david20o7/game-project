import { Player } from "./Player.js";
import { Chaser } from "./Chaser.js";
import {
  checkCollision,
  getRandomEdge,
  getRandomColour,
  getSpeedFromSize,
  getRandomSize,
  areCircleAndSquareColliding,
} from "./utilities.js";

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

function createChaser() {
  const chaserSize = getRandomSize();

  const newSpeed = getSpeedFromSize(chaserSize);
  const speedDifficultyIncrease = getTimeFromGameStart() / 200000;
  const speedIncrease = newSpeed + speedDifficultyIncrease;

  const newChaser = new Chaser(arenaDims, {
    speed: speedIncrease,
    color: getRandomColour(),
    position: getRandomEdge(arenaDims),
    size: chaserSize,
  });

  box.append(newChaser.getElement());

  return newChaser;
}
// when chaser die, show emoji
function showEmoji(position) {
  emoji.innerText = "💥";
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

function getTimeFromGameStart() {
  return performance.now() - timeAtGameStart;
}

// Main Game Loop
setInterval(() => {
  player.onKeysPressed(keysPressed);
  player.draw();

  // loop for drawing chasers
  for (let i = 0; i < chasers.length; i++) {
    const selectedChaser = chasers[i];
    selectedChaser.updateChaserPosition(player.getPosition());
    selectedChaser.draw();

    // collision detection
    const chaserCollidedWithPlayer = checkCollision(player, selectedChaser);

    if (chaserCollidedWithPlayer) {
      player.getHit();
      // selectedChaser.element.remove();
      // chasers.splice(i, 1);

      // showEmoji(player.getPosition());
    }

    let hitByAttack = areCircleAndSquareColliding(player.attack, selectedChaser);

    if (hitByAttack) {
      selectedChaser.getHit();
      if (selectedChaser.chaserDead()) {
        selectedChaser.element.remove();
        chasers.splice(i, 1);
      }
    }
  }

  // runs at 60 frames per second
}, 1000 / 60);

// add a new chaser every time-100 seconds until there are 1500 seconds left

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
