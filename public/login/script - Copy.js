// when the user clicks a button

// get all the data from the form

// then send it to the server and try to create an account
const mySquare = document.getElementById("mySquare");

mySquare.style.setProperty("position", "absolute");
mySquare.style.setProperty("width", "20px");
mySquare.style.setProperty("height", "20px");
mySquare.style.setProperty("z-index", "10");
mySquare.style.setProperty("background-color", "red");
mySquare.style.setProperty("top", "20px");
mySquare.style.setProperty("left", "20px");

let degree = 0;

setInterval(() => {
  degree += 1;
  mySquare.style.setProperty("transform", `rotate(${degree}deg)`);
}, 50);

const highSCore = 30;

const myUserData = {
  user: "someUSername",
  email: "someEmail@meow.com",
  password: "password",
};
