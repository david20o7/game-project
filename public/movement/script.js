import { Player } from "./Player.js";
import { Chaser } from "./Chaser.js";
import { checkCollision } from "./utilities.js";

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
for (let i = 0; i < chasers.length; i++) {
  const chaserSelect = chasers[i];
  box.append(chaserSelect.getElement());
}

player.addToBox(box);
player.addPlayerStatsToBox(playerStats);

function getRandomEdge() {
  const prob = Math.random();

  if (prob < 0.25) {
    // bottom
    return [Math.random() * arenaDims[0], 0];
  } else if (prob < 0.5) {
    // left
    return [0, Math.random() * arenaDims[1]];
  } else if (prob < 0.75) {
    //up
    return [Math.random() * arenaDims[0], arenaDims[1]];
  } else {
    // right
    return [arenaDims[0], Math.random() * arenaDims[1]];
  }
}

function getRandomColour() {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
}

function createChaser() {
  const newChaser = new Chaser(arenaDims, {
    speedMultiplier: 1.1,
    color: getRandomColour(),
    position: getRandomEdge(),
  });
  box.append(newChaser.getElement());
  return newChaser;
}

let keysPressed = {};

const updatePosition = () => {
  player.updateSpeed(2);

  player.onKeysPressed(keysPressed);

  player.draw();

  for (let i = 0; i < chasers.length; i++) {
    const chaserSelect = chasers[i];
    chaserSelect.updateChaserPosition(player.getPosition());
    chaserSelect.draw();
    const hasCollided = checkCollision(player, chaserSelect);

    if (hasCollided) {
      player.getHit();

      chaserSelect.element.remove();
      const newChaser = createChaser();
      chasers.splice(i, 1, newChaser);
    }
  }

  // checkCollision();
};

setInterval(() => {
  updatePosition();

  // runs at 60 frames per second
}, 1000 / 60);

setInterval(() => {
  const newChaser = createChaser();
  chasers.push(newChaser);
}, 3000);

const handleKeyDown = (e) => {
  keysPressed[e.key] = true;
};

const handleKeyUp = (e) => {
  delete keysPressed[e.key];
};

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
