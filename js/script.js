// Visual preview interactions: gentle reveal on scroll and reduced-motion support.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = document.querySelectorAll(".memory-card, .promise-panel, .ending");
  if (!("IntersectionObserver" in window) || reduceMotion) return;

  cards.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform += " translateY(18px)";
    item.style.transition = "opacity 650ms ease, transform 650ms cubic-bezier(.2,.7,.2,1)";
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = "1";
      entry.target.style.transform = entry.target.style.transform.replace(" translateY(18px)", "");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  cards.forEach((item) => observer.observe(item));
})();

// Opening transition for the next archive page
(() => {
  const link = document.querySelector("#open-archive");
  const overlay = document.querySelector(".page-transition");

  if (!link || !overlay) return;

  link.addEventListener("click", (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    event.preventDefault();
    overlay.classList.add("is-active");

    window.setTimeout(() => {
      window.location.href = link.href;
    }, 520);
  });
})();

/* =========================================
   BIRTHDAY INTRO PRELOADER
========================================= */

(() => {
  const loader = document.querySelector("#birthday-loader");

  if (!loader) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Let the birthday greeting appear before revealing the homepage.
  const introDuration = reduceMotion ? 300 : 2800;

  window.setTimeout(() => {
    loader.classList.add("is-leaving");

    window.setTimeout(() => {
      loader.remove();
    }, reduceMotion ? 200 : 750);
  }, introDuration);
})();
