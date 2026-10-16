
(() => {
  "use strict";

  const link = document.getElementById("bonus-surprise-link");
  if (!link) return;

  let isLoading = false;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  link.addEventListener("click", (event) => {
    // Allow new-tab and modified clicks to work normally.
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) return;

    event.preventDefault();
    if (isLoading) return;
    isLoading = true;

    const destination = link.href;

    const loader = document.createElement("div");
    loader.className = "surprise-loader";
    loader.setAttribute("role", "status");
    loader.setAttribute("aria-live", "polite");

    loader.innerHTML = `
      <div class="surprise-loader-card">
        <span class="surprise-loader-sticker">
          TOP SECRET • CLASSIFIED
        </span>

        <span class="surprise-loader-emoji" aria-hidden="true">🎁</span>

        <h2 id="surprise-loader-title">Oi, Darshika!</h2>

        <p id="surprise-loader-message">
          Tere liye kuch suspiciously special banaya hai...
          bas thoda sa wait kar, dramebaaz. 👀
        </p>

        <div
          class="surprise-progress-track"
          role="progressbar"
          aria-label="Unlocking birthday surprise"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
        >
          <div class="surprise-progress-bar"></div>
        </div>

        <span class="surprise-loader-percent">0%</span>

        <span class="surprise-loader-footnote">
          Please do not run away. Your bestie is watching. ♡
        </span>
      </div>
    `;

    document.body.appendChild(loader);

    const bar = loader.querySelector(".surprise-progress-bar");
    const percent = loader.querySelector(".surprise-loader-percent");
    const message = loader.querySelector("#surprise-loader-message");
    const title = loader.querySelector("#surprise-loader-title");
    const progress = loader.querySelector('[role="progressbar"]');

    const messages = [
  {
    at: 0,
    text: "Tere liye kuch suspiciously special banaya hai... bas thoda sa wait kar, dramebaaz. 👀"
  },
  {
    at: 20,
    text: "Checking your lifetime drama records... 📋"
  },
  {
    at: 40,
    text: "Collecting embarrassing bestie evidence... 🤡"
  },
  {
    at: 60,
    text: "Warning: excessive bakchodi detected. 💀"
  },
  {
    at: 80,
    text: "Almost there! Apni excitement control kar. 🎂"
  }
];

    let value = 0;
    let messageIndex = 0;

    requestAnimationFrame(() => {
      loader.classList.add("is-active");
    });

    // Reduced-motion users still get a brief, readable transition.
    const duration = reduceMotion ? 5000 : 10000;
    const interval = 40;
    const increment = (100 * interval) / duration;

    const timer = window.setInterval(() => {
      value = Math.min(100, value + increment);

      const rounded = Math.floor(value);
      bar.style.width = `${rounded}%`;
      percent.textContent = `${rounded}%`;
      progress.setAttribute("aria-valuenow", rounded);

      while (
        messageIndex < messages.length &&
        rounded >= messages[messageIndex].at
      ) {
        message.textContent = messages[messageIndex].text;
        messageIndex++;
      }

      if (value >= 100) {
        window.clearInterval(timer);

        title.textContent = "SURPRISE UNLOCKED!";
        message.textContent =
          "Ab jaa, apni birthday wali bakchodi enjoy kar. HAPPY BIRTHDAY! 🎉";
        loader.querySelector(".surprise-loader-emoji").textContent = "🎉";
        percent.textContent = "UNLOCKED!";
        progress.setAttribute("aria-valuenow", "100");

        window.setTimeout(() => {
          window.location.href = destination;
        }, reduceMotion ? 250 : 850);
      }
    }, interval);
  });
})();
