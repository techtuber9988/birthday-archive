
(() => {
  "use strict";

  const page = document.querySelector(".little-page");
  if (!page) return;

  // ==========================================
  // 1. SCROLL REVEAL
  // ==========================================
  const revealItems = document.querySelectorAll(".reveal");

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
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

  // ==========================================
  // 2. SMOOTH INTERNAL NAVIGATION
  // ==========================================
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

  // ==========================================
  // 3. SONG LIBRARY
  // ==========================================
  // If your downloaded files have different names,
  // update the paths below to match your real files.
  const songs = {
    aditi: {
      title: "Kabhi Kabhi Aditi",
      kicker: "THE FIRST ONE",
      message: "A little reminder of our friendship. ♡",
      symbol: "♪",
      src: "../assets/audio/kabhi-kabhi-aditi.mp3",
    },

    dost: {
      title: "Tu Meri Dost Hai",
      kicker: "MY DEDICATION",
      message: "This one came from me, just for you. ♡",
      symbol: "♡",
      src: "../assets/audio/tu-meri-dost-hai.mp3",
    },

    beinteha: {
      title: "Be Inteha",
      kicker: "HER VOICE · MY FAVOURITE",
      message: "Your voice, a memory I want to keep. ♡",
      symbol: "♫",
      src: "../assets/audio/be-inteha-darshika.m4a",
    },
  };

  const audio = document.querySelector("#music-audio");
  const songCards = document.querySelectorAll("[data-song]");
  const playerTitle = document.querySelector("#player-title");
  const playerKicker = document.querySelector("#player-kicker");
  const playerMessage = document.querySelector("#player-message");
  const playerStatus = document.querySelector("#player-status");
  const playButton = document.querySelector("#play-button");
  const playIcon = document.querySelector("#play-icon");
  const restartButton = document.querySelector("#restart-button");
  const muteButton = document.querySelector("#mute-button");
  const progress = document.querySelector("#music-progress");
  const currentTimeLabel = document.querySelector("#current-time");
  const durationLabel = document.querySelector("#duration");
  const vinyl = document.querySelector(".vinyl");
  const vinylSymbol = document.querySelector("#vinyl-symbol");

  let currentSong = null;
  let isLoading = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  function setStatus(message) {
    if (playerStatus) {
      playerStatus.textContent = message;
    }
  }

  function setPlayingUI(isPlaying) {
    if (playIcon) {
      playIcon.textContent = isPlaying ? "Ⅱ" : "▶";
    }

    if (playButton) {
      playButton.setAttribute(
        "aria-label",
        isPlaying ? "Pause song" : "Play song"
      );
    }

    if (vinyl) {
      vinyl.classList.toggle("is-playing", isPlaying);
    }
  }

  function updateProgress() {
    if (!audio || !progress) return;

    const duration = audio.duration;
    const current = audio.currentTime;

    progress.value =
      Number.isFinite(duration) && duration > 0
        ? (current / duration) * 100
        : 0;

    if (currentTimeLabel) {
      currentTimeLabel.textContent = formatTime(current);
    }

    if (durationLabel) {
      durationLabel.textContent = formatTime(duration);
    }
  }

  function selectSong(songKey) {
    const song = songs[songKey];
    if (!song || !audio) return;

    const sameSong = currentSong === songKey;

    if (sameSong) {
      if (audio.paused) {
        playCurrentSong();
      } else {
        audio.pause();
      }
      return;
    }

    currentSong = songKey;
    isLoading = true;

    audio.pause();
    setPlayingUI(false);

    songCards.forEach((card) => {
      const selected = card.dataset.song === songKey;

      card.classList.toggle("is-active", selected);
      card.setAttribute("aria-pressed", String(selected));

      const action = card.querySelector(".song-action");
      if (action) {
        action.textContent = selected ? "♪" : "▶";
      }
    });

    if (playerTitle) playerTitle.textContent = song.title;
    if (playerKicker) playerKicker.textContent = song.kicker;
    if (playerMessage) playerMessage.textContent = song.message;
    if (vinylSymbol) vinylSymbol.textContent = song.symbol;

    if (progress) progress.value = 0;
    if (currentTimeLabel) currentTimeLabel.textContent = "0:00";
    if (durationLabel) durationLabel.textContent = "0:00";

    setStatus("Loading your song ♡");

    // Reset the old track and load the selected local audio file.
    audio.removeAttribute("src");
    audio.load();

    audio.src = song.src;
    audio.load();
  }

  async function playCurrentSong() {
    if (!audio || !currentSong) {
      setStatus("Choose a song first ♡");
      return;
    }

    if (isLoading || audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
      if (audio.error) {
        setStatus("Couldn't load this song. Check the audio filename and path.");
        return;
      }

      setStatus("Getting your song ready ♡");
      audio.addEventListener(
        "canplay",
        () => {
          if (currentSong) playCurrentSong();
        },
        { once: true }
      );
      return;
    }

    try {
      await audio.play();
      setPlayingUI(true);
      setStatus("Playing just for you ♡");
    } catch (error) {
      setPlayingUI(false);
      setStatus(
        "Couldn't play this file. Check its format and location."
      );
    }
  }

  if (audio) {
    audio.addEventListener("loadstart", () => {
      isLoading = true;
    });

    audio.addEventListener("canplay", () => {
      isLoading = false;
      updateProgress();

      if (currentSong && audio.paused) {
        setStatus("Ready to play ♡");
      }
    });

    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("durationchange", updateProgress);

    audio.addEventListener("playing", () => {
      isLoading = false;
      setPlayingUI(true);
      setStatus("Playing just for you ♡");
    });

    audio.addEventListener("pause", () => {
      setPlayingUI(false);

      if (!audio.ended && currentSong) {
        setStatus("Paused. Your song is right here ♡");
      }
    });

    audio.addEventListener("ended", () => {
      setPlayingUI(false);

      if (progress) progress.value = 100;

      setStatus("One little song, one little memory. ♡");
    });

    audio.addEventListener("error", () => {
      isLoading = false;
      setPlayingUI(false);

      if (currentSong) {
        setStatus(
          "Song not found. Check the filename and assets/audio folder."
        );
      }
    });
  }

  // Click a song card to select and play it.
  songCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectSong(card.dataset.song);
    });
  });

  // Play / pause.
  if (playButton) {
    playButton.addEventListener("click", () => {
      if (!currentSong) {
        selectSong("aditi");
        return;
      }

      if (audio.paused) {
        playCurrentSong();
      } else {
        audio.pause();
      }
    });
  }

  // Restart current song.
  if (restartButton) {
    restartButton.addEventListener("click", () => {
      if (!audio || !currentSong) {
        selectSong("aditi");
        return;
      }

      audio.currentTime = 0;
      playCurrentSong();
    });
  }

  // Seek through the song.
  if (progress) {
    progress.addEventListener("input", () => {
      if (
        audio &&
        Number.isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        audio.currentTime =
          (Number(progress.value) / 100) * audio.duration;
      }
    });
  }

  // Mute / unmute.
  if (muteButton && audio) {
    muteButton.addEventListener("click", () => {
      audio.muted = !audio.muted;
      muteButton.textContent = audio.muted ? "×" : "♫";
      muteButton.setAttribute(
        "aria-label",
        audio.muted ? "Unmute audio" : "Mute audio"
      );
    });
  }

  // ==========================================
  // 4. DARSHIKA'S PERSONAL M4A RECORDING
  // ==========================================
  const personalAudio = document.querySelector("#darshika-audio");
  const audioStatus = document.querySelector("#audio-status");

  if (personalAudio && audioStatus) {
    const personalSource = personalAudio.dataset.audioSrc;

    personalAudio.controls = true;

    if (personalSource) {
      personalAudio.src = personalSource;
      personalAudio.load();

      personalAudio.addEventListener("canplay", () => {
        audioStatus.textContent = "Her recording is ready to play ♡";
      });

      personalAudio.addEventListener("playing", () => {
        audioStatus.textContent = "A little piece of her, playing just for you ♡";
      });

      personalAudio.addEventListener("pause", () => {
        if (!personalAudio.ended && personalAudio.currentTime > 0) {
          audioStatus.textContent = "Paused. Listen again whenever you want ♡";
        }
      });

      personalAudio.addEventListener("ended", () => {
        audioStatus.textContent = "Hope that made your day a little better ♡";
      });

      personalAudio.addEventListener("error", () => {
        audioStatus.textContent =
          "Recording not found. Check the M4A filename and path.";
      });
    } else {
      audioStatus.textContent = "Add your recording's file path here ♡";
    }
  }

  // ==========================================
  // 5. PAGE TRANSITIONS
  // ==========================================
  const transition = document.querySelector(".little-transition");

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
