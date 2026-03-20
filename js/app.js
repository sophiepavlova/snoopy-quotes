// Snoopy Quotes App - Main JavaScript

// ============================================================================
// DATA: Quote Collections
// ============================================================================
let QUOTES = [];

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
  currentMode: "snoopy",
  soundEnabled: true,
  isTyping: false,
  lastQuoteId: null,
  prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches,
  seasonalTheme: "spring", // or null / "winter"
};
let typingRunId = 0;

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const elements = {
  quoteText: document.getElementById("quoteText"),
  quoteAuthor: document.getElementById("quoteAuthor"),
  snoopyBtn: document.getElementById("snoopyBtn"),
  characterImg: document.getElementById("characterImg"),
  paperSection: document.querySelector(".paper"),
  sheetHandle: document.getElementById("sheetHandle"),
  sheetInstruction: document.getElementById("sheetInstruction"),
  clickMeLabel: document.getElementById("clickMeLabel"),
  soundToggle: document.getElementById("soundToggle"),
  soundStatus: document.getElementById("soundStatus"),
  themeToggle: document.getElementById("themeToggle"),
  themeStatus: document.getElementById("themeStatus"),
  seasonalOverlay: document.getElementById("seasonalOverlay"),
  modeButtons: document.querySelectorAll(".mode-selector__btn"),
  modeHint: document.getElementById("modeHint"),
  regenQuoteBtn: document.getElementById("regenQuoteBtn"),
  regenQuoteLabel: document.getElementById("regenQuoteLabel"),
  regenQuoteIcon: document.querySelector("#regenQuoteBtn img"),
};

const CHARACTER_ASSETS = {
  snoopy: {
    src: "assets/images/snoopy-typewriter.png",
    alt: "Snoopy typing on a typewriter",
    ariaLabel: "Generate a new quote with Snoopy",
  },
  lucy: {
    src: "assets/images/lucy-booth.png",
    alt: "Lucy at a typewriter",
    ariaLabel: "Generate a new quote with Lucy",
  },
  charlie: {
    src: "assets/images/charlie-thinking.png",
    alt: "Charlie Brown at a typewriter",
    ariaLabel: "Generate a new quote with Charlie Brown",
  },
};

const REGEN_LABELS = {
  snoopy: "Ask Snoopy for another quote",
  charlie: "Ask Charlie Brown for another quote",
  lucy: "Ask Lucy for another quote",
};

const REGEN_ICONS = {
  snoopy: "assets/images/snoopy-icon.png",
  lucy: "assets/images/lucy-icon.png",
  charlie: "assets/images/charlie-icon.png",
};

const MODE_HINTS = {
  snoopy: "Snoopy will use his typewriter for inspirational quotes.",
  charlie:
    "Charlie Brown is a philosophical little guy and his quotes will be the same way.",
  lucy: "Lucy Van Pelt will tell it how it is. Just drop 5 cents in the jar!",
};

const MODE_IDLE = {
  snoopy: "Click Snoopy to get your quote.",
  charlie: "Click Charlie to get your quote.",
  lucy: "Click Lucy to get your quote.",
};

// const MOBILE_SHEET_QUERY = window.matchMedia("(max-width: 900px)");
const MOBILE_SHEET_QUERY = window.matchMedia(
  "(max-width: 600px), (max-width: 768px) and (max-height: 900px)",
);
const MOBILE_SHEET_COPY = {
  closed: "Pull the sheet up to see your quote!",
  // open: "Drag down to close",
  open: "",
};

const mobileSheet = {
  isOpen: false,
  isDragging: false,
  moved: false,
  startY: 0,
  startOffset: 0,
  currentOffset: 0,
  startOpen: false,
};

const SEASONS = {
  winter: {
    label: "Winter",
    overlayClass: "seasonal-overlay--winter",
    particles: 0,
  },
  spring: {
    label: "Spring",
    overlayClass: "seasonal-overlay--spring",
    particles: 12,
  },
};

// ============================================================================
// SEASONAL OVERLAY
// ============================================================================
function clearSeasonalOverlay() {
  elements.seasonalOverlay.innerHTML = "";
  elements.seasonalOverlay.className = "seasonal-overlay";
}

