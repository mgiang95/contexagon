document.addEventListener("DOMContentLoaded", function () {
  let btnBack = document.querySelectorAll(".button-back");
  for (let i = 0; i < btnBack.length; i++) {
    btnBack[i].addEventListener("click", function (e) {
      e.preventDefault();
      window.history.back();
    });
  }
});
