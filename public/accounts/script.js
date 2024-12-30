document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

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
});
