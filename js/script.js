
(() => {
  "use strict";

  const loader = document.querySelector("#birthday-loader");
  const openArchive = document.querySelector("#open-archive");
  const exploreContents = document.querySelector("#explore-contents");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let navigating = false;
  let fallbackTimer;

  // =====================================
  // 1. PRELOADER — MINIMUM DISPLAY TIME
  // =====================================

  // Minimum time the preloader stays visible (ms)
  const MIN_LOADER_MS = reduceMotion ? 0 : 3500;

  let pageLoaded  = false;
  let timerDone   = false;

  function tryHideLoader() {
    if (!loader) return;
    if (!pageLoaded || !timerDone) return; // wait for BOTH

    loader.classList.add("is-hidden");
    loader.setAttribute("aria-hidden", "true");

    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
  }

  function hideLoader() {
    // Force-hide (used by emergency fallback & back-nav restore)
    if (!loader) return;
    loader.classList.add("is-hidden");
    loader.setAttribute("aria-hidden", "true");
    if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
  }

  if (loader) {
    // Mark page as loaded when browser fires the load event
    window.addEventListener("load", () => {
      pageLoaded = true;
      tryHideLoader();
    }, { once: true });

    // Minimum display timer — don't hide before this fires
    fallbackTimer = setTimeout(() => {
      timerDone = true;
      tryHideLoader();
    }, MIN_LOADER_MS);

    // Emergency fallback: never leave the loader stuck no matter what
    setTimeout(hideLoader, 7000);
  }

  // =====================================
  // 2. PAGE ENTRY TRANSITION
  // =====================================

  if (document.body.classList.contains("is-entering")) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove("is-entering");
      });
    });
  }

  // =====================================
  // 3. EXPLORE CONTENTS BUTTON
  // =====================================

  if (exploreContents) {
    exploreContents.addEventListener("click", (event) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      const target = document.querySelector("#archive-index");

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      if (window.history?.replaceState) {
        window.history.replaceState(
          null,
          "",
          "#archive-index"
        );
      }
    });
  }

  // =====================================
  // 4. OPEN ARCHIVE BUTTON
  // =====================================

  if (openArchive) {
    openArchive.addEventListener("click", (event) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();

      if (navigating) return;

      navigating = true;

      const destination = openArchive.href;

      // Ensure the preloader doesn't stay over the page.
      hideLoader();

      if (reduceMotion) {
        window.location.href = destination;
        return;
      }

      document.body.classList.add("is-leaving");

      setTimeout(() => {
        window.location.href = destination;
      }, 650);
    });
  }

  // =====================================
  // 5. BROWSER BACK / RESTORE FIX
  // =====================================

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      navigating = false;

      document.body.classList.remove("is-leaving");
      document.body.classList.remove("is-entering");

      hideLoader();
    }
  });
})();