function renderSpringPetals(baseCount = 24) {
  const overlay = elements.seasonalOverlay;
  const fragment = document.createDocumentFragment();
  const width = overlay.offsetWidth || window.innerWidth;

  const count =
    width >= 1400 ? 34 : width >= 1100 ? 28 : width >= 768 ? 22 : 16;
  const slotWidth = 100 / count;

  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";

    const slotStart = i * slotWidth;
    const jitter = (Math.random() - 0.5) * slotWidth * 0.8;
    const left = slotStart + slotWidth / 2 + jitter;

    const delay = Math.random() * 12;
    const duration = 12 + Math.random() * 10;
    const drift = -80 + Math.random() * 160;
    const rotate = -220 + Math.random() * 440;
    const scale = 0.72 + Math.random() * 0.85;
    const opacity = 0.28 + Math.random() * 0.4;
    // const opacity = 1;
    const flutter = 3 + Math.random() * 3;
    petal.style.setProperty("--flutter", `${flutter}s`);

    const petalWidth = 14 + Math.random() * 14;
    const petalHeight = petalWidth * (0.58 + Math.random() * 0.22);

    petal.style.left = `${left}%`;
    petal.style.top = `${-12 - Math.random() * 25}%`;
    petal.style.width = `${petalWidth}px`;
    petal.style.height = `${petalHeight}px`;
    petal.style.animationDelay = `${delay}s`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.setProperty("--drift-x", `${drift}px`);
    petal.style.setProperty("--rotate-end", `${rotate}deg`);
    petal.style.setProperty("--petal-scale", scale);
    petal.style.setProperty("--petal-opacity", opacity);

    fragment.appendChild(petal);
  }

  const extras = Math.max(4, Math.round(count * 0.18));

  for (let i = 0; i < extras; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";

    const left = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = 14 + Math.random() * 10;
    const drift = -100 + Math.random() * 200;
    const rotate = -260 + Math.random() * 520;
    const scale = 0.65 + Math.random() * 0.9;
    const opacity = 0.22 + Math.random() * 0.35;

    const petalWidth = 12 + Math.random() * 16;
    const petalHeight = petalWidth * (0.58 + Math.random() * 0.22);

    petal.style.left = `${left}%`;
    petal.style.top = `${-12 - Math.random() * 30}%`;
    petal.style.width = `${petalWidth}px`;
    petal.style.height = `${petalHeight}px`;
    petal.style.animationDelay = `${delay}s`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.setProperty("--drift-x", `${drift}px`);
    petal.style.setProperty("--rotate-end", `${rotate}deg`);
    petal.style.setProperty("--petal-scale", scale);
    petal.style.setProperty("--petal-opacity", opacity);

    fragment.appendChild(petal);
  }

  overlay.appendChild(fragment);
}

function applySeasonTheme() {
  clearSeasonalOverlay();

  if (!state.seasonalTheme) {
    elements.seasonalOverlay.classList.remove("active");
    return;
  }

  const season = SEASONS[state.seasonalTheme];
  if (!season) return;

  elements.seasonalOverlay.classList.add("active", season.overlayClass);

  if (state.seasonalTheme === "spring") {
    renderSpringPetals(season.particles);
  }
}
// ============================================================================
// AUDIO MANAGEMENT
// ============================================================================

//
// 🦊 New typewriter sound
class ModeSoundManager {
  constructor() {
    this.snoopyKeys = ["key-1.wav", "key-2.wav", "key-3.wav"].map((file) => {
      const a = new Audio(`assets/audio/${file}`);
      a.volume = 0.22;
      return a;
    });

    this.snoopyBell = new Audio("assets/audio/bell.mp3");
    this.snoopyBell.volume = 0.35;

    this.currentLoop = null;

    this.loopSources = {
      charlie: {
        src: "assets/audio/charlie-whistle.mp3",
        volume: 0.18,
      },
      lucy: {
        src: "assets/audio/lucy-pen-writing.mp3",
        volume: 0.16,
      },
    };
  }

  init() {
    this.snoopyKeys.forEach((a) => a.load());
    this.snoopyBell.load();
  }

  playTypingChar() {
    if (!state.soundEnabled) return;
    if (state.currentMode !== "snoopy") return;

    const a =
      this.snoopyKeys[Math.floor(Math.random() * this.snoopyKeys.length)];
    a.currentTime = 0;
    a.play().catch(() => {});
  }

