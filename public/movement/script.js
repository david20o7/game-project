import { Player } from "./Player.js";
import { Chaser } from "./Chaser.js";
/** @ts-ignore */
import { Score } from "./Score.js";
import { StaminaBar } from "./StaminaBar.js";
import {
  checkCollision,
  getRandomEdge,
  getRandomColour,
  getSpeedFromSize,
  getRandomSize,
  areCircleAndSquareColliding,
} from "./utilities.js";

import { Game } from "./Game.js";

const staminaBar = new StaminaBar();
const staminaBarContainer = document.querySelector("#staminaBoxContainer");
staminaBarContainer.append(staminaBar.staminaContainer);

const score = new Score();
const game = new Game();
const pauseScreen = document.querySelector("#pauseScreen");
const deathScreen = document.querySelector("#deathScreen");

game.onScoreUpdated = (newScore) => {
  score.setScore(newScore);
};

game.onStaminaUpdated = (newStamina) => {
  staminaBar.updateStaminaBar(newStamina.value, newStamina.colour);
};

game.onPausedUpdated = (isPaused) => {
  pauseScreen.style.setProperty("display", isPaused ? "flex" : "none");
};

game.onGameOver = () => {
  deathScreen.style.setProperty("display", "flex");
};

game.onGameRestart = () => {
  deathScreen.style.setProperty("display", "none");
};

game.startGame();
