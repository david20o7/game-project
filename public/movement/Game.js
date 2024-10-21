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

const DEFAULT_STATE = {
  chasers: [], // holds all the chasers currently on the screen
  gamePaused: false, // tracks to see if the game is paused
  keysPressed: {}, // holds keys currently being pressed
  chaserSpawnRateFrames: 180, // rate at which a new chaser is spawned, at 3 seconds by default
  frameCount: 0, // how many frames have passed since the game started
};

// Objectives of this class
//const game = new Game();

// game.pause
// game.restart
// game.getScore
// game.getStamina
// game.getHealth
//

//
//
//
//
//
//

export class Game {
  gameState = { ...structuredClone(DEFAULT_STATE) };

  gameArena = document.querySelector("#box");
  pauseScreen = document.querySelector("#pauseScreen");
  startButton = document.querySelector("#startGameButton");

  constructor() {
    this.arenaDims = [this.gameArena.clientWidth, this.gameArena.clientHeight];
    this.player = new Player(this.arenaDims);
    this.player.addToBox(this.gameArena);
  }

  /**
   * - creates a chaser of a random size
   * - gives the chaser a speed inversely proportional to its size
   * - chaser speed then adjusted for difficulty
   * - random color also selected for chaser
   * - chaser placed somewhere on the edge of the play area
   */
  createChaser() {
    const chaserSize = getRandomSize();

    const newSpeed = getSpeedFromSize(chaserSize);
    const speedDifficultyIncrease = gameState.frameCount / 12000;
    const speedIncrease = newSpeed + speedDifficultyIncrease;

    const newChaser = new Chaser(this.arenaDims, {
      speed: speedIncrease,
      color: getRandomColour(),
      position: getRandomEdge(this.arenaDims),
      size: chaserSize,
    });

    this.gameArena.append(newChaser.getElement());
    return newChaser;
  }

  /**
   * Adds new chasers, increasing the interval at which they're added
   * as time goes on.
   */
  addNewChaser(currentFrame) {
    if (currentFrame % this.chaserSpawnRateFrames === 0) {
      const newChaser = this.createChaser();
      this.gameState.chasers.push(newChaser);
      this.gameState.chaserSpawnRateFrames -= 1;
    }
  }
}
