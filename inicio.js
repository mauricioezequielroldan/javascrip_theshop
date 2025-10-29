document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnIngresar");
  if (btn) {
    btn.addEventListener("click", () => {
      window.location.href = "./main.html";
    });
  }
});