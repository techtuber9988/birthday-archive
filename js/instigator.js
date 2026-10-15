(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove("is-entering")));
  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey ||
          event.shiftKey || event.altKey || link.target === "_blank" || reduceMotion) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== location.origin || destination.href === location.href) return;
      event.preventDefault();
      document.body.classList.add("is-leaving");
      window.setTimeout(() => { window.location.href = destination.href; }, 520);
    });
  });
})();
