// 1. get the square using document queryselector

// 2. create a function, which takes in a div, which will
//    a. Loop through the animation sprites
//    b. set the background of the image said sprite
// the final effect should be pretty similar to what slime-idle looks like now

// HINTS:
// -    before writing complex code, just try to set the background the div (element) to one of the slime sprites
// -    have all the pictures (paths to the pictures) relevant to the animation into an array and use that array in your:
// -    use setInterval

// BONUS:
// - create a function which takes in a number and creates that many slimes on the screen.
// - think about where we should put this logic in our game and how it relates to other functionality

const body = document.body;

const spritesIdle = [
  "sprites/slime-idle-0.png",
  "sprites/slime-idle-1.png",
  "sprites/slime-idle-2.png",
  "sprites/slime-idle-3.png",
];
const spritesMove = [
  "sprites/slime-move-0.png",
  "sprites/slime-move-1.png",
  "sprites/slime-move-2.png",
  "sprites/slime-move-3.png",
];

class MiniChaser {
  element = document.createElement("div");

  // start: ignore this
  animationId;
  // end: ignore this

  constructor() {
    this.element.classList.add("other-square");
  }

  // this. keyword doesn't work in static methods
  animateSquare(spriteList) {
    let currentFrame = 0;

    clearInterval(this.animationId);

    this.animationId = setInterval(() => {
      this.element.style.backgroundImage = `url(${spriteList[currentFrame]})`;
      currentFrame = (currentFrame + 1) % spriteList.length;
    }, 100);
  }

  move() {
    this.animateSquare(spritesMove);
  }

  idle() {
    this.animateSquare(spritesIdle);
  }
}

const elsie = new MiniChaser();
body.append(elsie.element);
elsie.move();
// let isMoving = true;
// setInterval(() => {
//   if (isMoving) {
//     elsie.idle();
//     isMoving = false;
//   } else {
//     elsie.move();
//     isMoving = true;
//   }
// }, 2000);
