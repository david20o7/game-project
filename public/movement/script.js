import { Score } from "./Score.js";
import { StaminaBar } from "./StaminaBar.js";

import { Game } from "./Game.js";
import { isValid } from "./utilities.js";

const startGameScreen = document.querySelector("#startGameScreen");
const startGameButton = document.querySelector("#startGameButton");
const username = document.querySelector("#username");
const gameOverMessage = document.querySelector("#gameOverMessage");

const firstName = localStorage.getItem("name");
username.value = firstName;

if (isValid(username.value)) {
  startGameButton.classList.remove(["disabled"]);
}

username.addEventListener("input", (e) => {
  const name = e.target.value.toUpperCase();

  if (isValid(name)) {
    startGameButton.classList.remove(["disabled"]);
  } else {
    startGameButton.classList.add(["disabled"]);
  }
  gameOverMessage.innerText = `Sorry ${name} you have died`;
});

startGameButton.addEventListener("click", () => {
  localStorage.setItem("highestScore", "0");
  fetch(`/userHighScore?username=${username.value}`)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      startGameScreen.style.setProperty("display", "none");
      localStorage.setItem("highestScore", `${response?.score || 0}`);

      localStorage.setItem("name", username.value);
      beginGame();
    });
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
    submitHighScore();
  };

  game.onGameRestart = () => {
    deathScreen.style.setProperty("display", "none");
    submitHighScore();
  };

  game.startGame();
}

function submitHighScore() {
  const name = username.value;
  const highestScore = localStorage.getItem("highestScore");
  const data = {
    username: name,
    score: highestScore,
  };

  fetch("/submitScore", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  });
}
