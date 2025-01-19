// getting the html elements
const registerButton = document.getElementById("registerButton");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const serverMessageText = document.getElementById("serverMessage");

// adding an eventListener for when we click the register button
registerButton.addEventListener("click", (event) => {
  event.preventDefault();

  //store the username and password values

  const username = usernameInput.value.toUpperCase();
  const password = passwordInput.value;

  const data = { username: username, password: password };
  // sends a POST request to the "/register" endpoint with the username and password values
  fetch("/register", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.status === 201) {
      serverMessageText.style.setProperty("display", "block");
      serverMessageText.style.setProperty("color", "green");
      // when registration is successful it will redirect them to the login page
      serverMessageText.innerHTML = "Account Created Successfully";
      window.location.href = "/accounts";
    } else if (res.status === 409) {
      serverMessageText.style.setProperty("display", "block");
      serverMessageText.style.setProperty("color", "red");
      // if registration is unsuccessful it will output an error
      serverMessageText.innerHTML = "Error: Invalid / Username taken";
    }
  });
});
