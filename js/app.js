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
  seasonalTheme: false,
  isTyping: false,
  lastQuoteId: null,
  prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches,
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
  clickMeLabel: document.getElementById("clickMeLabel"),
  soundToggle: document.getElementById("soundToggle"),
  soundStatus: document.getElementById("soundStatus"),
  themeToggle: document.getElementById("themeToggle"),
  themeStatus: document.getElementById("themeStatus"),
  seasonalOverlay: document.getElementById("seasonalOverlay"),
  modeButtons: document.querySelectorAll(".mode-selector__btn"),
  modeHint: document.getElementById("modeHint"),
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

// ============================================================================
// AUDIO MANAGEMENT
// ============================================================================

//
// 🦊 New typewriter sound
class TypewriterSound {
  constructor() {
    this.keys = ["key-1.wav", "key-2.wav", "key-3.wav"].map((file) => {
      const a = new Audio(`assets/audio/${file}`);
      a.volume = 0.22;
      return a;
    });

    this.bell = new Audio("assets/audio/bell.mp3");
    this.bell.volume = 0.35;
  }

  init() {
    // preload
    this.keys.forEach((a) => a.load());
    this.bell.load();
  }

  playClick() {
    if (!state.soundEnabled) return;

    // pick a random key sound
    const a = this.keys[Math.floor(Math.random() * this.keys.length)];
    a.currentTime = 0;
    a.play().catch(() => {});
  }

  playBell() {
    if (!state.soundEnabled) return;
    this.bell.currentTime = 0;
    this.bell.play().catch(() => {});
  }

  start() {}
  stop() {}
}

const typewriterSound = new TypewriterSound();

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
      typewriterSound.playClick();
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
  // New click = new typing "run". Old one should stop.
  typingRunId += 1;
  const runId = typingRunId;

  state.isTyping = true;
  elements.snoopyBtn.classList.add("typing");
  elements.quoteAuthor.classList.remove("visible");

  // Initialize audio on user interaction
  typewriterSound.init();

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
  if (runId !== typingRunId) return;

  // bell at the end
  typewriterSound.playBell();

  // Show author with delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (runId !== typingRunId) return;

  elements.quoteAuthor.textContent = `— ${quote.author}`;
  elements.quoteAuthor.classList.add("visible");

  state.isTyping = false;
  elements.snoopyBtn.classList.remove("typing");
}

// ============================================================================
// MODE SELECTION
// ============================================================================

function setMode(mode) {
  // cancel typing immediately on mode change
  typingRunId += 1;
  state.isTyping = false;
  elements.snoopyBtn.classList.remove("typing");
  elements.quoteText.classList.remove("typing");
  elements.quoteAuthor.classList.remove("visible");
  elements.quoteText.textContent = "";
  elements.quoteAuthor.textContent = "";

  state.currentMode = mode;
  elements.paperSection.dataset.mode = mode;
  // cancel typing on mode change
  typingRunId += 1;
  state.isTyping = false;
  elements.snoopyBtn.classList.remove("typing");

  // обновляем UI (hint + instruction)
  elements.modeHint.textContent = MODE_HINTS[mode];
  renderIdleMessage();

  const asset = CHARACTER_ASSETS[mode];
  if (asset) {
    elements.characterImg.src = asset.src;
    elements.characterImg.alt = asset.alt;
    elements.snoopyBtn.setAttribute("aria-label", asset.ariaLabel);
  }

  // Update button states
  elements.modeButtons.forEach((btn) => {
    const isActive = btn.dataset.mode === mode;
    btn.classList.toggle("mode-selector__btn--active", isActive);
    btn.setAttribute("aria-pressed", isActive);
  });

  elements.modeHint.textContent = MODE_HINTS[mode];
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
  state.seasonalTheme = !state.seasonalTheme;
  elements.themeToggle.setAttribute("aria-pressed", state.seasonalTheme);
  elements.themeStatus.textContent = state.seasonalTheme ? "ON" : "OFF";
  elements.seasonalOverlay.classList.toggle("active", state.seasonalTheme);
  localStorage.setItem("snoopy_seasonal", state.seasonalTheme);
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
  if (savedSeasonal !== null) {
    state.seasonalTheme = savedSeasonal === "true";
    elements.themeToggle.setAttribute("aria-pressed", state.seasonalTheme);
    elements.themeStatus.textContent = state.seasonalTheme ? "ON" : "OFF";
    elements.seasonalOverlay.classList.toggle("active", state.seasonalTheme);
  }

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
    // scrollToQuotesIfNeeded();
    setTimeout(displayQuote, 350);
  });

  elements.clickMeLabel.addEventListener("click", () => {
    // scrollToQuotesIfNeeded();
    setTimeout(displayQuote, 350);
  });

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

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Spacebar to generate quote (when not typing in an input)
    if (e.code === "Space" && e.target === document.body) {
      e.preventDefault();
      displayQuote();
    }
  });
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
}
// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
} else {
  init();
}
