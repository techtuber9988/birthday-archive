
(() => {
  const loader = document.querySelector("#birthday-loader");
  const openArchive = document.querySelector("#open-archive");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let navigating = false;

  // Hide the birthday intro after a short opening moment.
  function hideLoader() {
    if (!loader) return;

    loader.classList.add("is-hidden");
    loader.setAttribute("aria-hidden", "true");
  }

  if (loader) {
    window.addEventListener("load", () => {
      window.setTimeout(hideLoader, reduceMotion ? 0 : 1600);
    });

    // Fallback in case the load event already fired.
    if (document.readyState === "complete") {
      window.setTimeout(hideLoader, reduceMotion ? 0 : 1600);
    }
  }

  // Homepage -> Archive transition.
  if (openArchive) {
    openArchive.addEventListener("click", (event) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      event.preventDefault();

      if (navigating) return;
      navigating = true;

      const destination = openArchive.href;

      if (reduceMotion) {
        window.location.href = destination;
        return;
      }

      hideLoader();
      document.body.classList.add("is-leaving");

      window.setTimeout(() => {
        window.location.href = destination;
      }, 650);
    });
  }

  // Reveal the homepage after returning with the browser Back button.
  if (document.body.classList.contains("is-entering")) {
    requestAnimationFrame(() => {
      document.body.classList.remove("is-entering");
    });
  }
})();
