import { Player } from "./Player.js";
import { Chaser } from "./Chaser.js";
import {
  checkCollision,
  getRandomEdge,
  getSpeedFromSize,
  getRandomSize,
  areCircleAndSquareColliding,
} from "./utilities.js";

const FRAMERATE = 1000 / 60;

const DEFAULT_STATE = {
  chasers: [], // holds all the chasers currently on the screen
  gamePaused: false, // tracks to see if the game is paused
  keysPressed: {}, // holds keys currently being pressed
  chaserSpawnRateFrames: 180, // rate at which a new chaser is spawned, at 3 seconds by default
  frameCount: 0, // how many frames have passed since the game started
  score: 0, // player score
};

export class Game {
  gameState = structuredClone(DEFAULT_STATE);
  interval = 0;

  gameArena = document.querySelector("#box");

  // override to do something when the score is updated
  onScoreUpdated = (score) => {};

  // override to do something when the stamina changes
  onStaminaUpdated = (stamina) => {};

  // override to do something when the game is paused or resumed
  onPausedUpdated = (pause) => {};

  // override to do something when the game is over
  onGameOver = () => {};

  // override to do something when the game restarts
  onGameRestart = () => {};

  constructor() {
    this.arenaDims = [this.gameArena.clientWidth, this.gameArena.clientHeight];
    this.player = new Player(this.arenaDims);
    this.player.addToBox(this.gameArena);

    // adding event listener to record
    window.addEventListener("keydown", (e) => {
      // keeping track of all keys pressed
      this.gameState.keysPressed[e.key] = true;

      // toggle pause when p is pressed
      if (e.key === "p" || e.key === "P") {
        this.gameState.gamePaused = !this.gameState.gamePaused;
        this.onPausedUpdated(this.gameState.gamePaused);
      }

      // restart the game when R is pressed
      if ((e.key === "r" || e.key === "R") && !this.gameState.gamePaused) {
        this.restartGame();
      }
    });

    // no longer keeping track of the keys pressed when the key is lifted
    window.addEventListener("keyup", (e) => {
      delete this.gameState.keysPressed[e.key];
    });
  }

  // restarting the game, restoring all the values and clearing the box
  restartGame() {
    this.removeAllChasers();
    this.gameState = structuredClone(DEFAULT_STATE);

    this.onScoreUpdated(this.gameState.score);
    this.player.resetPlayer();
    this.onGameRestart();
  }

  // creates a chaser of a random size
  // gives the chaser a speed inversely proportional to its size
  // chaser speed then adjusted for difficulty
  // random color also selected for chaser
  // chaser placed somewhere on the edge of the play area
  createChaser() {
    const chaserSize = getRandomSize();

    const newSpeed = getSpeedFromSize(chaserSize);
    const speedDifficultyIncrease = this.gameState.frameCount / 12000;
    const speedIncrease = newSpeed + speedDifficultyIncrease;

    const newChaser = new Chaser(this.arenaDims, {
      speed: speedIncrease,
      position: getRandomEdge(this.arenaDims),
      size: chaserSize + 10,
    });

    this.gameArena.append(newChaser.getElement());
    return newChaser;
  }

  // adds new chasers, increasing the interval at which they're added as time goes on
  addNewChaser(currentFrame) {
    if (currentFrame % this.gameState.chaserSpawnRateFrames === 0) {
      const newChaser = this.createChaser();
      this.gameState.chasers.push(newChaser);
      this.gameState.chaserSpawnRateFrames -= 1;
    }
  }

  removeAllChasers() {
    if (!this.gameState.chasers.length) {
      return;
    }

    for (let i = 0; i < this.gameState.chasers.length; i++) {
      const selectedChaser = this.gameState.chasers[i];
      selectedChaser.remove();
    }
  }
  // loop through game logic
  gameLoop() {
    //checks if the game is paused or the player is dead
    if (this.gameState.gamePaused || this.player.isDead()) {
      return;
    }
    // draws the player to the new position when a key is pressed
    this.player.onKeysPressed(this.gameState.keysPressed);
    this.player.draw();
    // stamina is updated
    const staminaData = this.player.getStaminaData();
    this.onStaminaUpdated(staminaData);

    // loop for drawing chasers
    // for collision detection
    for (let i = 0; i < this.gameState.chasers.length; i++) {
      const selectedChaser = this.gameState.chasers[i];
      selectedChaser.updateChaserPosition(this.player.getPosition());
      selectedChaser.draw();

      // collision detection
      const chaserCollidedWithPlayer = checkCollision(this.player, selectedChaser);

      if (chaserCollidedWithPlayer) {
        this.player.getHit();
        if (this.player.isDead()) {
          this.onGameOver();
        }
      }

      let hitByAttack = areCircleAndSquareColliding(this.player.attack, selectedChaser);

      if (hitByAttack) {
        selectedChaser.getHit();
        if (selectedChaser.chaserDead()) {
          selectedChaser.remove();
          this.gameState.chasers.splice(i, 1);
          this.updateScore(5);
        }
      }
    }

    // spawning new chasers
    this.addNewChaser(this.gameState.frameCount);
    this.gameState.frameCount += 1;
    // runs at 60 frames per second
  }
  // update the score
  updateScore(scoreToAdd) {
    this.gameState.score += scoreToAdd;
    this.onScoreUpdated(this.gameState.score);
  }

  // start the game through calling the gameLoop
  startGame() {
    this.interval = setInterval(() => {
      this.gameLoop();
    }, FRAMERATE);
  }
}
