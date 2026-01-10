/* ==================== GOOGLE ADSENSE CONFIGURATION ==================== */

// TODO: User must replace these with actual AdSense credentials
const ADSENSE_CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXXX";

export function initAds() {
  console.log("📢 Initializing AdSense...");

  // 1. Inject AdSense Script dynamically if not present
  if (!document.querySelector(`script[src*="${ADSENSE_CLIENT_ID}"]`)) {
    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
    console.log("📢 AdSense script injected");
  }

  // 2. Push ads to waiting slots
  try {
    // Initialize the first ad slot (Sticky Banner)
    const adSlots = document.querySelectorAll(".adsbygoogle");
    if (adSlots.length > 0) {
      // Push for each slot found (usually just one on load)
      adSlots.forEach((slot) => {
        // Check if already filled to avoid duplicates/errors
        if (
          !slot.innerHTML.includes("iframe") &&
          slot.getAttribute("data-ad-status") !== "filled"
        ) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      });
      console.log("📢 Ad slots pushed");
    }
  } catch (e) {
    console.error("AdSense init error:", e);
  }
}
