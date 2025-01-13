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
  goingRight = false;
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

  changeDirection(isGoingRight) {
    this.goingRight = isGoingRight;

    if (this.goingRight === true) {
      this.element.style.setProperty("transform", "scaleX(-1)");
    } else {
      this.element.style.removeProperty("transform");
    }
  }
}

const meow = new MiniChaser();

// Math.floor(Math.random() * 11)
// Math.floor(Math.random() * 11) + 10;

//DOM = html file thingy
/**
 * KNOWLEDGE:
 * 1. To stop an animation, use clearInterval
 * 2. To remove an element from the DOM, use element.remove()
 * 3. Math.random() generates a random number between 0 and 1 (will never be 0, will never be 1)
 *    - Math.random() * 10 = A random number between 0. something and 9. something (never 0, never 10)
 *    - Math.floor(number) rounds the number DOWN
 *    - Math.floor(Math.random() * 11) + 10; generates a random INTEGER between 10 and 20
 */

// Create 20 chasers
// Have them exist for a random duration between 3 and 10 seconds
// When the chaser dies, stop the animation and remove the element from the DOM
// -- when doing that, make sure that you create a method on the Chaser class which handles the removal for you.
// after that, move all animation logic in a separate base class, which MiniChaser inherits.

// Things to learn:
// Explain what the MiniChaser c
// what the DOM is
// the difference between class instance and Class
// How to call a method on an instance, and how to call a method on the class
// -- WHY you would call a method on the instance, and WHY you would call a class method.
// the different ways you can create a function in javascript
