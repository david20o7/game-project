import { Score } from "./Score.js";
import { StaminaBar } from "./StaminaBar.js";

import { Game } from "./Game.js";

//elements managing screens in gmae
const startGameScreen = document.querySelector("#startGameScreen");

const gameOverMessage = document.querySelector("#gameOverMessage");

const usernameText = document.querySelector("#username-text");
// initialise score instance
const score = new Score();
// wghen player dies
gameOverMessage.innerText = `Sorry, you have died`;

// event listener for the "start" button
startGameButton.addEventListener("click", () => {
  fetch(`/getGameData`)
    //fetch game data, username and high score, from the server
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      //hide startgame screen
      startGameScreen.style.setProperty("display", "none");
      // display the useranme and the highscore
      usernameText.innerHTML = response.username;
      score.setHighScore(response.high_score);
      beginGame();
    });
});
// initialise and start the game
function beginGame() {
  // instantiate the stamina bar
  const staminaBar = new StaminaBar();
  const staminaBarContainer = document.querySelector("#staminaBoxContainer");
  staminaBarContainer.append(staminaBar.staminaContainer);
  // instantiate the game
  const game = new Game();
  const pauseScreen = document.querySelector("#pauseScreen");
  const deathScreen = document.querySelector("#deathScreen");

  //override the onScoreUpdated method to set the score in the score Object
  game.onScoreUpdated = (newScore) => {
    score.setScore(newScore);
  };

  // override the onStaminaUpdated to set the stamina bar state
  game.onStaminaUpdated = (newStamina) => {
    staminaBar.updateStaminaBar(newStamina.value, newStamina.colour);
  };

  // override the onPauseUpdate to know when to show the pause screen and when to hide it
  game.onPausedUpdated = (isPaused) => {
    pauseScreen.style.setProperty("display", isPaused ? "flex" : "none");
  };
  // override the onGameOver to know when to show the game over screen and submit the high score
  game.onGameOver = () => {
    deathScreen.style.setProperty("display", "flex");
    submitHighScore();
  };
  // override the onGaeRestart to know when to hide the deathScreen and  submit the high score
  game.onGameRestart = () => {
    deathScreen.style.setProperty("display", "none");
    submitHighScore();
  };

  game.startGame();
}
// submit the player's highscore to the server
function submitHighScore() {
  const highestScore = score.getHighScore();
  const data = { high_score: highestScore };

  //send post request to submit the high score
  fetch("/submitScore", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  });
}
