document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const formElements = event.target.elements;
    const values = {};

    // Collect form data
    for (const formElement of Array.from(formElements)) {
      if (formElement.id) {
        const name = formElement.id;
        const value = formElement.value;
        values[name] = value;
      }
    }

    // Log form data to console (for testing purposes)
    console.log(values);
    console.log("we are in the login page");
  });

  const forgotPasswordLink = document.getElementById("forgotPasswordLink");

  forgotPasswordLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "http://localhost:3000/forgot-password/"; // Corrected the URL to match your desired endpoint
  });
});
