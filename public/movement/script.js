import { Player } from "./Player.js";
import { Chaser } from "./Chaser.js";

const box = document.querySelector("#box");

const playerStats = document.querySelector("#playerStats");

const arenaDims = [box.clientWidth, box.clientHeight];

const player = new Player(arenaDims);

const chaser = new Chaser(arenaDims);

const chaser2 = new Chaser(arenaDims, {
  speedMultiplier: 1.1,
  color: [255, 0, 0],
  position: [100, 800],
});

const chasers = [chaser, chaser2];

// appends
box.append(chaser.getElement(), chaser2.getElement());

player.addToBox(box);
player.addPlayerStatsToBox(playerStats);

let keysPressed = {};

const updatePosition = () => {
  player.updateSpeed(2);

  player.onKeysPressed(keysPressed);

  player.draw();

  for (let i = 0; i < chasers.length; i++) {
    const chaserSelect = chasers[i];
    chaserSelect.updateChaserPosition(player.getPosition());

    chaserSelect.draw();
  }

  // checkCollision();
};

setInterval(() => {
  updatePosition();

  // runs at 60 frames per second
}, 1000 / 60);

const handleKeyDown = (e) => {
  keysPressed[e.key] = true;
};

const handleKeyUp = (e) => {
  delete keysPressed[e.key];
};

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
