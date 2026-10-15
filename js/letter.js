
(() => {
  "use strict";

  const page = document.querySelector(".letter-page");
  if (!page) return;

  // Reveal cards and letter as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Smooth scroll for the letter CTA and any internal links.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");
      if (!selector || selector === "#") return;

      const target = document.querySelector(selector);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  });

  // Animated transitions between local HTML pages.
  const transition = document.querySelector(".page-transition");

  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!transition) return;

      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank"
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);

      if (destination.origin !== window.location.origin) return;

      event.preventDefault();
      transition.classList.add("is-active");

      window.setTimeout(() => {
        window.location.href = destination.href;
      }, 460);
    });
  });
})();
