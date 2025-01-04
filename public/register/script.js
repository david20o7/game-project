const registerButton = document.getElementById("registerButton");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const serverMessageText = document.getElementById("serverMessage");

registerButton.addEventListener("click", (event) => {
  event.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;

  const data = { username: username, password: password };

  //   fetch("/register", {
  //     headers: { "Content-Type": "application/json" },
  //     method: "POST",
  //     body: JSON.stringify(data),
  //   }).then((res) => {
  //     if (res.status === 201) {
  //       serverMessageText.style.setProperty("display", "block");
  //       serverMessageText.style.setProperty("color", "green");
  //       serverMessageText.innerHTML = "Account Created Successfully";
  //       window.location.href = "/accounts";
  //     } else if (res.status === 409) {
  //       serverMessageText.style.setProperty("display", "block");
  //       serverMessageText.style.setProperty("color", "red");
  //       serverMessageText.innerHTML = "Error: Username Invalid";
  //     }
  //   });
  // });
  fetch("/register", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.status === 201) {
      serverMessageText.style.setProperty("display", "block");
      serverMessageText.style.setProperty("color", "green");
      serverMessageText.innerHTML = "Account Created Successfully";
      window.location.href = "/accounts";
    } else if (res.status === 409) {
      serverMessageText.style.setProperty("display", "block");
      serverMessageText.style.setProperty("color", "red");
      serverMessageText.innerHTML = "Error: Invalid / Already exists";
    }
  });
});
