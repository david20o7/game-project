import { Score } from "./Score.js";
import { StaminaBar } from "./StaminaBar.js";

import { Game } from "./Game.js";
import { isValid } from "./utilities.js";

const startGameScreen = document.querySelector("#startGameScreen");
const startGameButton = document.querySelector("#startGameButton");
const username = document.querySelector("#username");
const gameOverMessage = document.querySelector("#gameOverMessage");

username.value = localStorage.getItem("name");

if (isValid(username.value)) {
  startGameButton.classList.remove(["disabled"]);
}

username.addEventListener("input", (e) => {
  const name = e.target.value;

  if (isValid(name)) {
    startGameButton.classList.remove(["disabled"]);
  } else {
    startGameButton.classList.add(["disabled"]);
  }
  gameOverMessage.innerText = `Sorry ${name} you have died`;
});

startGameButton.addEventListener("click", () => {
  startGameScreen.style.setProperty("display", "none");
  localStorage.setItem("name", username.value);
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
