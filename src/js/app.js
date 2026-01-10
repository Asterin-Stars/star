import { initAds } from "./ads.js";
import { initWallet } from "./wallet.js";
import { initBackground } from "./background.js";
import { initCore } from "./core.js";

/* ==================== APP ENTRY POINT ==================== */

window.addEventListener("load", () => {
  console.log("🚀 Star Oracle System Starting...");

  // 1. Initialize Visuals (Background Stars)
  initBackground();

  // 2. Initialize Monetization (Ads)
  initAds();

  // 3. Initialize Wallet (Payments)
  initWallet();

  // 4. Initialize Core Logic (Oracle, UI, Data)
  initCore();

  console.log("✅ Systems Online");
});
