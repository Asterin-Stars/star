import { colorPalettes, FULL_DECK } from "./tarot-data.js";

/* ==================== STATE ==================== */
let currentCard = null;
let isRevealed = false;
let isLocked = false;
let savedCards = []; // Session History

/* ==================== DOM ELEMENTS ==================== */
const getEl = (id) => document.getElementById(id);

/* ==================== INITIALIZATION ==================== */
export async function initCore() {
  console.log("✦ Core: Initializing Tech-Mage Engine...");

  // Dismiss Preloader
  setTimeout(() => {
    const preloader = getEl("preloader");
    if (preloader) {
      document.body.classList.remove("loading");
      preloader.classList.add("loaded");
      setTimeout(() => (preloader.style.display = "none"), 1000);
    }
  }, 1500);

  // Restore Language Preference
  const savedLang = localStorage.getItem("appLang") || "es";
  const langSelect = getEl("langSelect");
  if (langSelect) langSelect.value = savedLang;

  bindEvents();
}

/* ==================== CORE LOGIC ==================== */

function revealCard() {
  if (isRevealed || isLocked) return;
  isLocked = true;

  // 1. Pick a Card
  const randomIndex = Math.floor(Math.random() * FULL_DECK.length);
  const selectedCard = FULL_DECK[randomIndex];

  // 2. Reversal (20% chance)
  const isReversed = Math.random() < 0.2;
  currentCard = { ...selectedCard, isReversed, timestamp: new Date() };

  // Save to History
  savedCards.unshift(currentCard);

  // 3. Render Card Face & Image
  const cardImg = getEl("cardImage");
  const cleanId = currentCard.image_id || currentCard.id;

  if (cardImg) {
    cardImg.src = `./public/cards/${cleanId}.png`;
    cardImg.onerror = () => {
      cardImg.src = "./public/cards/ar00.png";
    };
  }

  // Rotation for reversal
  const cardFaceBack = document.querySelector(".card-face.back");
  if (cardFaceBack) {
    cardFaceBack.style.transform = `rotateY(180deg) rotate(${
      isReversed ? 180 : 0
    }deg)`;
  }

  // 4. Update Atmosphere
  updateAtmosphere(cleanId);

  // 5. Trigger Animation
  const stage = getEl("cardStage");
  const interfaceEl = getEl("interface");

  if (stage) stage.classList.add("flipped");
  if (interfaceEl) interfaceEl.classList.add("revealed");

  isRevealed = true;

  // Remove tutorial hint
  const hint = document.querySelector(".tutorial-hint");
  if (hint) hint.style.opacity = "0";

  // 6. Populate Text (Delayed matches flip)
  setTimeout(() => {
    populateText(currentCard);
    const panel = getEl("insightPanel");
    if (panel) panel.classList.add("active");

    isLocked = false;
    document.body.style.overflowY = "auto";
  }, 800);
}

function updateAtmosphere(cardId) {
  const palette = colorPalettes[cardId] || colorPalettes["ar00"];
  if (palette) {
    const root = document.documentElement;
    root.style.setProperty("--color1", palette[0]);
    root.style.setProperty("--color2", palette[1]);
    root.style.setProperty("--color3", palette[2]);
    root.style.setProperty("--color4", palette[3]);
    root.style.setProperty("--keyword-color", palette[0]);
  }
}

function getRandomVariant(content) {
  if (Array.isArray(content)) {
    return content[Math.floor(Math.random() * content.length)];
  }
  return content || "...";
}

// Global scope needed for 'changeLanguage' in HTML? No, we add listener.
function changeLanguage(lang) {
  console.log("Language changed to:", lang);
  localStorage.setItem("appLang", lang);
  // Reload page to apply changes properly (since we don't have full ES/EN hot-swap data yet)
  location.reload();
}
window.changeLanguage = changeLanguage; // Expose to global for HTML onclick if needed, though listner is better.

function populateText(card) {
  const data = card.content || {};
  const name = card.name + (card.isReversed ? " (Invertida)" : "");

  const titleEl = getEl("cardTitle");
  if (titleEl) titleEl.innerText = name;

  // Helper to get random variant from array or return string as-is
  const process = (field) => {
    const text = getRandomVariant(data[field]);
    return text ? text.replace(/\n/g, "<br>") : "...";
  };

  // UI Field Mapping - Only 2 sections now
  const setHtml = (id, html) => {
    const el = getEl(id);
    if (el) el.innerHTML = html;
  };

  setHtml("textArquetipo", process("arquetipo"));
  setHtml("textPasaje", process("pasaje"));
}

/* ==================== INTERACTIVITY ==================== */

function showHistory() {
  const modal = getEl("infoModal");
  const title = getEl("modalTitle");
  const body = getEl("modalBody");

  if (!modal || !title || !body) return;

  title.innerText = "HISTORIAL DE SESIÓN";
  body.innerHTML = "";

  if (savedCards.length === 0) {
    body.innerHTML =
      "<p style='text-align:center'>No hay cartas reveladas en esta sesión.</p>";
  } else {
    savedCards.forEach((card, index) => {
      const row = document.createElement("div");
      row.className = "modal-variant-item";
      row.style.cursor = "pointer";
      row.innerHTML = `<strong>${
        card.name
      }</strong> <small style='float:right'>${card.timestamp.toLocaleTimeString()}</small>`;
      // Could add click handler to re-load card, but let's keep it simple log for now.
      body.appendChild(row);
    });
  }

  modal.classList.add("active");
}

function showVariants(field, titleText) {
  if (!currentCard) return;

  const modal = getEl("infoModal");
  const title = getEl("modalTitle");
  const body = getEl("modalBody");

  if (!modal || !title || !body) return;

  title.innerText = titleText;
  body.innerHTML = "";

  const variants = currentCard.content ? currentCard.content[field] : [];

  if (Array.isArray(variants)) {
    variants.forEach((variant) => {
      const p = document.createElement("div");
      p.className = "modal-variant-item";
      p.innerText = variant;
      body.appendChild(p);
    });
  } else {
    body.innerHTML = "<p>Sin variantes disponibles.</p>";
  }

  modal.classList.add("active");
}

function resetReading() {
  isRevealed = false;
  const panel = getEl("insightPanel");
  if (panel) panel.classList.remove("active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  setTimeout(() => {
    getEl("cardStage").classList.remove("flipped");
    getEl("interface").classList.remove("revealed");
  }, 500);
}

/* ==================== EVENTS ==================== */
function bindEvents() {
  // Card Click
  const stage = getEl("cardStage");
  if (stage) stage.addEventListener("click", revealCard);

  // History Button
  const btnHistory = getEl("collectionBtn");
  if (btnHistory) btnHistory.addEventListener("click", showHistory);

  // Language Dropdown (Already bound via inline onchange, but safe to verify)

  // Clickable Titles for Variants
  document.querySelectorAll(".clickable-title").forEach((el) => {
    el.addEventListener("click", (e) => {
      const field = e.target.getAttribute("data-field");
      const title = e.target.innerText;
      if (field) showVariants(field, title);
    });
  });

  // Gyroscope
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    document.documentElement.style.setProperty("--gyro-x", x);
    document.documentElement.style.setProperty("--gyro-y", y);
  });
}
