// a11y-modal-control.js
// Handles the accessibility settings modal

const A11yModal = {
  // State
  modal: null,
  trigger: null,
  closeButton: null,
  modalContainer: null,
  lastFocusedElement: null,
  isModalOpen: false,
  isModalReady: false,

  // Initialize
  init() {
    console.log("Initializing A11y modal...");

    this.modal = document.getElementById("a11y-modal");
    this.trigger = document.getElementById("a11y-trigger");
    this.closeButton = document.querySelector(".a11y-modal-close");
    this.modalContainer = document.querySelector(".a11y-modal-container");

    if (!this.modal) {
      console.error("A11y modal not found");
      return;
    }

    this.setupModal();
    this.attachEventListeners();

    console.log("A11y modal controller initialized");
  },

  // Setup modal initial state
  setupModal() {
    // Force hide with inline styles initially
    this.modal.style.cssText =
      "display: none !important; visibility: hidden !important; opacity: 0 !important;";
    this.modal.classList.remove("open");
    this.modal.setAttribute("aria-hidden", "true");

    // Mark as ready after ensuring it's hidden
    setTimeout(() => {
      this.modal.classList.add("a11y-modal-ready");
      this.isModalReady = true;
      console.log("A11y modal ready and guaranteed hidden");
    }, 50);

    // Safety checks to ensure modal stays hidden
    const safetyChecks = [100, 500, 1000, 2000];
    safetyChecks.forEach((delay) => {
      setTimeout(() => {
        if (this.modal && !this.isModalOpen) {
          this.modal.style.cssText =
            "display: none !important; visibility: hidden !important; opacity: 0 !important;";
          this.modal.classList.remove("open");
          this.modal.setAttribute("aria-hidden", "true");
        }
      }, delay);
    });
  },

  // Attach event listeners
  attachEventListeners() {
    // Trigger button
    if (this.trigger) {
      this.trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.open();
      });
    }

    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.close();
      });
    }

    // Click outside to close
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }

    // Prevent clicks inside modal from closing
    if (this.modalContainer) {
      this.modalContainer.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    // Keyboard shortcut (Alt + A)
    document.addEventListener("keydown", (e) => {
      if (!this.isModalOpen && e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        this.open();
      }
    });

    // Page visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isModalOpen) {
        this.close();
      }
    });

    // Before unload cleanup
    window.addEventListener("beforeunload", () => {
      if (this.isModalOpen) {
        document.body.style.overflow = "";
      }
    });
  },

  // Open modal
  open() {
    if (!this.modal || !this.isModalReady || this.isModalOpen) return;

    console.log("Opening A11y modal...");

    // Store current focused element
    this.lastFocusedElement = document.activeElement;
    this.isModalOpen = true;

    // Remove inline styles and let CSS take over
    this.modal.style.cssText = "";
    this.modal.setAttribute("aria-hidden", "false");

    // Add open class to trigger animation
    this.modal.classList.add("open");

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Focus management
    setTimeout(() => {
      if (this.modalContainer) {
        this.modalContainer.scrollTop = 0;
        this.modalContainer.focus();
      }
    }, 100);

    // Add keyboard event listener for this specific modal instance
    this.boundHandleKeydown = (e) => this.handleKeydown(e);
    document.addEventListener("keydown", this.boundHandleKeydown);

    // Trigger custom event
    window.dispatchEvent(new CustomEvent("a11yModalOpened"));

    console.log("A11y modal opened successfully");
  },

  // Close modal
  close() {
    if (!this.modal || !this.isModalOpen) return;

    console.log("Closing A11y modal...");

    // Remove open class to start close animation
    this.modal.classList.remove("open");

    // After animation, force hide
    setTimeout(() => {
      this.modal.style.cssText =
        "display: none !important; visibility: hidden !important; opacity: 0 !important;";
      this.modal.setAttribute("aria-hidden", "true");
      this.isModalOpen = false;
      console.log("A11y modal closed and hidden");
    }, 350);

    // Restore body scroll
    document.body.style.overflow = "";

    // Return focus
    if (this.lastFocusedElement) {
      setTimeout(() => {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }, 10);
    }

    // Remove keyboard listener
    if (this.boundHandleKeydown) {
      document.removeEventListener("keydown", this.boundHandleKeydown);
      this.boundHandleKeydown = null;
    }

    // Trigger custom event
    window.dispatchEvent(new CustomEvent("a11yModalClosed"));
  },

  // Handle keyboard events
  handleKeydown(e) {
    if (!this.isModalOpen) return;

    if (e.key === "Escape") {
      e.preventDefault();
      this.close();
      return;
    }

    if (e.key === "Tab") {
      this.trapFocus(e);
    }
  },

  // Trap focus inside modal
  trapFocus(e) {
    if (!this.modal) return;

    const focusableElements = this.modal.querySelectorAll(
      "button:not([disabled]), [href]:not([disabled]), input:not([disabled]), " +
        'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement) return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  },

  // Check if modal is open
  isOpen() {
    return this.isModalOpen;
  },
};

// Export global functions
window.A11yModal = A11yModal;
window.openA11yModal = () => A11yModal.open();
window.closeA11yModal = () => A11yModal.close();
window.isA11yModalOpen = () => A11yModal.isOpen();
A11yModal.init();
