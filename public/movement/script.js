import { Score } from "./Score.js";
import { StaminaBar } from "./StaminaBar.js";

import { Game } from "./Game.js";
const startGameScreen = document.querySelector("#startGameScreen");

const gameOverMessage = document.querySelector("#gameOverMessage");

// TODO: update game over text
gameOverMessage.innerText = `Sorry, you have died`;

// TODO: add start game button in the game screen
startGameButton.addEventListener("click", () => {
  fetch(`/getGameData`)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      startGameScreen.style.setProperty("display", "none");

      localStorage.setItem("highestScore", `${response.high_score}`);
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
  const highestScore = localStorage.getItem("highestScore");
  const data = {
    high_score: highestScore,
  };
  fetch("/submitScore", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  });
}
