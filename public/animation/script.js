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

const wizardMove = [
  "sprites/wizard/walk-0.png",
  "sprites/wizard/walk-1.png",
  "sprites/wizard/walk-2.png",
  "sprites/wizard/walk-3.png",
  "sprites/wizard/walk-4.png",
  "sprites/wizard/walk-5.png",
  "sprites/wizard/walk-6.png",
  "sprites/wizard/walk-7.png",
  "sprites/wizard/walk-8.png",
  "sprites/wizard/walk-9.png",
];

const wizardAttack = [
  "sprites/wizard/attack-5.png",
  "sprites/wizard/attack-6.png",
  "sprites/wizard/attack-7.png",
  "sprites/wizard/attack-8.png",
  "sprites/wizard/attack-9.png",
];

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

class BaseChaser {
  element = document.createElement("div");
  animationId;

  constructor() {
    this.element.classList.add("other-square");
  }

  animateSquare(spriteList, animateSpeed = 100) {
    let currentFrame = 0;
    clearInterval(this.animationId);

    this.animationId = setInterval(() => {
      this.element.style.backgroundImage = `url(${spriteList[currentFrame]})`;
      currentFrame = (currentFrame + 1) % spriteList.length;
    }, animateSpeed);
  }

  removeChaser() {
    clearInterval(this.animationId);
    this.element.remove();
  }
}

class MiniChaser extends BaseChaser {
  goingRight = false;

  move() {
    this.animateSquare(spritesMove);
  }

  wizardMove() {
    this.animateSquare(wizardMove, 50);
  }

  wizardAttack() {
    this.animateSquare(wizardAttack);
  }

  idle() {
    this.animateSquare(spritesIdle);
  }

  static main() {
    console.log("called main!!!");
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

const chaserList = [];

const chaser = new MiniChaser();

body.append(chaser.element);

let attacking = false;
chaser.wizardMove();
setInterval(() => {
  if (attacking) {
    chaser.wizardMove();
    attacking = false;
  } else {
    chaser.wizardAttack();
    attacking = true;
  }
}, 2000);
chaser.wizardAttack();

// function createChaser() {
//   for (let i = 0; i < 20; i++) {
//     const chaser = new MiniChaser();
//     chaserList.push(chaser);
//     body.append(chaser.element);
//     chaser.move();

//     chaser.

//     const lifeTime = Math.floor(Math.random() * 8000) + 3000;

//     setTimeout(() => {
//       chaser.removeChaser();
//     }, lifeTime);
//   }
// }

// createChaser();

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

// DONE: Create 20 chasers
// DONE: Have them exist for a random duration between 3 and 10 seconds
// DONE: When the chaser dies, stop the animation and remove the element from the DOM
// -- when doing that, make sure that you create a method on the Chaser class which handles the removal for you.
// after that, move all animation logic in a separate base class, which MiniChaser inherits.

// Things to learn:
// what the DOM is
// DONE: the difference between class instance and Class
// DONE: How to call a method on an instance, and how to call a method on the class
// -- WHY you would call a method on the instance, and WHY you would call a class method.
// the different ways you can create a function in javascript
