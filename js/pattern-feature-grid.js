(() => {
  const container = document.querySelector("[data-feature-rotator]");
  if (!container) return;

  const cards = Array.from(container.querySelectorAll(".feature-card"));
  if (!cards.length) return;

  // CSS-Custom-Properties auslesen (können im Theme/Component überschrieben werden)
  const styles = getComputedStyle(container);

  const ROTATION_INTERVAL =
    parseInt(
      styles.getPropertyValue("--c-feature-grid-rotation-interval"),
      10
    ) || 6000;

  const MIN_ACTIVE =
    parseInt(styles.getPropertyValue("--c-feature-grid-min-active"), 10) || 4;

  const MAX_ACTIVE =
    parseInt(styles.getPropertyValue("--c-feature-grid-max-active"), 10) || 6;

  const mqReduce =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

  let intervalId = null;

  function pickRandomSubset(items, count) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }

  function updateCards() {
    const clampedMin = Math.max(1, Math.min(MIN_ACTIVE, cards.length));
    const clampedMax = Math.max(clampedMin, Math.min(MAX_ACTIVE, cards.length));

    const activeCount =
      Math.floor(Math.random() * (clampedMax - clampedMin + 1)) + clampedMin;

    const activeCards = pickRandomSubset(cards, activeCount);

    cards.forEach((card) => {
      card.classList.remove("is-active", "is-muted");
      card.classList.add("is-muted");
    });

    activeCards.forEach((card) => {
      card.classList.add("is-active");
      card.classList.remove("is-muted");
    });
  }

  function startRotation() {
    if (intervalId || ROTATION_INTERVAL <= 0) return;
    intervalId = window.setInterval(updateCards, ROTATION_INTERVAL);
  }

  function stopRotation() {
    if (!intervalId) return;
    window.clearInterval(intervalId);
    intervalId = null;
  }

  function init() {
    // einmaligen Startzustand setzen
    updateCards();

    // Bei Reduced Motion keine Auto-Rotation
    if (mqReduce && mqReduce.matches) {
      return;
    }

    startRotation();

    // Live auf Änderung der System-Einstellung reagieren
    if (mqReduce) {
      mqReduce.addEventListener("change", (event) => {
        if (event.matches) {
          // User möchte weniger Bewegung → stoppen
          stopRotation();
        } else {
          // User erlaubt Bewegung → Rotation wieder starten
          startRotation();
        }
      });
    }
  }

  init();
})();