  playBell() {
    if (!state.soundEnabled) return;
    if (state.currentMode !== "snoopy") return;

    this.snoopyBell.currentTime = 0;
    this.snoopyBell.play().catch(() => {});
  }

  startModeLoop() {
    if (!state.soundEnabled) return;

    this.stopModeLoop();

    const config = this.loopSources[state.currentMode];
    if (!config) return;

    const audio = new Audio(config.src);
    audio.loop = true;
    audio.volume = config.volume;
    audio.currentTime = 0;

    this.currentLoop = audio;
    audio.play().catch(() => {});
  }

  stopModeLoop() {
    if (!this.currentLoop) return;

    this.currentLoop.pause();
    this.currentLoop.currentTime = 0;
    this.currentLoop = null;
  }

  stopAll() {
    this.stopModeLoop();

    this.snoopyBell.pause();
    this.snoopyBell.currentTime = 0;

    this.snoopyKeys.forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
  }
}

const soundManager = new ModeSoundManager();

// ============================================================================
//THE RECTANGULAR AT THE END
// ============================================================================
function fixMojibake(s = "") {
  return s
    .replace(/â€™/g, "’")
    .replace(/â€œ/g, "“")
    .replace(/â€/g, "”")
    .replace(/â€“/g, "–")
    .replace(/â€”/g, "—")
    .replace(/â€¦/g, "…")
    .replace(/Â/g, "")
    .replace(/â—®/g, ""); // <- конкретно твой кейс
}
// ============================================================================
// QUOTE GENERATION
// ============================================================================

function getRandomQuote() {
  if (!QUOTES.length) return null;

  const modeQuotes = QUOTES.filter((q) => q.mode === state.currentMode);
  const poolSource = modeQuotes.length ? modeQuotes : QUOTES;

  const available = poolSource.filter((q) => q.text !== state.lastQuoteId);
  const pool = available.length ? available : poolSource;

  const selected = pool[Math.floor(Math.random() * pool.length)];
  state.lastQuoteId = selected.text;
  return selected;
}

// ============================================================================
// TYPEWRITER EFFECT
// ============================================================================

async function typewriterEffect(text, element, shouldCancel = () => false) {
  element.textContent = "";
  element.classList.add("typing");

  const chars = text.split("");
  const delay = state.prefersReducedMotion ? 0 : 50;

  for (let i = 0; i < chars.length; i++) {
    if (shouldCancel()) {
      element.classList.remove("typing");
      return;
    }

    element.textContent += chars[i];

    if (!state.prefersReducedMotion) {
      soundManager.playTypingChar();
      await new Promise((resolve) =>
        setTimeout(resolve, delay + Math.random() * 30),
      );
    }
  }

  element.classList.remove("typing");
}

// ============================================================================
// DISPLAY QUOTE
// ============================================================================

async function displayQuote() {
  const header = document.querySelector(".paper__sheet-handle");
  header.style.opacity = "1";
  header.style.visibility = "visible";
  // New click = new typing "run". Old one should stop.
  typingRunId += 1;
  const runId = typingRunId;

  state.isTyping = true;
  elements.snoopyBtn.classList.add("typing");
  elements.quoteAuthor.classList.remove("visible");

  // Initialize audio on user interaction
  soundManager.init();
  soundManager.stopAll();
  soundManager.startModeLoop();

  // Get new quote
  const quote = getRandomQuote();
  if (!quote) {
    elements.quoteText.textContent = "No quotes loaded yet.";
    state.isTyping = false;
    elements.snoopyBtn.classList.remove("typing");
    return;
  }

  // Clear previous content immediately
  elements.quoteText.textContent = "";
  elements.quoteAuthor.textContent = "";

  // Type the quote (but allow cancellation mid-way)
  await typewriterEffect(
    quote.text,
    elements.quoteText,
    () => runId !== typingRunId,
  );

  // If another click happened during typing, stop right here
  if (runId !== typingRunId) {
    // soundManager.stopModeLoop();
    return;
  }

  // bell at the end
  soundManager.stopModeLoop();
  soundManager.playBell();

  // Show author with delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (runId !== typingRunId) return;

  elements.quoteAuthor.textContent = `— ${quote.author}`;
  elements.quoteAuthor.classList.add("visible");

  state.isTyping = false;
  elements.snoopyBtn.classList.remove("typing");
}

function isMobileSheetActive() {
  return MOBILE_SHEET_QUERY.matches && !!elements.sheetHandle;
}

