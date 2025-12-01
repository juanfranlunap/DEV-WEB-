window.addEventListener("DOMContentLoaded", () => {
  console.log("Página cargada correctamente.");

  const inputs = document.querySelectorAll("input[type=text]");

  inputs.forEach((i) => {
    i.addEventListener("focus", () => {
      i.style.border = "3px solid #c9b220";
    });

    i.addEventListener("blur", () => {
      i.style.border = "none";
    });
  });
});
