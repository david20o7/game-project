window.addEventListener("DOMContentLoaded", () => {
  const registerButton = document.getElementById("registerButton");
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  registerButton.addEventListener("click", (event) => {
    event.preventDefault();

    localStorage.setItem("username", username.value);
    localStorage.setItem("password", password.value);

    console.log(username.value);
    console.log(password.value);
  });
});