function getMobileSheetClosedOffset() {
  const sheetHeight = elements.paperSection.getBoundingClientRect().height;
  const peekHeight = elements.sheetHandle
    ? elements.sheetHandle.getBoundingClientRect().height + 8
    : 112;

  return Math.max(sheetHeight - peekHeight, 0);
}

function getMobileSheetOpenOffset() {
  const value = getComputedStyle(elements.paperSection)
    .getPropertyValue("--mobile-sheet-open-offset")
    .trim();
  const offset = Number.parseFloat(value);

  return Number.isFinite(offset) ? offset : 0;
}

function applyMobileSheetOffset(offset) {
  elements.paperSection.style.setProperty(
    "--mobile-sheet-offset",
    `${offset}px`,
  );
}

function updateMobileSheetCopy() {
  if (!elements.sheetHandle || !elements.sheetInstruction) return;

  elements.sheetHandle.setAttribute(
    "aria-expanded",
    String(mobileSheet.isOpen),
  );
  elements.sheetInstruction.textContent = mobileSheet.isOpen
    ? MOBILE_SHEET_COPY.open
    : MOBILE_SHEET_COPY.closed;
}

function setMobileSheet(open, { immediate = false } = {}) {
  if (!elements.sheetHandle) return;

  if (!isMobileSheetActive()) {
    mobileSheet.isOpen = false;
    mobileSheet.isDragging = false;
    elements.paperSection.classList.remove(
      "paper--sheet-open",
      "paper--sheet-closed",
      "paper--sheet-dragging",
    );
    elements.paperSection.style.removeProperty("--mobile-sheet-offset");
    updateMobileSheetCopy();
    return;
  }

  mobileSheet.isOpen = open;
  mobileSheet.isDragging = false;

  if (immediate) {
    elements.paperSection.classList.add("paper--sheet-dragging");
  } else {
    elements.paperSection.classList.remove("paper--sheet-dragging");
  }

  elements.paperSection.classList.toggle("paper--sheet-open", open);
  elements.paperSection.classList.toggle("paper--sheet-closed", !open);

  const offset = open
    ? getMobileSheetOpenOffset()
    : getMobileSheetClosedOffset();
  applyMobileSheetOffset(offset);
  updateMobileSheetCopy();

  if (immediate) {
    requestAnimationFrame(() => {
      if (!mobileSheet.isDragging) {
        elements.paperSection.classList.remove("paper--sheet-dragging");
      }
    });
  }
}

function openMobileSheet() {
  setMobileSheet(true);
}

function closeMobileSheet({ immediate = false } = {}) {
  setMobileSheet(false, { immediate });
}

function syncMobileSheetLayout({ reset = false } = {}) {
  if (isMobileSheetActive()) {
    if (reset) {
      closeMobileSheet({ immediate: true });
      return;
    }

    setMobileSheet(mobileSheet.isOpen, { immediate: true });
    return;
  }

  mobileSheet.isOpen = false;
  mobileSheet.isDragging = false;
  elements.paperSection.classList.remove(
    "paper--sheet-open",
    "paper--sheet-closed",
    "paper--sheet-dragging",
  );
  elements.paperSection.style.removeProperty("--mobile-sheet-offset");
  updateMobileSheetCopy();
}

function handleSheetPointerDown(event) {
  if (!isMobileSheetActive()) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;

  mobileSheet.isDragging = true;
  mobileSheet.moved = false;
  mobileSheet.startOpen = mobileSheet.isOpen;
  mobileSheet.startY = event.clientY;
  mobileSheet.startOffset = mobileSheet.isOpen
    ? getMobileSheetOpenOffset()
    : getMobileSheetClosedOffset();
  mobileSheet.currentOffset = mobileSheet.startOffset;

  elements.paperSection.classList.add("paper--sheet-dragging");
  applyMobileSheetOffset(mobileSheet.startOffset);
  elements.sheetHandle.setPointerCapture?.(event.pointerId);
}

function handleSheetPointerMove(event) {
  if (!mobileSheet.isDragging || !isMobileSheetActive()) return;

  const deltaY = event.clientY - mobileSheet.startY;
  if (Math.abs(deltaY) > 6) {
    mobileSheet.moved = true;
  }

  const openOffset = getMobileSheetOpenOffset();
  const closedOffset = getMobileSheetClosedOffset();
  const nextOffset = Math.min(
    Math.max(mobileSheet.startOffset + deltaY, openOffset),
    closedOffset,
  );

  mobileSheet.currentOffset = nextOffset;
  applyMobileSheetOffset(nextOffset);
  event.preventDefault();
}

