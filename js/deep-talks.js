
(() => {
  "use strict";

  const page = document.querySelector(".deep-talks-page");
  if (!page) return;

  // Reveal sections as they enter the viewport.
  const revealItems = document.querySelectorAll(".dt-reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("dt-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("dt-visible"));
  }

  // Smooth scrolling for the View Memory button.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  });

  // Animate navigation to another local HTML page.
  const transition = document.querySelector(".page-transition");

  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!transition) return;

      // Preserve normal browser behavior for modified clicks.
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

      // Only animate navigation within the same website.
      if (destination.origin !== window.location.origin) return;

      event.preventDefault();
      transition.classList.add("is-active");

      window.setTimeout(() => {
        window.location.href = link.href;
      }, 520);
    });
  });
})();
