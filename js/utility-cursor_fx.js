document.addEventListener("mousemove", (e) => {
  const cursorCircle = document.getElementById("cursorCircle");
  if (cursorCircle) {
    const offsetX = window.scrollX;
    const offsetY = window.scrollY;
    cursorCircle.style.left = `${e.pageX - 400 - offsetX}px`;
    cursorCircle.style.top = `${e.pageY - 400 - offsetY}px`;
  }
});
