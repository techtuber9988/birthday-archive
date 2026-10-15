
(() => {
  "use strict";

  const page = document.querySelector(".academics-page");
  if (!page) return;

  // Reveal each section when it enters the viewport.
  const revealItems = document.querySelectorAll(".academic-reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("academic-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("academic-visible"));
  }

  // Smooth scrolling for internal sections.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");
      if (!selector || selector === "#") return;

      const target = document.querySelector(selector);
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

  // Animate navigation between local HTML pages.
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
        window.location.href = link.href;
      }, 520);
    });
  });
})();
