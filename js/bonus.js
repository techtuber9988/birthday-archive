
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const claimButton = $("claim-reward");
  const revealButton = $("reveal-evidence");
  const songButton = $("play-birthday-song");
  const replayButton = $("replay-song");
  const continueButton = $("continue-to-song");

  const stageTwo = $("stage-two");
  const stageThree = $("stage-three");
  const stageFour = $("stage-four");

  const scannerLine = $("scanner-line");
  const scanStatus = $("scan-status");
  const scanResults = $("scan-results");

  const video = $("comedy-video");
  const song = $("birthday-song");

  const audioStatus = $("audio-status");
  const songControls = $("song-controls");
  const birthdayChaos = $("birthday-chaos");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let scannerStarted = false;
  let songStarted = false;

  function showStage(stage) {
    stage.classList.remove("bonus-hidden");
    stage.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      stage.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center"
      });
    }, 80);
  }

  // LEVEL 1: Start the fake scanner.
  claimButton.addEventListener("click", () => {
    if (scannerStarted) return;
    scannerStarted = true;

    showStage(stageTwo);
    claimButton.disabled = true;
    claimButton.textContent = "REWARD CLAIMED... MAYBE";

    scannerLine.classList.add("is-scanning");

    const messages = [
      "Initialising nonsense detector...",
      "Analysing drama levels...",
      "Checking ability to listen to advice...",
      "Measuring bestie-level bakchodi...",
      "Oh no. The results are concerning."
    ];

    let index = 0;

    scanStatus.textContent = messages[index];

    const interval = window.setInterval(() => {
      index++;

      if (index < messages.length) {
        scanStatus.textContent = messages[index];
        return;
      }

      window.clearInterval(interval);
      scannerLine.classList.remove("is-scanning");

      scanStatus.textContent =
        "SCAN COMPLETE. PROFESSIONAL MENACE CONFIRMED.";

      scanResults.classList.remove("bonus-hidden");
    }, reduceMotion ? 100 : 750);
  });

  // LEVEL 2: Reveal the comedy evidence.
  revealButton.addEventListener("click", () => {
    showStage(stageThree);
  });

  // LEVEL 3: Stop the video if playing and reveal the song.
  continueButton.addEventListener("click", () => {
    video.pause();
    showStage(stageFour);
  });

  // LEVEL 4: Play the birthday song only after the click.
  async function playBirthdaySong() {
    songStarted = true;

    songButton.disabled = true;
    songButton.textContent = "PREPARING YOUR MUSICAL DAMAGE...";

    // Reveal the final roast regardless of audio playback success.
    birthdayChaos.classList.remove("bonus-hidden");
    songControls.classList.remove("bonus-hidden");

    try {
      if (song.ended) {
        song.currentTime = 0;
      }

      await song.play();

      audioStatus.textContent =
        "HAHAHAHA HAPPY BIRTHDAY, DRAMEBAAZ. 🔊";

      songButton.textContent = "THE DAMAGE HAS BEGUN 💀";
    } catch (error) {
      audioStatus.textContent =
        "Song play nahi hua! Check the MP3 file path, then tap play again.";

      songButton.disabled = false;
      songButton.textContent = "TRY THE BIRTHDAY SONG AGAIN 🎂";
    }

    window.setTimeout(() => {
      birthdayChaos.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center"
      });
    }, 100);
  }

  songButton.addEventListener("click", playBirthdaySong);

  // Replay the local song.
  replayButton.addEventListener("click", async () => {
    try {
      song.currentTime = 0;
      await song.play();

      audioStatus.textContent =
        "ROUND TWO. THIS FRIENDSHIP HAS NO ESCAPE. 💀";
    } catch (error) {
      audioStatus.textContent =
        "Could not replay the song. Please check the audio file.";
    }
  });

  // Update the status when the song finishes.
  song.addEventListener("ended", () => {
    audioStatus.textContent =
      "SONG OVER. YOUR ROASTING SUBSCRIPTION IS STILL ACTIVE. 💀";

    songButton.disabled = false;
    songButton.textContent = "PLAY THE CHAOS AGAIN 🎂";
  });

  // Show a useful error if the local video is missing.
  video.addEventListener("error", () => {
    const frame = video.closest(".video-frame");

    if (!frame) return;

    let errorMessage = frame.querySelector(".video-error");

    if (!errorMessage) {
      errorMessage = document.createElement("p");
      errorMessage.className = "video-error";
      errorMessage.style.cssText =
        "padding:12px;text-align:center;font-size:13px;color:#7b2638;";

      errorMessage.textContent =
        "Video nahi mila! Check ../assets/darshika-comedy.mp4";

      frame.appendChild(errorMessage);
    }
  });

  // Make sure the ending is shown only when the song button is clicked.
  if (songStarted) {
    birthdayChaos.classList.add("bonus-hidden");
  }
})();
