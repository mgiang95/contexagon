(() => {
  const root = document.querySelector(".case-carousel");
  if (!root) return;

  const track = root.querySelector(".case-carousel__track");
  const btnPrev = root.querySelector(".case-carousel__btn--prev");
  const btnNext = root.querySelector(".case-carousel__btn--next");
  const btnToggle = root.querySelector(".case-carousel__btn--toggle");
  const live = root.querySelector(".case-carousel__sr");

  // ===== Settings / Tuning =====
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const GAP =
    parseFloat(
      getComputedStyle(root).getPropertyValue("--c-case-carousel-card-gap")
    ) || 20;
  const SPEED_PX_S = 38;
  const FRICTION = 0.002;
  const DRAG_THRESHOLD = 14;
  const DRAG_TIME_MS = 80;
  const HORIZ_FACTOR = 1.6;
  const MAX_VELOCITY = 2.2;
  const REPEATS = 3;

  // iOS/Touchevents
  const ua = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const supportsPointer = !!window.PointerEvent && !isIOS;

  // Input-Modalität
  let lastInput = "pointer";
  window.addEventListener(
    "keydown",
    (e) => {
      if (
        ["Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
          e.key
        )
      )
        lastInput = "keyboard";
    },
    { capture: true }
  );
  window.addEventListener(
    "mousedown",
    () => {
      lastInput = "pointer";
    },
    { capture: true }
  );
  window.addEventListener(
    "touchstart",
    () => {
      lastInput = "pointer";
    },
    { capture: true }
  );

  const disableNativeDrag = (scope) => {
    scope.querySelectorAll("img, a").forEach((el) => {
      el.setAttribute("draggable", "false");
      el.addEventListener("dragstart", (e) => e.preventDefault());
    });
  };
  const waitForImages = () => {
    const imgs = Array.from(track.querySelectorAll("img"));
    return Promise.all(
      imgs.map((img) => {
        if (img.complete) return img.decode?.().catch(() => {});
        return new Promise((res) => {
          const done = () => {
            img.decode?.().finally(res) || res();
          };
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        });
      })
    );
  };

  // Basissequenz
  let baseSlides = Array.from(track.children);
  disableNativeDrag(track);

  let widths = [];
  let loopW = 0;
  function measure() {
    widths = baseSlides.map((li) => li.getBoundingClientRect().width);
    loopW = widths.reduce((s, w) => s + w, 0) + GAP * (widths.length - 1);
  }
  function buildLoop() {
    const html = baseSlides.map((li) => li.outerHTML).join("");
    for (let i = 1; i < REPEATS; i++)
      track.insertAdjacentHTML("beforeend", html);
    disableNativeDrag(track);
  }

  // Bewegung
  let x = 0;
  let rafId = null,
    lastTs = 0;
  let paused = false,
    hoverPaused = false;

  // Drag/Momentum
  let isDown = false,
    dragActive = false;
  let downTime = 0;
  let lastX = 0,
    lastT = 0,
    velocity = 0,
    accumX = 0,
    accumY = 0,
    lastTouchY = 0;

  // Tastaturschritt
  let idx = 0;

  function applyTransform() {
    if (!loopW) return;
    let mod = x % loopW;
    if (mod < 0) mod += loopW;
    track.style.transform = `translate3d(${-mod}px,0,0)`;
  }
  const announce = (m) => {
    if (live) live.textContent = m;
  };

  function togglePause(force) {
    const next = typeof force === "boolean" ? force : !paused;
    paused = next;
    if (btnToggle) {
      btnToggle.setAttribute("aria-pressed", String(paused));
      btnToggle.textContent = paused ? "Play" : "Pause";
      btnToggle.setAttribute(
        "aria-label",
        paused ? "Autoplay fortsetzen" : "Autoplay pausieren"
      );
    }
    if (!paused) {
      hoverPaused = false;
      document.activeElement?.blur?.();
    }
    announce(paused ? "Autoplay pausiert." : "Autoplay läuft.");
    if (!rafId) rafId = requestAnimationFrame(frame);
  }

  function stepOne(dir) {
    if (!widths.length) return;
    if (dir === "next") {
      x += widths[idx] + GAP;
      idx = (idx + 1) % widths.length;
    } else {
      idx = (idx - 1 + widths.length) % widths.length;
      x -= widths[idx] + GAP;
    }
    velocity = 0;
    applyTransform();
  }

  function frame(ts) {
    if (!lastTs) lastTs = ts;
    let dt = ts - lastTs;
    lastTs = ts;
    if (dt < 0) dt = 0;

    if (dragActive && Math.abs(velocity) > 0.02) {
      x += velocity * dt;
      const sign = Math.sign(velocity);
      velocity -= sign * FRICTION * dt;
      if (Math.abs(velocity) < 0.02) velocity = 0;
    } else if (!paused && !hoverPaused && !prefersReduced) {
      x += SPEED_PX_S * (dt / 1000);
    }
    applyTransform();
    rafId = requestAnimationFrame(frame);
  }

  // Re-Measure bei Resize/Orientation
  let resizeTimer = 0;
  function remeasureAndNormalize() {
    if (!loopW) return;
    const oldLoop = loopW;
    let modOld = x % oldLoop;
    if (modOld < 0) modOld += oldLoop;
    const progress = modOld / oldLoop;
    measure();
    if (!loopW) return;
    x = progress * loopW;
    idx = 0; // optional: oder näheren Index bestimmen
    applyTransform();
  }
  const debouncedRemeasure = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(remeasureAndNormalize, 150);
  };
  window.addEventListener("resize", debouncedRemeasure);
  window.addEventListener("orientationchange", debouncedRemeasure);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") debouncedRemeasure();
  });

  // Drag Helpers
  function startDrag(px) {
    isDown = true;
    dragActive = false;
    velocity = 0;
    downTime = performance.now();
    lastX = px;
    lastT = performance.now();
    accumX = 0;
    accumY = 0;
    root.classList.add("is-dragging");
  }
  function moveDrag(px, dy, preventDefault) {
    if (!isDown) return;
    const now = performance.now();
    const dx = px - lastX;
    const dt = now - lastT;

    accumX += Math.abs(dx);
    accumY += Math.abs(dy);
    const timeOk = now - downTime >= DRAG_TIME_MS;
    const distOk = accumX > DRAG_THRESHOLD;
    const horizOk = accumX > accumY * HORIZ_FACTOR;

    if (!dragActive && timeOk && distOk && horizOk) dragActive = true;

    if (dragActive) {
      preventDefault();
      x -= dx;
      let v = -(dx / Math.max(dt, 1));
      if (v > MAX_VELOCITY) v = MAX_VELOCITY;
      if (v < -MAX_VELOCITY) v = -MAX_VELOCITY;
      velocity = v;
      applyTransform();
    }
    lastX = px;
    lastT = now;
  }
  function endDrag() {
    if (!isDown) return;
    isDown = false;
    root.classList.remove("is-dragging");
    if (!dragActive) {
      velocity = 0;
      return;
    }
    dragActive = Math.abs(velocity) >= 0.02;

    if (accumX > 6) {
      const kill = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        track.removeEventListener("click", kill, true);
      };
      track.addEventListener("click", kill, true);
    }
  }

  // Events (Pointer vs Touch)
  if (supportsPointer) {
    track.addEventListener("pointerdown", (e) => {
      track.setPointerCapture?.(e.pointerId);
      startDrag(e.clientX);
    });
    track.addEventListener(
      "pointermove",
      (e) => moveDrag(e.clientX, 0, () => e.preventDefault()),
      { passive: false }
    );
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
  } else {
    track.addEventListener(
      "touchstart",
      (e) => {
        const t = e.touches[0];
        if (!t) return;
        startDrag(t.clientX);
      },
      { passive: true }
    );
    track.addEventListener(
      "touchmove",
      (e) => {
        const t = e.touches[0];
        if (!t) return;
        const prevY = (e._lastY ||= t.clientY);
        const dy = t.clientY - prevY;
        e._lastY = t.clientY;
        moveDrag(t.clientX, dy, () => e.preventDefault());
      },
      { passive: false }
    );
    track.addEventListener("touchend", endDrag, { passive: true });
    track.addEventListener("touchcancel", endDrag, { passive: true });
  }

  // Hover / Focus (nur Keyboard pausiert)
  root.addEventListener("mouseenter", () => {
    hoverPaused = true;
    announce("Autoplay pausiert (Hover).");
  });
  root.addEventListener("mouseleave", () => {
    hoverPaused = false;
    announce("Autoplay läuft.");
  });
  root.addEventListener("focusin", () => {
    if (lastInput === "keyboard") {
      hoverPaused = true;
      announce("Autoplay pausiert (Fokus).");
    }
  });
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) {
      hoverPaused = false;
      announce("Autoplay läuft.");
    }
  });

  // Buttons & Keyboard
  const bindActivate = (el, fn) => {
    if (!el) return;
    el.addEventListener("click", fn);
    el.addEventListener("touchend", fn, { passive: true });
    el.addEventListener("pointerup", fn);
  };
  bindActivate(btnPrev, () => stepOne("prev"));
  bindActivate(btnNext, () => stepOne("next"));
  bindActivate(btnToggle, () => togglePause());

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      stepOne("next");
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepOne("prev");
    }
    if (e.code === "Space") {
      e.preventDefault();
      togglePause();
    }
  });

  // Init
  (async () => {
    await waitForImages();
    baseSlides = Array.from(track.children);
    measure();
    buildLoop();
    applyTransform();

    if (prefersReduced) {
      togglePause(true);
      btnToggle?.setAttribute("aria-hidden", "true");
      btnToggle?.setAttribute("tabindex", "-1");
      announce("Autoplay deaktiviert (Bewegung reduzieren).");
    }
    if (!root.hasAttribute("tabindex")) root.setAttribute("tabindex", "0");
    rafId = requestAnimationFrame(frame);
  })();

  window.addEventListener("pagehide", () => {
    if (rafId) cancelAnimationFrame(rafId);
  });
})();
