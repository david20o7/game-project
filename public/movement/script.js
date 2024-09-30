import { Player } from "./Player.js";
import { Chaser } from "./Chaser.js";
import { Score } from "./Score.js";
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

const player = new Player(arenaDims);
const score = new Score();
const chasers = [];

player.addToBox(box);
player.addPlayerStatsToBox(playerStats);

// keeping track of game time
const timeAtGameStart = performance.now();

function getTimeFromGameStart() {
  return performance.now() - timeAtGameStart;
}
//

/**
 * - creates a chaser of a random size
 * - gives the chaser a speed inversely proportional to its size
 * - chaser speed then adjusted for difficulty
 * - random color also selected for chaser
 * - chaser placed somewhere on the edge of the play area
 */
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

// key pressed handlers
let keysPressed = {};

const handleKeyDown = (e) => {
  keysPressed[e.key] = true;
};

const handleKeyUp = (e) => {
  delete keysPressed[e.key];
};
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
//

// add a new chaser every time-100 seconds until there are 1500 seconds left

/**
 * Adds new chasers, increasing the interval at which they're added
 * as time goes on.
 */
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
//

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
    }

    let hitByAttack = areCircleAndSquareColliding(player.attack, selectedChaser);

    if (hitByAttack) {
      selectedChaser.getHit();
      if (selectedChaser.chaserDead()) {
        selectedChaser.element.remove();
        chasers.splice(i, 1);
        score.incrementScore(5); // Increment score by 5 when chaser is dead
      }
    }
  }

  // runs at 60 frames per second
}, 1000 / 60);
//

addNewChaser(3000);
