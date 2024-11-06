import { Score } from "./Score.js";
import { StaminaBar } from "./StaminaBar.js";

import { Game } from "./Game.js";

const startGameScreen = document.querySelector("#startGameScreen");
const startGameButton = document.querySelector("#startGameButton");
const username = document.querySelector("#username");

username.addEventListener("input", (e) => {
  const name = e.target.value;

  if (name.length > 3 && name.length < 16) {
    startGameButton.classList.remove(["disabled"]);
  } else {
    startGameButton.classList.add(["disabled"]);
  }
});

startGameButton.addEventListener("click", () => {
  startGameScreen.style.setProperty("display", "none");
  beginGame();
});

function beginGame() {
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
}
