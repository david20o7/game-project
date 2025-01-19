// this class holds the score and high score of the player
export class Score {
  constructor() {
    this.highestScore = 0;
    this.currentScore = 0;
    this.scoreElement = document.createElement("div");
    this.scoreElement.style.position = "absolute";
    this.scoreElement.style.top = "10px";
    this.scoreElement.style.right = "10px";
    this.scoreElement.style.color = "white";
    this.scoreElement.style.fontSize = "20px";
    this.updateScoreDisplay();
    document.body.append(this.scoreElement);
  }

  // sets the high score and replaces the highest score with the score if it's greater
  setScore(amount) {
    this.currentScore = amount;
    if (this.currentScore > this.highestScore) {
      this.highestScore = this.currentScore;
    }
    this.updateScoreDisplay();
  }

  // displays the score and highscore
  updateScoreDisplay() {
    this.scoreElement.innerText = `Highest Score: ${this.highestScore}\nScore: ${this.currentScore}`;
  }
  // resets the score
  resetCurrentScore() {
    this.currentScore = 0;
    this.updateScoreDisplay();
  }
  // sets the highscore
  setHighScore(highScore) {
    this.highestScore = highScore;
    this.updateScoreDisplay();
  }
  // gets the highscore value
  getHighScore() {
    return this.highestScore;
  }
}