function handleSheetPointerUp(event) {
  if (!mobileSheet.isDragging || !isMobileSheetActive()) return;

  mobileSheet.isDragging = false;
  elements.paperSection.classList.remove("paper--sheet-dragging");
  elements.sheetHandle.releasePointerCapture?.(event.pointerId);

  const openOffset = getMobileSheetOpenOffset();
  const closedOffset = getMobileSheetClosedOffset();
  const travel = Math.max(closedOffset - openOffset, 0);
  const threshold = Math.min(96, travel * 0.2);
  const shouldOpen = mobileSheet.startOpen
    ? mobileSheet.currentOffset < openOffset + threshold
    : mobileSheet.currentOffset < closedOffset - threshold;

  setMobileSheet(shouldOpen);
}

function handleSheetHandleClick() {
  if (!isMobileSheetActive() || mobileSheet.moved) {
    mobileSheet.moved = false;
    return;
  }

  setMobileSheet(!mobileSheet.isOpen);
}

// ============================================================================
// MODE SELECTION
// ============================================================================

function setMode(mode) {
  typingRunId += 1;
  state.isTyping = false;

  elements.snoopyBtn.classList.remove("typing");
  elements.quoteText.classList.remove("typing");
  elements.quoteAuthor.classList.remove("visible");
  elements.quoteText.textContent = "";
  elements.quoteAuthor.textContent = "";

  soundManager.stopAll();

  state.currentMode = mode;
  elements.paperSection.dataset.mode = mode;
  document.querySelector(".app").dataset.mode = mode;
  closeMobileSheet({ immediate: true });

  renderIdleMessage();

  const asset = CHARACTER_ASSETS[mode];
  if (asset) {
    elements.characterImg.src = asset.src;
    elements.characterImg.alt = asset.alt;
    elements.snoopyBtn.setAttribute("aria-label", asset.ariaLabel);
  }

  elements.modeButtons.forEach((btn) => {
    const isActive = btn.dataset.mode === mode;
    btn.classList.toggle("mode-selector__btn--active", isActive);
    btn.setAttribute("aria-pressed", isActive);
  });

  elements.modeHint.textContent = MODE_HINTS[mode];

  if (elements.regenQuoteLabel) {
    elements.regenQuoteLabel.textContent = REGEN_LABELS[mode];
  }
  if (elements.regenQuoteIcon) {
    elements.regenQuoteIcon.src = REGEN_ICONS[mode];
  }
}

// ============================================================================
// TOGGLES
// ============================================================================

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  elements.soundToggle.setAttribute("aria-pressed", state.soundEnabled);
  elements.soundStatus.textContent = state.soundEnabled ? "ON" : "OFF";
  localStorage.setItem("snoopy_sound", state.soundEnabled);
}

function toggleSeasonalTheme() {
  state.seasonalTheme = state.seasonalTheme ? null : "spring";

  elements.themeToggle.setAttribute(
    "aria-pressed",
    Boolean(state.seasonalTheme),
  );
  elements.themeStatus.textContent = state.seasonalTheme ? "ON" : "OFF";

  applySeasonTheme();
  localStorage.setItem("snoopy_seasonal", state.seasonalTheme || "");
}

// ============================================================================
// LOCAL STORAGE
// ============================================================================
async function loadQuotes() {
  // Fetches quotes from json
  const res = await fetch("./assets/data/quotes.json");
  if (!res.ok) throw new Error("Failed to load quotes.json");
  QUOTES = await res.json();
}

