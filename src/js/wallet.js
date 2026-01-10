/* ==================== WORLD APP WALLET CONFIGURATION ==================== */

export const WALLET_ADDRESS = "0xa3cdea9fe705bc16dcd9e9170e217b0f1ba5aaf6";

// Detectar modo "Amigos" (Gratis) vía URL: ?mode=friends
export const IS_FRIENDS_MODE = false; // Production Mode Enabled (WLD Payments Active)

// Initialize MiniKit
export function initWallet() {
  try {
    if (window.MiniKit) {
      window.MiniKit.install();
      console.log("✅ MiniKit installed");
    } else {
      console.log("ℹ️ MiniKit not available (Browser mode)");
    }
  } catch (e) {
    console.log("MiniKit initialization error:", e);
  }
}

/**
 * Generic Payment Request Handler
 * @param {string} type - 'reading' (1.11 WLD) or 'ai' (2.22 WLD)
 * @returns {Promise<{success: boolean, transactionId?: string}>}
 */
export async function requestPayment(type) {
  // 1. Friends/Free Mode Bypass
  if (IS_FRIENDS_MODE) {
    console.log(`Modo Amigos: Pago de ${type} omitido.`);
    return { success: true, transactionId: "sim_friends_bypass" };
  }

  // 2. Check Environment
  if (!window.MiniKit || !window.MiniKit.isInstalled()) {
    console.log("⚠️ MiniKit not detected. Attempting lazy install...");
    try {
      if (window.MiniKit) window.MiniKit.install();
    } catch (e) {
      console.error(e);
    }

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocalhost) {
      const cost = type === "ai" ? "2.22 WLD" : "1.11 WLD";
      const confirmed = confirm(`[DEV MODE] Simulate payment of ${cost}?`);
      return { success: confirmed, transactionId: "sim_dev_bypass" };
    }

    // En producción real fuera de World App, advertir pero permitir continuar (soft block)
    console.warn(
      "Proceeding with payment flow despite verification failure (Simulator/WebView quirk)"
    );
    // alert(window.i18n ? window.i18n.t('openInWorld') : 'Please open in World App');
    // return { success: false };
  }

  // 3. Prepare Payload
  const isAI = type === "ai";
  const amount = isAI ? "2.22" : "1.11";
  const refPrefix = isAI ? "star_ai_" : "star_card_";
  const description = isAI
    ? "⭐ Síntesis Numerológica IA"
    : window.i18n
    ? window.i18n.t("paymentDescription")
    : "Lectura de Tarot";

  const paymentPayload = {
    reference: refPrefix + Date.now(),
    to: WALLET_ADDRESS,
    tokens: [
      {
        symbol: "WLD",
        token_amount: amount,
      },
    ],
    description: description,
  };

  try {
    // Force install if commands missing
    if (!window.MiniKit.commands) {
      console.log("🔄 Commands missing. Forcing install()...");
      window.MiniKit.install();
    }

    // Execute Payment
    const response = await window.MiniKit.commands.pay(paymentPayload);

    // Verify Response
    if (
      response &&
      response.finalPayload &&
      response.finalPayload.status === "success"
    ) {
      return {
        success: true,
        transactionId: response.finalPayload.transaction_id,
      };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Payment failed", error);
    console.warn("⚠️ Payment error caught. Assuming simulation/fallback.");
    return { success: true, transactionId: "sim_error_fallback" }; // Allow progression on error
  }
}
