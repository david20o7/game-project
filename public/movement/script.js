import { Player } from "./Player.js";
import { Chaser } from "./Chaser.js";
/** @ts-ignore */
import { Score } from "./Score.js";
import {
  checkCollision,
  getRandomEdge,
  getRandomColour,
  getSpeedFromSize,
  getRandomSize,
  areCircleAndSquareColliding,
} from "./utilities.js";

const healthBarHUDContainer = document.querySelector("body");

const box = document.querySelector("#box");

const pauseScreen = document.querySelector("#pauseScreen");

const playerStats = document.querySelector("#playerStats");

const arenaDims = [box.clientWidth, box.clientHeight];

const player = new Player(arenaDims);
const score = new Score();
const chasers = [];

player.addToBox(box);
player.addPlayerStatsToBox(playerStats);

// const healthBar = new HealthBar(player.state.maxHealth, 170, 30);

healthBarHUDContainer.append();

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
let gamePaused = false; // tracks to see if the game is paused

const handleKeyDown = (e) => {
  keysPressed[e.key] = true;

  // toggle pause when p is pressed
  if (e.key === "p" || e.key === "P") {
    gamePaused = !gamePaused;

    // meow ? true  : false
    pauseScreen.style.setProperty("display", gamePaused ? "flex" : "none");
  }
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

let chaserSpawnRateFrames = 180;

function addNewChaser2(currentFrame) {
  if (currentFrame % chaserSpawnRateFrames === 0) {
    const newChaser = createChaser();
    chasers.push(newChaser);
    chaserSpawnRateFrames -= 1;
  }
}
let frameCount = 0;

// Main Game Loop
setInterval(() => {
  if (gamePaused) {
    return;
  }

  player.onKeysPressed(keysPressed);
  player.draw();

  // loop for drawing chasers
  // for collision detection
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

  // spawning new chasers
  addNewChaser2(frameCount);
  frameCount += 1;
  // runs at 60 frames per second
}, 1000 / 60);
//
