document.addEventListener("DOMContentLoaded", () => {
  const carousell = document.querySelector(".card-carousell");

  const carousellObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          carousell.classList.add("fade-in"); // Startet die Einblendung
          startRotation(); // Startet die Karussell-Rotation
          carousellObserver.unobserve(carousell); // Beobachtung beenden
        }
      });
    },
    { threshold: 0.3 }
  );

  if (carousell) carousellObserver.observe(carousell);
});

const mobileQuery = window.matchMedia("(max-width: 768px)");

function updateImagesSrc(e) {
  const carousell_1 = document.getElementById("carousell_solutions-1");
  const carousell_2 = document.getElementById("carousell_solutions-2");
  const carousell_3 = document.getElementById("carousell_solutions-3");
  const carousell_4 = document.getElementById("carousell_solutions-4");

  /*
  if (e.matches) {
    carousell_1.src = "img/assets/img-cruise-mobile.jpg";
    carousell_2.src = "img/assets/img-korea_hike-mobile.jpg";
    carousell_3.src = "img/assets/img-sleepover-mobile.jpg";
    carousell_4.src = "img/assets/img-korea_hanbok-mobile.jpg";
    console.log("images switched into mobile");
  } else {
    carousell_1.src = "img/assets/img-cruise.jpg";
    carousell_2.src = "img/assets/img-korea_hike.jpg";
    carousell_3.src = "img/assets/img-sleepover.jpg";
    carousell_4.src = "img/assets/img-beach.jpg";
    console.log("images switched into desktop");
  }
  */

  updateImagesSrc(mobileQuery);
}
// Event-Listener only for Media Query-changes
// mobileQuery.addEventListener("change", updateImagesSrc);

////// Card-Img-Carousell
let currentIndex = -1;
const cardSections = document.querySelectorAll(".card-carousell-section");
const indicatorDots = document.querySelectorAll(
  ".card-carousell-indicator-dot"
);
let intervalId; // Variable zum Speichern des Intervalls
let timeoutId; // Timeout für die Verzögerung

function showSection(index) {
  // Entferne die aktive Klasse von allen Indikatoren
  indicatorDots.forEach((dot, i) => {
    cardSections[i].style.opacity = 0; // Macht die vorherige Sektion unsichtbar
    dot.classList.remove("active"); // Entferne Balkenwachstum
    // Zurücksetzen der Animation durch Reflow:
    void dot.offsetWidth; // Trigger reflow/reset
  });

  // Zeige die neue Sektion und starte das Balkenwachstum
  cardSections[index].style.opacity = 1;
  indicatorDots[index].classList.add("active"); // Balkenwachstum aktivieren
}

function resetRotationDelay() {
  // Stoppe das aktuelle Intervall und starte die Rotation nach 5 Sekunden neu
  clearInterval(intervalId);
  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % cardSections.length;
      showSection(currentIndex);
    }, 5000);
  }, 5000);
}

// Funktion zum Starten der Rotation mit einem kürzeren ersten Timeout
function startRotation() {
  // Erstes Bild sofort anzeigen
  showSection(0);
  currentIndex = 0;

  // Nach einer Verzögerung die Rotation starten
  timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % cardSections.length;
      showSection(currentIndex);
    }, 5000);
  }, 5000); // Erste Verzögerung
  console.log("funktioniere ich?");
}

// Klickbare Indikatoren
indicatorDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index; // Setze den aktuellen Index
    showSection(index); // Zeige die entsprechende Sektion
    resetRotationDelay(); // Verzögere die automatische Rotation
  });
});
