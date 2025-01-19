// getting the html elements
const loginButton = document.getElementById("loginButton");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const serverMessageText = document.getElementById("serverMessage");

// adding an eventListener for when we click the register button
loginButton.addEventListener("click", (event) => {
  event.preventDefault();

  const username = usernameInput.value.toUpperCase();
  const password = passwordInput.value;

  const data = { username: username, password: password };
  // make POST request to the "/login" endpoint
  fetch("/login", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => {
    const status = res.status;
    // handles different cases for login, editing the serverMessage element
    if (res.status === 200) {
      serverMessageText.style.setProperty("display", "block");
      serverMessageText.style.setProperty("color", "green");
      serverMessageText.innerHTML = "Login successful!";
      // when login is successful it will redirect them to the game
      window.location.href = `/movement?username=${username}`;
    } else if (status >= 400 && status < 500) {
      serverMessageText.style.setProperty("display", "block");
      serverMessageText.style.setProperty("color", "red");
      // when login has a invalid username/password it will display an error
      serverMessageText.innerHTML = "Error: Invalid username or password";
    } else if (res.status === 500) {
      serverMessageText.style.setProperty("display", "block");
      serverMessageText.style.setProperty("color", "red");
      // if there are server issues it will display an error
      serverMessageText.innerHTML = "Error: Server issue, please try again later";
    }
  });
});
