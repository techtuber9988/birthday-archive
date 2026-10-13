
/* =========================================
   THE DARSHIKA ARCHIVE — INTERACTIONS
========================================= */

(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Trigger scrapbook entrance animations.
  requestAnimationFrame(() => {
    document.body.classList.add("archive-ready");
  });

  // Transition when navigating to another local page.
  const overlay = document.querySelector(".page-transition");
  const localLinks = document.querySelectorAll(
    'a[href$=".html"]'
  );

  if (!overlay || reduceMotion) return;

  localLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);

      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname) return;

      event.preventDefault();
      overlay.classList.add("is-active");

      window.setTimeout(() => {
        window.location.href = link.href;
      }, 520);
    });
  });
})();
