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

// maybe go into gam
const box = document.querySelector("#box");

const pauseScreen = document.querySelector("#pauseScreen");
const startButton = document.querySelector("#startGameButton");
const arenaDims = [box.clientWidth, box.clientHeight];

const player = new Player(arenaDims);
player.addToBox(box);

const score = new Score();

const DEFAULT_STATE = {
  chasers: [], // holds all the chasers currently on the screen
  gamePaused: false, // tracks to see if the game is paused
  keysPressed: {}, // holds keys currently being pressed
  chaserSpawnRateFrames: 180, // rate at which a new chaser is spawned, at 3 seconds by default
  frameCount: 0, // how many frames have passed since the game started
  score: 0, // current score
};

let gameState = { ...structuredClone(DEFAULT_STATE) };

// add a new chaser every time-100 seconds until there are 1500 seconds left

// Main Game Loop
setInterval(() => {
  if (gameState.gamePaused) {
    return;
  }

  player.onKeysPressed(gameState.keysPressed);
  player.draw();

  // loop for drawing chasers
  // for collision detection
  for (let i = 0; i < gameState.chasers.length; i++) {
    const selectedChaser = gameState.chasers[i];
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
        gameState.chasers.splice(i, 1);
        gameState.score += 5;
        console.log(gameState.score);
        score.setScore(gameState.score); // Increment score by 5 when chaser is dead
      }
    }
  }

  // spawning new chasers
  addNewChaser(gameState.frameCount);
  gameState.frameCount += 1;
  // runs at 60 frames per second
}, 1000 / 60);

/**
 * Adds new chasers, increasing the interval at which they're added
 * as time goes on.
 */
function addNewChaser(currentFrame) {
  if (currentFrame % gameState.chaserSpawnRateFrames === 0) {
    const newChaser = createChaser();
    gameState.chasers.push(newChaser);
    gameState.chaserSpawnRateFrames -= 1;
  }
}

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
  const speedDifficultyIncrease = gameState.frameCount / 12000;
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

function handleKeyDown(e) {
  gameState.keysPressed[e.key] = true;

  // toggle pause when p is pressed
  if (e.key === "p" || e.key === "P") {
    gameState.gamePaused = !gameState.gamePaused;

    pauseScreen.style.setProperty("display", gameState.gamePaused ? "flex" : "none");
  }
}

function handleKeyUp(e) {
  delete gameState.keysPressed[e.key];
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function removeAllChasers() {
  for (let i = 0; i < gameState.chasers.length; i++) {
    const selectedChaser = gameState.chasers[i];
    selectedChaser.element.remove();
  }
}

function restartGame() {
  removeAllChasers();
  gameState = { ...structuredClone(DEFAULT_STATE) };
  score.resetCurrentScore();
  player.resetPlayer();
}

startButton.onclick = restartGame;
