const number = 1;
const string = "string";
const boolean = true;
let array = [];
const object = {};

function meow(meows) {
  return meows;
}

const output = meow(meow);
// console.log(output(output)(boolean));

const apex = [string, meow(), boolean];

// console.log(apex);

const legends = {
  apex: boolean,
  thing: string,
  prop: meow,
  meow: number,
  array: apex,
  cool: () => {
    return apex;
  },
  legend: {
    caca: apex,
  },
};

legends.array = false;

// console.log(legends.array);

const funct = (key) => {
  return legends[key];
};

// console.log(funct("prop")(legends));

array[0] = meow;

// console.log(array);
// console.log(array[0](array));

legends["thang"] = 4;
console.log(legends.thang);
