const backgroundImage = document.querySelector(".subpage-bg-img");

if (backgroundImage) {
  window.addEventListener("scroll", function () {
    const blurThreshold = 100;

    if (window.scrollY > blurThreshold) {
      backgroundImage.classList.add("blurred-darkened");
    } else {
      backgroundImage.classList.remove("blurred-darkened");
    }
  });
}
