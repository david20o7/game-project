document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".difficulty button").forEach((button) => {
    button.addEventListener("click", (event) => {
      alert(event.target.innerText + " mode selected");
    });
  });
});
