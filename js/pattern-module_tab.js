document.querySelectorAll("[data-module-tabs]").forEach((tabsComponent) => {
  const tablist = tabsComponent.querySelector('[role="tablist"]');
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

  const getPanel = (tab) => {
    const panelId = tab.getAttribute("aria-controls");
    return tabsComponent.querySelector("#" + panelId);
  };

  const activateTab = (tab) => {
    // Tabs updaten
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.setAttribute("tabindex", selected ? "0" : "-1");
      t.classList.toggle("is-active", selected);

      const panel = getPanel(t);
      if (!panel) return;
      if (selected) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });

    tab.focus();
  };

  // Click aktivieren
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
    });

    tab.addEventListener("keydown", (event) => {
      const key = event.key;

      const currentIndex = tabs.indexOf(tab);
      let newIndex = null;

      if (key === "ArrowRight" || key === "ArrowDown") {
        event.preventDefault();
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (key === "ArrowLeft" || key === "ArrowUp") {
        event.preventDefault();
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (key === "Home") {
        event.preventDefault();
        newIndex = 0;
      } else if (key === "End") {
        event.preventDefault();
        newIndex = tabs.length - 1;
      } else if (key === "Enter" || key === " ") {
        // Space
        event.preventDefault();
        activateTab(tab);
      }

      if (newIndex !== null) {
        tabs[newIndex].focus();
      }
    });
  });

  // Fallback: falls kein Tab als selected markiert ist, nimm das erste
  if (!tabs.some((t) => t.getAttribute("aria-selected") === "true")) {
    activateTab(tabs[0]);
  }
});