function loadPreferences() {
  // Load sound preference
  const savedSound = localStorage.getItem("snoopy_sound");
  if (savedSound !== null) {
    state.soundEnabled = savedSound === "true";
    elements.soundToggle.setAttribute("aria-pressed", state.soundEnabled);
    elements.soundStatus.textContent = state.soundEnabled ? "ON" : "OFF";
  }

  // Load seasonal theme preference
  const savedSeasonal = localStorage.getItem("snoopy_seasonal");
  state.seasonalTheme = savedSeasonal || null;
  elements.themeToggle.setAttribute(
    "aria-pressed",
    Boolean(state.seasonalTheme),
  );
  elements.themeStatus.textContent = state.seasonalTheme ? "ON" : "OFF";
  applySeasonTheme();
  // const savedSeasonal = localStorage.getItem("snoopy_seasonal");
  // if (savedSeasonal !== null) {
  //   state.seasonalTheme = savedSeasonal === "true";
  //   elements.themeToggle.setAttribute("aria-pressed", state.seasonalTheme);
  //   elements.themeStatus.textContent = state.seasonalTheme ? "ON" : "OFF";
  //   elements.seasonalOverlay.classList.toggle("active", state.seasonalTheme);
  // }

  // Load mode preference
  const savedMode = localStorage.getItem("snoopy_mode");
  if (savedMode && ["lucy", "snoopy", "charlie"].includes(savedMode)) {
    setMode(savedMode);
  }
}

// ============================================================================
// IDLE STATE OF QUOTE
// ============================================================================
function renderIdleMessage() {
  // очищаем quote UI
  elements.quoteAuthor.classList.remove("visible");
  elements.quoteText.classList.remove("typing");

  elements.quoteText.textContent = MODE_IDLE[state.currentMode];
  elements.quoteAuthor.textContent = "";
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function initEventListeners() {
  // Snoopy button - generate quote
  // elements.snoopyBtn.addEventListener("click", displayQuote);
  // elements.clickMeLabel.addEventListener("click", displayQuote);
  elements.snoopyBtn.addEventListener("click", () => {
    // openMobileSheet();
    setTimeout(displayQuote, 350);
  });

  elements.clickMeLabel.addEventListener("click", () => {
    // openMobileSheet();
    setTimeout(displayQuote, 350);
  });

  elements.sheetHandle?.addEventListener("pointerdown", handleSheetPointerDown);
  elements.sheetHandle?.addEventListener("pointermove", handleSheetPointerMove);
  elements.sheetHandle?.addEventListener("pointerup", handleSheetPointerUp);
  elements.sheetHandle?.addEventListener("pointercancel", handleSheetPointerUp);
  elements.sheetHandle?.addEventListener("click", handleSheetHandleClick);

  // Sound toggle
  elements.soundToggle.addEventListener("click", toggleSound);

  // Seasonal theme toggle
  elements.themeToggle.addEventListener("click", toggleSeasonalTheme);

  // Mode selection buttons
  // elements.modeButtons.forEach((btn) => {
  //   btn.addEventListener("click", () => {
  //     const mode = btn.dataset.mode;
  //     setMode(mode);
  //     localStorage.setItem("snoopy_mode", mode);
  //   });
  // });
  elements.modeButtons.forEach((btn) => {
    const mode = btn.dataset.mode;

    btn.addEventListener("mouseenter", () => {
      elements.modeHint.textContent = MODE_HINTS[mode];
    });

    btn.addEventListener("mouseleave", () => {
      elements.modeHint.textContent = MODE_HINTS[state.currentMode];
    });

    btn.addEventListener("click", () => {
      setMode(mode);
    });
  });

  // The hint for the mobile generator
  elements.regenQuoteBtn?.addEventListener("click", () => {
    setTimeout(displayQuote, 350);
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Spacebar to generate quote (when not typing in an input)
    if (e.code === "Space" && e.target === document.body) {
      e.preventDefault();
      openMobileSheet();
      displayQuote();
    }
  });

  window.addEventListener("resize", () => syncMobileSheetLayout());
  MOBILE_SHEET_QUERY.addEventListener("change", () =>
    syncMobileSheetLayout({ reset: true }),
  );
}

// ============================================================================
// INITIALIZATION
// ============================================================================

async function init() {
  try {
    await loadQuotes();
    console.log("quotes loaded:", QUOTES.length);
  } catch (e) {
    console.error(e);
    elements.quoteText.textContent = "Couldn't load quotes 😢";
    return; // <- this return prevents listeners from attaching
  }

  loadPreferences();
  initEventListeners();
  console.log("listeners attached ✅");
  elements.modeHint.textContent = MODE_HINTS[state.currentMode];
  elements.paperSection.dataset.mode = state.currentMode;

  renderIdleMessage();
  syncMobileSheetLayout({ reset: true });
}
// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
} else {
  init();
}
