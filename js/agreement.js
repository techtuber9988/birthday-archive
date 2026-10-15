
/* =========================================================
   THE FRIENDSHIP AGREEMENT™
   Interactions + Signed PDF Export
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- ELEMENTS ---------- */

  const progressBar = document.getElementById("agreement-progress");

  const acceptCheckbox = document.getElementById("accept-agreement");
  const signButton = document.getElementById("sign-button");
  const signingStatus = document.getElementById("signing-status");
  const signedResult = document.getElementById("signed-result");
  const signature = document.getElementById("darshika-signature");
  const resetButton = document.getElementById("reset-signature");
  const celebrationLayer = document.getElementById("celebration-layer");

  const downloadButton = document.getElementById(
    "download-agreement-pdf"
  );
  const helperText = document.getElementById("pdf-helper-text");

  let isSigned = false;
  let signingDate = "";

  /* ---------- SCROLL PROGRESS ---------- */

  function updateProgress() {
    if (!progressBar) return;

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollableHeight > 0
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

    progressBar.style.width = `${Math.min(100, progress)}%`;
  }

  window.addEventListener("scroll", updateProgress, {
    passive: true,
  });

  window.addEventListener("resize", updateProgress);
  updateProgress();

  /* ---------- SCROLL REVEAL ---------- */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* ---------- MUTUAL CLAUSES ---------- */

  document.querySelectorAll(".clause-card").forEach((card) => {
    const checkbox = card.querySelector(".clause-check");

    if (!checkbox) return;

    checkbox.addEventListener("change", () => {
      card.classList.toggle(
        "is-acknowledged",
        checkbox.checked
      );
    });
  });

  /* ---------- TERMS AND CONDITIONS ---------- */

  document.querySelectorAll(".term-row").forEach((row) => {
    const checkbox = row.querySelector(".term-check");
    const status = row.querySelector(".term-status");

    if (!checkbox || !status) return;

    checkbox.addEventListener("change", () => {
      status.textContent = checkbox.checked
        ? "ACKNOWLEDGED"
        : "PENDING";

      row.classList.toggle(
        "is-acknowledged",
        checkbox.checked
      );
    });
  });

  /* ---------- RECEIPT STAMP ---------- */

  const receipt = document.getElementById("friendship-receipt");
  const stampButton = document.getElementById("stamp-receipt");

  if (receipt && stampButton) {
    let stampMark = receipt.querySelector(".receipt-stamp-mark");

    if (!stampMark) {
      stampMark = document.createElement("div");
      stampMark.className = "receipt-stamp-mark";
      stampMark.textContent = "VERIFIED";
      stampMark.setAttribute("aria-hidden", "true");
      receipt.appendChild(stampMark);
    }

    stampButton.addEventListener("click", () => {
      const alreadyStamped = receipt.classList.contains("is-stamped");

      receipt.classList.remove("is-stamped");
      void receipt.offsetWidth;
      receipt.classList.add("is-stamped");

      stampButton.textContent = alreadyStamped
        ? "STAMPED AGAIN ♡"
        : "BILL VERIFIED ✓";

      stampButton.setAttribute("aria-pressed", "true");

      if (reduceMotion) {
        stampMark.style.opacity = "0.9";
        stampMark.style.transform =
          "translate(-50%, -50%) rotate(-15deg) scale(1)";
      }
    });
  }

  /* ---------- CONFETTI ---------- */

  function launchCelebration() {
    if (!celebrationLayer) return;

    celebrationLayer.replaceChildren();

    if (reduceMotion) return;

    const colors = [
      "#c84235",
      "#ef8744",
      "#f3cf66",
      "#627c54",
      "#e9b7a5",
      "#fff0c9",
    ];

    for (let i = 0; i < 95; i++) {
      const piece = document.createElement("span");

      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      piece.style.animationDelay = `${Math.random() * 0.8}s`;
      piece.style.setProperty(
        "--fall-time",
        `${2.1 + Math.random() * 2}s`
      );
      piece.style.setProperty(
        "--drift",
        `${Math.round(Math.random() * 180 - 90)}px`
      );

      if (Math.random() > 0.5) {
        piece.style.borderRadius = "50%";
        piece.style.width = "8px";
        piece.style.height = "8px";
      }

      celebrationLayer.appendChild(piece);
    }

    window.setTimeout(() => {
      celebrationLayer.replaceChildren();
    }, 5200);
  }

  /* ---------- SIGNING CEREMONY ---------- */

  function updateSignButton() {
    if (!acceptCheckbox || !signButton) return;

    signButton.disabled =
      !acceptCheckbox.checked || isSigned;

    if (isSigned) {
      if (signingStatus) {
        signingStatus.textContent =
          "The agreement has already been acknowledged. ♡";
      }
      return;
    }

    if (signingStatus) {
      signingStatus.textContent = acceptCheckbox.checked
        ? "Consent received. Madam may now sign. ✍"
        : "Waiting for Darshika's very important decision...";
    }
  }

  function showDownloadButton() {
    if (downloadButton) downloadButton.hidden = false;
    if (helperText) helperText.hidden = false;
  }

  function hideDownloadButton() {
    if (downloadButton) downloadButton.hidden = true;
    if (helperText) helperText.hidden = true;
  }

  // Also expose this function for the signing ceremony.
  window.showAgreementDownload = showDownloadButton;

  if (
    acceptCheckbox &&
    signButton &&
    signedResult &&
    signature
  ) {
    signedResult.hidden = true;
    hideDownloadButton();

    acceptCheckbox.addEventListener("change", updateSignButton);

    signButton.addEventListener("click", () => {
      if (!acceptCheckbox.checked || isSigned) return;

      isSigned = true;

      signingDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      signature.textContent = "Darshika ✍";
      signature.classList.add("is-signed");

      signedResult.hidden = false;

      signButton.disabled = true;
      signButton.textContent = "AGREEMENT ACKNOWLEDGED ✓";

      if (signingStatus) {
        signingStatus.textContent =
          "A historic moment in friendship law. 😭❤️";
      }

      showDownloadButton();
      launchCelebration();

      signedResult.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
    });

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        isSigned = false;
        signingDate = "";

        signedResult.hidden = true;

        signature.textContent = "Your signature goes here...";
        signature.classList.remove("is-signed");

        acceptCheckbox.checked = false;

        signButton.disabled = true;
        signButton.innerHTML =
          'SIGN THE AGREEMENT <span>↗</span>';

        hideDownloadButton();

        if (signingStatus) {
          signingStatus.textContent =
            "Waiting for Darshika's very important decision...";
        }

        if (celebrationLayer) {
          celebrationLayer.replaceChildren();
        }

        updateSignButton();

        document.getElementById("sign-agreement")?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  }

  /* ---------- INTERNAL ANCHOR SCROLLING ---------- */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  /* =========================================================
     PDF EXPORT HELPERS
     ========================================================= */

  function createPDFWriter(doc) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    let y = 20;

    function ensureSpace(height) {
      if (y + height > pageHeight - 17) {
        doc.addPage();
        y = 20;
      }
    }

    function text(value, options = {}) {
      const {
        size = 10,
        color = [65, 55, 46],
        bold = false,
        gap = 3,
      } = options;

      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(...color);

      const lines = doc.splitTextToSize(
        String(value ?? ""),
        contentWidth
      );

      const lineHeight = size * 0.45;
      const totalHeight = lines.length * lineHeight + gap;

      ensureSpace(totalHeight);

      doc.text(lines, margin, y);
      y += totalHeight;
    }

    function heading(value) {
      y += 3;

      text(value, {
        size: 13,
        bold: true,
        color: [168, 50, 50],
        gap: 5,
      });
    }

    function divider() {
      ensureSpace(10);

      doc.setDrawColor(198, 91, 69);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(margin, y, pageWidth - margin, y);
      doc.setLineDashPattern([], 0);

      y += 8;
    }

    return { text, heading, divider };
  }

  function collectCheckboxStatus(checkbox, selector) {
    const row = checkbox.closest(selector);

    if (!row) return null;

    const label = row.innerText
      .replace(/\s+/g, " ")
      .trim();

    return {
      text: label,
      status: checkbox.checked
        ? "ACKNOWLEDGED"
        : "NOT ACKNOWLEDGED",
    };
  }

  function addPageFooters(doc) {
    const totalPages = doc.internal.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setDrawColor(225, 196, 157);
      doc.line(18, pageHeight - 12, pageWidth - 18, pageHeight - 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(125, 105, 85);

      doc.text(
        "THE FRIENDSHIP ARCHIVE  |  AYUSH × DARSHIKA",
        18,
        pageHeight - 7
      );

      doc.text(
        `Page ${page} of ${totalPages}`,
        pageWidth - 18,
        pageHeight - 7,
        { align: "right" }
      );
    }
  }

  /* ---------- GENERATE AND DOWNLOAD PDF ---------- */

  if (downloadButton) {
    downloadButton.addEventListener("click", () => {
      // Validate the actual signing state and actual HTML IDs.
      const signedName = signature?.textContent?.trim() || "";

      const ceremonyComplete =
        isSigned &&
        Boolean(acceptCheckbox?.checked) &&
        signedName === "Darshika ✍" &&
        Boolean(signedResult && !signedResult.hidden) &&
        Boolean(signButton?.disabled);

      if (!ceremonyComplete) {
        alert("Pehle agreement ki signing ceremony complete karo! ♡");
        return;
      }

      if (!window.jspdf?.jsPDF) {
        alert(
          "PDF library load nahi hui. jspdf.umd.min.js ka path check karo."
        );
        console.error(
          "jsPDF unavailable. Check ../assets/js/jspdf.umd.min.js"
        );
        return;
      }

      downloadButton.disabled = true;
      downloadButton.textContent = "PREPARING YOUR AGREEMENT…";

      try {
        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const writer = createPDFWriter(doc);

        const today = signingDate || new Date().toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        );

        /* COVER / TITLE */

        writer.text("THE DARSHIKA ARCHIVE", {
          size: 10,
          bold: true,
          color: [168, 50, 50],
          gap: 5,
        });

        writer.text("THE FRIENDSHIP", {
          size: 23,
          bold: true,
          color: [168, 50, 50],
          gap: 1,
        });

        writer.text("AGREEMENT™", {
          size: 23,
          bold: true,
          color: [168, 50, 50],
          gap: 5,
        });

        writer.text("Document No. 07 · Established Semester 2", {
          size: 10,
        });

        writer.divider();

        writer.text(
          "A playful record of snacks, gossip, academic support, mutual chaos and one very pending Domino's treat.",
          { size: 11, gap: 6 }
        );

        writer.heading("THE PARTIES");

        writer.text("Party One: Ayush");
        writer.text("Party Two: Darshika");
        writer.text(`Signing date: ${today}`);

        writer.divider();

        /* AGREEMENT PREAMBLE */

        writer.heading("PREAMBLE");

        writer.text(
          "Whereas the undersigned parties have been involved in a long-term arrangement of food exchanges, academic assistance, late-night conversations, unsolicited advice, questionable threats and an unreasonable number of reels..."
        );

        writer.text(
          "Both parties acknowledge that this friendship is not a one-day subscription, not a paid service and definitely not something either of them can escape that easily."
        );

        writer.text(
          "Therefore, this agreement is hereby proposed. Read carefully, madam.",
          { bold: true }
        );

        /* MUTUAL CLAUSES */

        writer.divider();
        writer.heading("PART I — MUTUAL OBLIGATIONS");

        document.querySelectorAll(".clause-card").forEach((card) => {
          const number = card.querySelector(".clause-number")?.innerText.trim();
          const title = card.querySelector("h3")?.innerText.trim();

          if (number || title) {
            writer.heading([number, title].filter(Boolean).join(" — "));
          }

          card.querySelectorAll(".responsibility").forEach((item) => {
            const label = item.querySelector(
              ".responsibility-label"
            )?.innerText.trim();

            const description = item.querySelector("p")?.innerText.trim();

            if (label) {
              writer.text(label, {
                size: 8,
                bold: true,
                color: [125, 92, 66],
              });
            }

            if (description) {
              writer.text(description, { size: 9.5 });
            }
          });

          const checkbox = card.querySelector(".clause-check");

          if (checkbox) {
            const label = checkbox.labels?.[0]?.innerText
              ?.replace(/\s+/g, " ")
              .trim() || "Clause acknowledgement";

            writer.text(
              `${label} — ${checkbox.checked ? "ACKNOWLEDGED" : "NOT ACKNOWLEDGED"}`,
              { size: 9, bold: true }
            );
          }

          writer.divider();
        });

        /* TERMS AND CONDITIONS */

        writer.heading("PART II — TERMS & CONDITIONS");

        document.querySelectorAll(".term-row").forEach((row) => {
          const checkbox = row.querySelector(".term-check");
          const title = row.querySelector(".term-copy strong")?.innerText.trim();
          const description = row.querySelector(".term-copy small")?.innerText.trim();
          const index = row.querySelector(".term-index")?.innerText.trim();

          writer.text(
            `${index || ""}. ${title || "Agreement term"}`,
            {
              size: 10,
              bold: true,
              color: [168, 50, 50],
            }
          );

          if (description) {
            writer.text(description, { size: 9 });
          }

          if (checkbox) {
            writer.text(
              `Status: ${checkbox.checked ? "ACKNOWLEDGED" : "PENDING"}`,
              { size: 8, bold: true, gap: 4 }
            );
          }
        });

        writer.text(
          "Legal disclaimer: This document is a playful friendship keepsake, not a legally binding contract.",
          { size: 9, gap: 5 }
        );

        /* FRIENDSHIP LEDGER */

        writer.divider();
        writer.heading("PART III — THE FRIENDSHIP LEDGER");

        writer.text(
          "THE FRIENDSHIP TUCK SHOP — Food, Favors & Feelings",
          {
            size: 12,
            bold: true,
            color: [168, 50, 50],
          }
        );

        writer.text("Account: Ayush × Darshika");
        writer.text("Period: Semester 3 → Now");

        document.querySelectorAll(
          "#friendship-receipt .ledger-entry"
        ).forEach((entry) => {
          const number = entry.querySelector(".ledger-number")?.innerText.trim();
          const title = entry.querySelector(".ledger-description strong")?.innerText.trim();
          const description = entry.querySelector(".ledger-description small")?.innerText.trim();
          const status = entry.querySelector(".ledger-tag")?.innerText.trim();

          writer.text(
            `${number || ""}. ${title || "Friendship transaction"}`,
            {
              size: 10,
              bold: true,
              color: entry.classList.contains("ledger-pending")
                ? [168, 50, 50]
                : [65, 55, 46],
            }
          );

          if (description) {
            writer.text(description, { size: 9 });
          }

          if (status) {
            writer.text(`Status: ${status}`, {
              size: 8,
              bold: true,
              gap: 4,
            });
          }
        });

        writer.divider();

        writer.text("AMOUNT PAYABLE", {
          size: 9,
          bold: true,
          color: [168, 50, 50],
        });

        writer.text("ONE GOOD FRIENDSHIP. FOREVER.", {
          size: 13,
          bold: true,
          color: [168, 50, 50],
          gap: 5,
        });

        writer.text(
          "All transactions are non-refundable, non-transferable and valued in memories, not currency."
        );

        /* SIGNATURE */

        writer.divider();
        writer.heading("FINAL PAGE — ACCEPTANCE & ACKNOWLEDGEMENT");

        writer.text(
          "The following digital acknowledgment records the signing ceremony completed on the website. It is a keepsake, not a verified legal signature."
        );

        writer.text("Party One: Ayush", {
          size: 11,
          bold: true,
        });

        writer.text("Party Two: Darshika", {
          size: 11,
          bold: true,
        });

        writer.text("Digital signature:", {
          size: 10,
          gap: 2,
        });

        writer.text("Darshika ✍", {
          size: 20,
          bold: true,
          color: [168, 50, 50],
          gap: 5,
        });

        writer.text(`Acknowledged on: ${today}`);

        writer.divider();

        writer.text("OFFICIALLY STUCK WITH AYUSH ★", {
          size: 14,
          bold: true,
          color: [168, 50, 50],
        });

        writer.text(
          "Terms subject to snacks, gossip, mutual respect and the pending pizza promise."
        );

        addPageFooters(doc);

        doc.save("Ayush-Darshika-Signed-Friendship-Agreement.pdf");
      } catch (error) {
        console.error("Agreement PDF error:", error);

        alert(
          "PDF generate nahi ho paayi. Browser console mein error check karo."
        );
      } finally {
        downloadButton.disabled = false;
        downloadButton.innerHTML =
          "<span>📜</span> DOWNLOAD OUR SIGNED AGREEMENT <span>↗</span>";
      }
    });
  }

  /* ---------- CONSOLE NOTE ---------- */

  console.info(
    "%cTHE FRIENDSHIP AGREEMENT™",
    "font-size: 16px; font-weight: bold; color: #c84235;"
  );

  console.info(
    "All snack transactions documented. Domino's case remains pending. 🍕"
  );
});
