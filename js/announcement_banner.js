(function () {
  const banner = document.querySelector("[data-banner]");
  if (!banner) return;

  // Versioniere den Key, falls du später einen neuen Hinweis zeigen willst
  const STORAGE_KEY = "cxn_announcement_v2025-01";

  // Wenn bereits geschlossen → nicht anzeigen
  try {
    if (window.localStorage.getItem(STORAGE_KEY) === "dismissed") {
      banner.remove();
      return;
    }
  } catch (e) {
    // localStorage evtl. geblockt – dann einfach ignorieren
  }

  const closeBtn = banner.querySelector("[data-banner-close]");
  if (!closeBtn) return;

  function dismissBanner() {
    banner.setAttribute("hidden", "hidden");
    try {
      window.localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch (e) {
      // Ignorieren, wenn nicht möglich
    }
  }

  closeBtn.addEventListener("click", dismissBanner);

  // Optional: ESC-Taste zum Schließen, wenn Fokus im Banner ist
  banner.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.key === "Esc") {
      dismissBanner();
    }
  });
})();
