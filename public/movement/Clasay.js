class Classy {
  /** public static void string */

  mySpecialNumber = 3;
  constructor() {
    this.mySpecialNumber;
  }

  main() {
    console.log(this.mySpecialNumber);
  }

  someOtherFunction() {
    this.main();
  }
}

const myClassThingy = new Classy();

myClassThingy.main();
