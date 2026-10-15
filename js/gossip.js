
(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Reveal the page after navigation.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove("is-entering");
    });
  });

  // Transition for links to other HTML pages.
  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank"
      ) return;

      const destination = new URL(link.href, window.location.href);

      if (destination.origin !== window.location.origin) return;
      if (destination.href === window.location.href) return;
      if (reduceMotion) return;

      event.preventDefault();
      document.body.classList.add("is-leaving");

      window.setTimeout(() => {
        window.location.href = destination.href;
      }, 650);
    });
  });

  // Gentle reveal for the incident cards.
  const items = document.querySelectorAll(
    ".incident-card, .ragebait-note, .verdict-paper"
  );

  if (!reduceMotion && "IntersectionObserver" in window) {
    items.forEach((item) => item.classList.add("gossip-reveal"));

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
  }
})();
