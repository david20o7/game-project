const loginButton = document.getElementById("loginButton");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const serverMessageText = document.getElementById("serverMessage");

loginButton.addEventListener("click", (event) => {
  event.preventDefault();

  const username = usernameInput.value.toUpperCase();
  const password = passwordInput.value;

  const data = { username: username, password: password };

  fetch("/login", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => {
    const status = res.status;

    if (res.status === 200) {
      serverMessageText.style.setProperty("display", "block");
      serverMessageText.style.setProperty("color", "green");
      serverMessageText.innerHTML = "Login successful!";
      window.location.href = `/movement?username=${username}`;
    } else if (status >= 400 && status < 500) {
      serverMessageText.style.setProperty("display", "block");
      serverMessageText.style.setProperty("color", "red");
      serverMessageText.innerHTML = "Error: Invalid username or password";
    } else if (res.status === 500) {
      serverMessageText.style.setProperty("display", "block");
      serverMessageText.style.setProperty("color", "red");
      serverMessageText.innerHTML = "Error: Server issue, please try again later";
    }
  });
});
