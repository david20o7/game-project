export class Score {
  constructor() {
    this.currentScore = 0;
    this.highestScore = 0;
    this.scoreElement = document.createElement("div");
    this.scoreElement.style.position = "absolute";
    this.scoreElement.style.top = "10px";
    this.scoreElement.style.right = "10px";
    this.scoreElement.style.color = "white";
    this.scoreElement.style.fontSize = "20px";
    this.updateScoreDisplay();
    document.body.append(this.scoreElement);
  }

  // when we store highest score
  incrementScore(amount) {
    this.currentScore += amount;
    if (this.currentScore > this.highestScore) {
      this.highestScore = this.currentScore;
    }
    this.updateScoreDisplay();
  }

  updateScoreDisplay() {
    this.scoreElement.innerText = `Highest Score: ${this.highestScore}\nScore: ${this.currentScore}`;
  }
}
