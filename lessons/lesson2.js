class LivingThing {
  alive = true;

  constructor() {
    console.log("I now spawn into this cruel world.");
  }

  die() {
    this.alive = false;
  }
}

// a blueprint
class Feline extends LivingThing {
  stepsTaken = 0;
  stepsUntilTired = 0;

  constructor(stepsTaken, stepsUntilTired) {
    super();
    console.log("I now becometh cat.");
    this.stepsTaken = stepsTaken < 0 ? 0 : stepsTaken;
    this.stepsUntilTired = stepsUntilTired < 0 ? 0 : stepsUntilTired;
  }

  walkAndReport() {
    if (this.alive === false) {
      console.log("🪦");
      return;
    }

    // this.stepsTaken += 4;

    // this.isTired() === false ? (this.stepsTaken += 2) : (this.stepsTaken += 4);
    this.stepsTaken += this.isTired() ? 2 : 4;

    if (this.isTired() === true) {
      console.log("meooowwww", this.stepsTaken, this.alive);
    } else {
      console.log("mew meow: ", this.stepsTaken, this.alive);
    }

    if (this.stepsTaken > this.stepsUntilTired * 2) {
      this.die();
    }
  }

  isTired() {
    return this.stepsTaken > this.stepsUntilTired ? true : false;
  }
}

// // a class instance
// const kitty = new Feline(-10, 30);

// a different, completely separate instance
const kittyKat = new Feline(-10, 30);

setInterval(() => {
  kittyKat.walkAndReport();
}, 1000);

// const kittyCat = new Feline(20);
// kittyCat.stepsTaken = 20;
// kittyCat.walk();
