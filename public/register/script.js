document.addEventListener("DOMContentLoaded", (event) => {
  const signUpButton = document.getElementById("signUpButton");

  signUpButton.addEventListener("click", () => {
    window.location.href = "http://localhost:3000/login/";
  });
});
