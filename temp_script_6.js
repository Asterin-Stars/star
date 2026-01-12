      // Load Voces Data and Language
      window.vocesData = [];

      // Language Detection
      const userLang = navigator.language.startsWith("en") ? "en" : "es";
      console.log(`🌍 Detected language: ${userLang}`);

      // Initialize translation system if not exists
      if (!window.i18n) {
        window.i18n = {
          lang: userLang,
          translations: {},
        };
      }

      // Load Translations based on language
      if (userLang === "en") {
        // Example: logic to load english file
        // For now we will rely on dynamically fetching content when needed or preloading
        // Actually, let's load the main English content file if it exists, or fallback
        // The implementation_plan suggests just detection for now.
      }

      // Load Voces Data (Original Spanish Structure)
      fetch("./public/data/voces-tarot.json")
        .then((response) => response.json())
        .then((data) => {
          window.vocesData = data;
          console.log("Voces loaded", data.length);
        })
        .catch((err) => console.error("Error loading voces:", err));

      /* ==================== CONFIGURACIÓN WORLD APP ==================== */
      const WALLET_ADDRESS = "0xa3cdea9fe705bc16dcd9e9170e217b0f1ba5aaf6";

      // Detectar modo "Amigos" (Gratis) vía URL: ?mode=friends
      const urlParams = new URLSearchParams(window.location.search);
      const IS_FRIENDS_MODE = urlParams.get("mode") === "friends";

      /* =====================================================
                         LÓGICA DEL ORÁCULO
                      ===================================================== */

      const cardStage = document.getElementById("cardStage");
      const cardInner = document.querySelector(".card-inner"); // Reference to inner for class toggling
      const insightPanel = document.getElementById("insightPanel");
      const cardTitle = document.getElementById("cardTitle");
      const cardImg = document.getElementById("cardImg");

      const wallpaper = document.getElementById("wallpaper");

      // Elementos - Nueva estructura
      const textoArquetipoPrincipal = document.getElementById(
        "textoArquetipoPrincipal"
      );
      const textoMisticismo = document.getElementById("textoMisticismo");
      const textoSombra = document.getElementById("textoSombra");
      const textoBotanica = document.getElementById("textoBotanica");
      const textoCotidiano = document.getElementById("textoCotidiano");
      const textoGnosis = document.getElementById("textoGnosis");
      const textoBiblico = document.getElementById("textoBiblico");

      const seccionMisticismo = document.getElementById("seccionMisticismo");
      const seccionSombra = document.getElementById("seccionSombra");
      const seccionBotanica = document.getElementById("seccionBotanica");
      const seccionCotidiano = document.getElementById("seccionCotidiano");
      const seccionGnosis = document.getElementById("seccionGnosis");
      const seccionBiblico = document.getElementById("seccionBiblico");

      let isRevealed = false;
      let isProcessing = false;
      let currentCardData = null;

      /* ==================== COLLECTION SYSTEM (NO LIMIT) ==================== */
      let collectedCards = JSON.parse(
        sessionStorage.getItem("collectedCards") || "[]"
      );

      // Function to add card to collection with timestamp
      function addCardToCollection(cardData) {
        // Check if card already collected
        if (collectedCards.find((c) => c.name_short === cardData.name_short)) {
          return; // Already have this card
        }

        // Add card with timestamp
        collectedCards.push({
          name_short: cardData.name_short,
          image: `/public/cards/${cardData.name_short}.png`,
          name: cardData.name,
          timestamp: new Date().toISOString(),
          order: collectedCards.length + 1,
        });

        // Save to session
        sessionStorage.setItem(
          "collectedCards",
          JSON.stringify(collectedCards)
        );
      }

      // Arrays globales para almacenar todos los conceptos por categoría (22 conceptos cada uno)
      let allArquetipos = [];
      let allMisticismos = [];
      let allSombras = [];
      let allBotanicas = [];
      let allCotidianos = [];
      let allGnosis = [];
      let allResonanciasBiblicas = [];

      // Índices de ejemplo pre-calculados para esta sesión (para consistencia)
      let currentExampleIndices = {
        arquetipo: 0,
        misticismo: 0,
        sombra: 0,
        botanica: 0,
        cotidiano: 0,
        gnosis: 0,
        resonancia_biblica: 0,
      };

      // Variable para controlar el timeout del reset de color
      let resetColorTimeout = null;

      /* =====================================================
                         FULL 78-CARD TAROT DECK WITH REVERSALS
                      ===================================================== */

      // Major Arcana (22 cards)
      const MAJOR_ARCANA = [
        "ar00",
        "ar01",
        "ar02",
        "ar03",
        "ar04",
        "ar05",
        "ar06",
        "ar07",
        "ar08",
        "ar09",
        "ar10",
        "ar11",
        "ar12",
        "ar13",
        "ar14",
        "ar15",
        "ar16",
        "ar17",
        "ar18",
        "ar19",
        "ar20",
        "ar21",
      ];

      // Minor Arcana - Wands (Bastos/Fuego) - 14 cards
      const WANDS = [
        "wands_ace",
        "wands_02",
        "wands_03",
        "wands_04",
        "wands_05",
        "wands_06",
        "wands_07",
        "wands_08",
        "wands_09",
        "wands_10",
        "wands_page",
        "wands_knight",
        "wands_queen",
        "wands_king",
      ];

      // Minor Arcana - Cups (Copas/Agua) - 14 cards
      const CUPS = [
        "cups_ace",
        "cups_02",
        "cups_03",
        "cups_04",
        "cups_05",
        "cups_06",
        "cups_07",
        "cups_08",
        "cups_09",
        "cups_10",
        "cups_page",
        "cups_knight",
        "cups_queen",
        "cups_king",
      ];

      // Minor Arcana - Swords (Espadas/Aire) - 14 cards
      const SWORDS = [
        "swords_ace",
        "swords_02",
        "swords_03",
        "swords_04",
        "swords_05",
        "swords_06",
        "swords_07",
        "swords_08",
        "swords_09",
        "swords_10",
        "swords_page",
        "swords_knight",
        "swords_queen",
        "swords_king",
      ];

      // Minor Arcana - Pentacles (Oros/Tierra) - 14 cards
      const PENTACLES = [
        "pentacles_ace",
        "pentacles_02",
        "pentacles_03",
        "pentacles_04",
        "pentacles_05",
        "pentacles_06",
        "pentacles_07",
        "pentacles_08",
        "pentacles_09",
        "pentacles_10",
        "pentacles_page",
        "pentacles_knight",
        "pentacles_queen",
        "pentacles_king",
      ];

      // FULL 78-CARD DECK
      const FULL_DECK = [
        ...MAJOR_ARCANA, // 22
        ...WANDS, // 14
        ...CUPS, // 14
        ...SWORDS, // 14
        ...PENTACLES, // 14
      ]; // Total: 78 cards

      /**
       * Draw N cards from full deck with reversals (for deep analysis)
       * @param {number} count - Number of cards to draw (default 10)
       * @returns {Array} Array of card objects with {card, reversed, position, positionName}
       */
      function drawCardSpread(count = 10) {
        const drawn = [];
        const available = [...FULL_DECK]; // Copy deck

        for (let i = 0; i < count && available.length > 0; i++) {
          const index = Math.floor(Math.random() * available.length);
          const cardId = available.splice(index, 1)[0]; // Remove from deck (no duplicates)
          const reversed = Math.random() < 0.5; // 50% chance of reversal

          drawn.push({
            card: cardId,
            reversed: reversed,
            position: i + 1,
            positionName: getPositionName(i + 1),
            element: getCardElement(cardId),
          });
        }

        return drawn;
      }

      /**
       * Get position meaning in 10-card Celtic Cross spread
       */
      function getPositionName(position) {
        const positions = {
          1: "Situación Actual",
          2: "Desafío Inmediato",
          3: "Causa Raíz",
          4: "Pasado Reciente",
          5: "Mejor Resultado Posible",
          6: "Futuro Inmediato",
          7: "Tu Actitud",
          8: "Influencias Externas",
          9: "Esperanzas y Miedos",
          10: "Resultado Final",
        };
        return positions[position] || `Posición ${position}`;
      }

      /**
       * Get suit element (for esoteric analysis)
       */
      function getCardElement(cardId) {
        if (cardId.startsWith("wands_")) return "Fuego";
        if (cardId.startsWith("cups_")) return "Agua";
        if (cardId.startsWith("swords_")) return "Aire";
        if (cardId.startsWith("pentacles_")) return "Tierra";
        return "Espíritu"; // Major Arcana
      }

      /* ==================== PALETAS DE COLORES RIDER-WAITE ==================== */
      // Basado en los colores visualmente dominantes y simbólicos de las cartas estándar.
      const colorPalettes = {
        ar00: ["#FFEB3B", "#81D4FA", "#FFFFFF", "#F44336"], // El Loco: Amarillo brillante, Azul claro, Blanco, Rojo
        ar01: ["#F44336", "#FFFFFF", "#FFC107", "#4CAF50"], // El Mago: Rojo, Blanco, Amarillo, Verde
        ar02: ["#64B5F6", "#FFFFFF", "#B0BEC5", "#1976D2"], // La Sacerdotisa: Azul claro, Blanco, Gris claro, Azul oscuro
        ar03: ["#FFC107", "#4CAF50", "#F44336", "#FFF9C4"], // La Emperatriz: Amarillo, Verde, Rojo, Crema
        ar04: ["#D32F2F", "#FF9800", "#9E9E9E", "#B0BEC5"], // El Emperador: Rojo oscuro, Naranja, Gris claro
        ar05: ["#F44336", "#757575", "#FFFFFF", "#FFC107"], // El Sumo Sacerdote: Rojo, Gris, Blanco, Oro
        ar06: ["#81D4FA", "#FFEB3B", "#4CAF50", "#9C27B0"], // Los Enamorados: Azul claro, Amarillo sol, Verde, Púrpura
        ar07: ["#B0BEC5", "#2196F3", "#FFC107", "#616161"], // El Carro: Gris, Azul, Oro, Negro/Gris
        ar08: ["#FFFFFF", "#FF9800", "#8BC34A", "#F44336"], // La Fuerza: Blanco, Naranja, Verde claro, Rojo león
        ar09: ["#9E9E9E", "#616161", "#B0BEC5", "#FFEB3B"], // El Ermitaño: Grises, Amarillo estrella
        ar10: ["#FF9800", "#2196F3", "#F44336", "#FFC107"], // La Rueda: Naranja, Azul, Rojo, Oro
        ar11: ["#D32F2F", "#4CAF50", "#FFC107", "#9E9E9E"], // La Justicia: Rojo oscuro, Verde, Oro, Gris
        ar12: ["#2196F3", "#F44336", "#9E9E9E", "#FFEB3B"], // El Colgado: Azul, Rojo, Gris, Amarillo halo
        ar13: ["#616161", "#FFFFFF", "#9E9E9E", "#FFEB3B"], // La Muerte: Gris oscuro, Blanco, Gris, Amarillo sol
        ar14: ["#FFFFFF", "#81D4FA", "#FFC107", "#F44336"], // La Templanza: Blanco, Azul claro, Oro, Rojo
        ar15: ["#424242", "#757575", "#F44336", "#795548"], // El Diablo: Negro, Gris, Rojo, Marrón
        ar16: ["#9E9E9E", "#616161", "#F44336", "#FFEB3B"], // La Torre: Gris, Negro, Rojo fuego, Amarillo rayo
        ar17: ["#64B5F6", "#FFC107", "#4CAF50", "#FFFFFF"], // La Estrella: Azul claro, Amarillo, Verde, Blanco
        ar18: ["#FFC107", "#2196F3", "#9E9E9E", "#1976D2"], // La Luna: Amarillo, Azul, Gris, Azul oscuro
        ar19: ["#FFEB3B", "#FF9800", "#FFFFFF", "#F44336"], // El Sol: Amarillo brillante, Naranja, Blanco, Rojo
        ar20: ["#81D4FA", "#FFFFFF", "#F44336", "#FFC107"], // El Juicio: Azul claro, Blanco, Rojo bandera, Oro trompeta
        ar21: ["#2196F3", "#9C27B0", "#4CAF50", "#FFC107"], // El Mundo: Azul, Púrpura, Verde, Oro
      };

      /* ==================== KEYWORD HIGHLIGHTING SYSTEM ====================*/
      let keywordData = null;

      // Load keywords data
      async function loadKeywords() {
        try {
          const response = await fetch("./public/keywords.json");
          if (response.ok) {
            keywordData = await response.json();
            console.log("✨ Keywords loaded");
          }
        } catch (error) {
          console.error("Error loading keywords:", error);
        }
      }

      // Highlight keywords in text (pre-render)
      // Psychologically resonant keywords per language
      const resonantKeywords = {
        es: [
          // Emociones y estados internos
          "amor",
          "miedo",
          "dolor",
          "alegría",
          "tristeza",
          "ansiedad",
          "paz",
          "libertad",
          "soledad",
          // Conceptos de poder y acción
          "poder",
          "fuerza",
          "energía",
          "voluntad",
          "decisión",
          "control",
          "dominio",
          // Transformación y cambio
          "transformación",
          "cambio",
          "muerte",
          "renacimiento",
          "despertar",
          "iluminación",
          // Relaciones y conexiones
          "conexión",
          "unión",
          "separación",
          "conflicto",
          "armonía",
          "equilibrio",
          // Valores y principios
          "verdad",
          "justicia",
          "sabiduría",
          "fe",
          "esperanza",
          "destino",
          "propósito",
        ],
        en: [
          "love",
          "fear",
          "pain",
          "joy",
          "sadness",
          "anxiety",
          "peace",
          "freedom",
          "loneliness",
          "power",
          "strength",
          "energy",
          "will",
          "decision",
          "control",
          "mastery",
          "transformation",
          "change",
          "death",
          "rebirth",
          "awakening",
          "enlightenment",
          "connection",
          "union",
          "separation",
          "conflict",
          "harmony",
          "balance",
          "truth",
          "justice",
          "wisdom",
          "faith",
          "hope",
          "destiny",
          "purpose",
        ],
        pt: [
          "amor",
          "medo",
          "dor",
          "alegria",
          "tristeza",
          "ansiedade",
          "paz",
          "liberdade",
          "solidão",
          "poder",
          "força",
          "energia",
          "vontade",
          "decisão",
          "domínio",
          "transformação",
          "mudança",
          "morte",
          "renascimento",
          "despertar",
          "iluminação",
          "conexão",
          "união",
          "separação",
          "conflito",
          "harmonia",
          "equilíbrio",
          "verdade",
          "justiça",
          "sabedoria",
          "fé",
          "esperança",
          "destino",
          "propósito",
        ],
        fr: [
          "amour",
          "peur",
          "douleur",
          "joie",
          "tristesse",
          "anxiété",
          "paix",
          "liberté",
          "solitude",
          "pouvoir",
          "force",
          "énergie",
          "volonté",
          "décision",
          "contrôle",
          "maîtrise",
          "transformation",
          "changement",
          "mort",
          "renaissance",
          "éveil",
          "illumination",
          "connexion",
          "union",
          "séparation",
          "conflit",
          "harmonie",
          "équilibre",
          "vérité",
          "justice",
          "sagesse",
          "foi",
          "espoir",
          "destin",
          "but",
        ],
        de: [
          "liebe",
          "angst",
          "schmerz",
          "freude",
          "traurigkeit",
          "furcht",
          "frieden",
          "freiheit",
          "einsamkeit",
          "macht",
          "kraft",
          "energie",
          "wille",
          "entscheidung",
          "kontrolle",
          "herrschaft",
          "transformation",
          "veränderung",
          "tod",
          "wiedergeburt",
          "erwachen",
          "erleuchtung",
          "verbindung",
          "vereinigung",
          "trennung",
          "konflikt",
          "harmonie",
          "gleichgewicht",
          "wahrheit",
          "gerechtigkeit",
          "weisheit",
          "glaube",
          "hoffnung",
          "schicksal",
          "zweck",
        ],
        ja: [
          "愛",
          "恐れ",
          "痛み",
          "喜び",
          "悲しみ",
          "不安",
          "平和",
          "自由",
          "孤独",
          "力",
          "エネルギー",
          "意志",
          "決断",
          "支配",
          "変容",
          "変化",
          "死",
          "再生",
          "目覚め",
          "悟り",
          "つながり",
          "調和",
          "バランス",
          "真実",
          "正義",
          "知恵",
          "信仰",
          "希望",
          "運命",
          "目的",
        ],
        ko: [
          "사랑",
          "두려움",
          "고통",
          "기쁨",
          "슬픔",
          "불안",
          "평화",
          "자유",
          "고독",
          "힘",
          "에너지",
          "의지",
          "결정",
          "지배",
          "변화",
          "죽음",
          "재생",
          "각성",
          "깨달음",
          "연결",
          "조화",
          "균형",
          "진실",
          "정의",
          "지혜",
          "믿음",
          "희망",
          "운명",
          "목적",
        ],
        zh: [
          "爱",
          "恐惧",
          "痛苦",
          "喜悦",
          "悲伤",
          "焦虑",
          "和平",
          "自由",
          "孤独",
          "力量",
          "能量",
          "意志",
          "决定",
          "控制",
          "转化",
          "变化",
          "死亡",
          "重生",
          "觉醒",
          "启迪",
          "连接",
          "和谐",
          "平衡",
          "真理",
          "正义",
          "智慧",
          "信念",
          "希望",
          "命运",
          "目的",
        ],
      };

      // Keyword highlighting disabled - returns plain text with formatted line breaks
      function highlightKeywords(text, lang = "es") {
        if (!text) return "";
        return text.replace(/\n+/g, "<br><br>");
      }

      // Load keywords on page load
      loadKeywords();

      /* ==================== SISTEMA DE RANDOMIZACI\u00d3N TEMPORAL ==================== */
      function getTemporalBiblicalVerse() {
        const now = new Date();

        // Obtener versículos bíblicos de la carta actual
        if (
          !currentCardData ||
          !currentCardData.fullData ||
          !currentCardData.fullData.resonancia_biblica
        ) {
          return window.i18n
            ? window.i18n.t("biblicalSilence")
            : "Los textos sagrados están en silencio en este momento.";
        }

        const resonanciaBiblica = currentCardData.fullData.resonancia_biblica;

        // Crear un array temporal con el versículo actual y variaciones basadas en el tiempo
        const versiculos = [
          `${resonanciaBiblica.cita} - ${resonanciaBiblica.referencia}`,
          `${resonanciaBiblica.conexion} - ${resonanciaBiblica.referencia}`,
        ];

        // "Encarcelamiento temporal" para seleccionar entre los versículos
        const hour = now.getHours();
        const minute = now.getMinutes();
        const day = now.getDate();
        const month = now.getMonth() + 1;

        const temporalHash =
          (hour * 3600 + minute * 60 + day * 31 + month * 12) %
          versiculos.length;

        const verseText = versiculos[temporalHash];

        // Extraer referencia del texto (Formato: 'Texto' - Referencia)
        const parts = verseText.split(" - ");
        let text, ref;

        if (parts.length > 1) {
          text = parts[0];
          ref = parts[1];
        } else {
          text = verseText;
          ref = resonanciaBiblica.referencia;
        }

        // Limpiar comillas residuales
        text = text.replace(/['"«»]/g, "").trim();
        ref = ref.replace(/['"«»]/g, "").trim();

        return `${text}<span class="verse-reference">— ${ref}</span>`;
      }

      // Performance: JSON Cache to avoid re-fetching card data
      const jsonCache = new Map();

      /* ==================== PREPARACIÓN INICIAL ==================== */
      async function prepareOracle() {
        try {
          // Determinar idioma actual
          const lang = window.i18n ? window.i18n.currentLanguage : "es";

          // Sistema Unificado: Cargar un solo archivo maestro
          // Por ahora, usamos el español como base unificada
          let jsonPath = "./public/data/tarot-content-es.json";

          // Si hubiera otros idiomas unificados, usaríamos:
          // if (lang !== 'es') jsonPath = `./public/data/tarot-content-${lang}.json`;

          console.log(`📚 Loading unified content from: ${jsonPath}`);

          let allCards = [];

          // Check cache first
          if (jsonCache.has(jsonPath)) {
            allCards = jsonCache.get(jsonPath);
          } else {
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error(`Failed to load ${jsonPath}`);
            allCards = await response.json();
            jsonCache.set(jsonPath, allCards);
          }

          console.log(`✅ Loaded ${allCards.length} cards from library`);
          // EXTRAER TODOS LOS CONCEPTOS POR CATEGORÍA (22 conceptos cada uno)
          allArquetipos = allCards.map((card) => card.contenido.arquetipo);
          allMisticismos = allCards.map((card) => card.contenido.misticismo);
          allSombras = allCards.map((card) => card.contenido.sombra);
          allBotanicas = allCards.map((card) => card.contenido.botanica);
          allCotidianos = allCards.map((card) => card.contenido.cotidiano);
          allGnosis = allCards.map((card) => card.contenido.gnosis);
          allResonanciasBiblicas = allCards.map(
            (card) => card.contenido.resonancia_biblica
          );

          console.log(
            `📚 Cartas cargadas (${lang}): ${allCards.length} de 22 Arcanos Mayores`
          );

          // SELECCIÓN ALEATORIA DE CARTA
          const randomIndex = Math.floor(Math.random() * allCards.length);
          const selectedCard = allCards[randomIndex];

          // Formatear datos
          currentCardData = {
            id: selectedCard.id, // GUARDAR EL ID PARA PERSISTENCIA
            name: selectedCard.nombre,
            name_short: `ar${selectedCard.id.toString().padStart(2, "0")}`,
            fullData: selectedCard.contenido,
          };

          // PRE-CALCULAR ÍNDICES DE EJEMPLO ALEATORIOS (22 Arcanos Mayores completos)
          currentExampleIndices = {
            arquetipo: Math.floor(Math.random() * allCards.length),
            misticismo: Math.floor(Math.random() * allCards.length),
            sombra: Math.floor(Math.random() * allCards.length),
            botanica: Math.floor(Math.random() * allCards.length),
            cotidiano: Math.floor(Math.random() * allCards.length),
            gnosis: Math.floor(Math.random() * allCards.length),
            resonancia_biblica: Math.floor(Math.random() * allCards.length),
          };

          // Configurar imagen local (./public/cards/arXX.jpg)
          const cardSlug = currentCardData.name_short;
          const imageUrl = `/public/cards/${cardSlug}.png`;

          // Precarga de imagen
          const img = new Image();
          img.onload = () => {
            cardImg.src = imageUrl;
            // Load holographic layers
            updateHoloLayers(cardSlug);
          };
          img.onerror = () => {
            // Fallback: usar imagen del Loco si falla la carga
            cardImg.src = "/public/cards/ar00.png";
          };
          img.src = imageUrl;

          console.log("✨ Carta preparada:", currentCardData.name);
          isProcessing = false;

          // Si la carta ya estaba revelada (cambio de idioma en caliente), actualizar textos
          if (isRevealed) {
            updateRevealedCardTexts();
          }
        } catch (error) {
          console.error("🌙 Error cargando cartas locales:", error);
          // En caso de error, crear carta de fallback
          currentCardData = {
            name: window.i18n ? window.i18n.t("silenceCard") : "El Silencio",
            name_short: "ar00",
            fullData: {
              arquetipo: [
                window.i18n
                  ? window.i18n.t("silenceMessage")
                  : "El éter está turbio en este momento. Respira, centra tu intención y consulta nuevamente.",
              ],
              misticismo: [],
              sombra: [],
              gnosis: [],
              cotidiano: [],
              resonancia_biblica: {
                cita: window.i18n
                  ? window.i18n.t("silenceConnection")
                  : "En este momento de silencio, escucha tu corazón.",
                referencia: window.i18n
                  ? window.i18n.t("silenceReference")
                  : "1 Reyes 19:12",
                conexion: window.i18n
                  ? window.i18n.t("silenceConnection")
                  : "El murmullo de una brisa suave señala la presencia divina en el silencio.",
              },
            },
          };
          cardImg.src = "/public/cards/ar00.png";
        }
      }

      /* ==================== HOLOGRAPHIC SYSTEM (Tier S) ==================== */
      function updateHoloLayers(cardKey) {
        const layers = ["nature", "passion", "ink", "gold", "spirit"];
        layers.forEach((layer) => {
          const el = document.getElementById(
            `holo${layer.charAt(0).toUpperCase() + layer.slice(1)}`
          );
          if (el) {
            el.style.backgroundImage = `url('cards/holo_layers/${cardKey}/${layer}.png')`;
          }
        });
      }

      // Mouse tracking for holographic shimmer effect
      // cardStage already declared above
      let mouseAngle = 45;

      cardStage.addEventListener("mousemove", (e) => {
        const rect = cardStage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate angle from center to mouse position
        const angleRad = Math.atan2(y - centerY, x - centerX);
        const angleDeg = (angleRad * 180) / Math.PI + 90; // Adjust for gradient orientation

        mouseAngle = angleDeg;
        cardStage.style.setProperty("--mouse-angle", `${angleDeg}deg`);
      });

      /* ==================== HELPER: CREATE ACCORDION ==================== */
      function createAccordion(title, data, isSimpleCode = false) {
        if (!data) return "";
        if (isSimpleCode) {
          // Handle simple string data from 0-5.json keys
          const content = data.luz || data;
          return `
                      <details class="voice-accordion">
                          <summary>${title}</summary>
                          <div class="accordion-content">
                              <p>${content}</p>
                          </div>
                      </details>
                  `;
        }
        // Legacy format
        return `
                      <details class="voice-accordion">
                          <summary>${title} <span style="opacity:0.6; font-size:0.8em;">${
          data.titulo || ""
        }</span></summary>
                          <div class="accordion-content">
                              <p><strong>Luz:</strong> ${data.luz}</p>
                              <p style="margin-top:8px;"><strong>Sombra:</strong> ${
                                data.sombra
                              }</p>
                          </div>
                      </details>
                  `;
      }

      function updateHoloLayers(cardKey) {
        const layers = ["nature", "passion", "ink", "gold", "spirit"];
        layers.forEach((layer) => {
          const el = document.getElementById(
            `holo${layer.charAt(0).toUpperCase() + layer.slice(1)}`
          );
          if (el) {
            // Path must be relative to web root (public folder content is at root)
            el.style.backgroundImage = `url('cards/holo_layers/${cardKey}/${layer}.png')`;
          }
        });
      }

      /* ==================== REVELACIÓN ==================== */

      function revealDestiny() {
        console.log("🎴 === REVEAL DESTINY CALLED ===");
        console.log("   - currentCardData:", currentCardData);
        console.log("   - isRevealed (before):", isRevealed);

        if (!currentCardData) {
          console.log("❌ ABORT: No currentCardData");
          return;
        }

        console.log("✅ Proceeding with reveal...");
        isRevealed = true;

        // 0. HABILITAR SCROLL DEL BODY AHORA QUE LA CARTA SE REVELÓ
        console.log("   - Enabling scroll...");
        document.body.classList.remove("no-scroll");
        // Cambiar la interfaz a flex-start para permitir scroll normal
        document.querySelector(".interface").classList.add("revealed");

        // 1. ACTIVAR WALLPAPER Y APLICAR PALETA DE COLORES
        // Limpiar cualquier timeout de reset pendiente para evitar condiciones de carrera
        if (resetColorTimeout) {
          clearTimeout(resetColorTimeout);
          resetColorTimeout = null;
        }

        const palette =
          colorPalettes[currentCardData.name_short] || colorPalettes["ar00"];
        // Establecer colores en :root para que todo el documento pueda acceder
        document.documentElement.style.setProperty("--color1", palette[0]);
        document.documentElement.style.setProperty("--color2", palette[1]);
        document.documentElement.style.setProperty("--color3", palette[2]);
        document.documentElement.style.setProperty("--color4", palette[3]);
        // Establecer el color de las keywords resaltadas (usar el primer color de la paleta)
        document.documentElement.style.setProperty(
          "--keyword-color",
          palette[0]
        );
        wallpaper.classList.add("active");

        // 2. VOLTEAR CARTA (ACTIVAR TRANSICIÓN LENTA)
        cardInner.classList.add("is-flipping");
        cardStage.classList.add("flipped");

        // Quitar clase de transición después de que termine
        setTimeout(() => {
          cardInner.classList.remove("is-flipping");
        }, 850);

        // 3. MOSTRAR TÍTULO
        cardTitle.textContent = currentCardData.name;

        const datos = currentCardData.fullData;
        const lang = window.i18n ? window.i18n.currentLanguage : "es";

        // 4. PREPARE DATA & RENDER TEXTS
        // Unified rendering call
        updateRevealedCardTexts();

        // Update Holo Layers
        updateHoloLayers(currentCardData.name_short);

        // Remove duplicate text on Front (Image Cover)
        // Duplicate text clearing REMOVED to keep Arquetipo visible
        // textoSignificado.innerHTML = "";

        // Versículo Bíblico
        textoBiblico.innerHTML = getTemporalBiblicalVerse();

        // 5. MOSTRAR PANEL (con delay dramático)
        setTimeout(() => {
          insightPanel.classList.add("active");
          // Actualizar aria-label
          cardStage.setAttribute(
            "aria-label",
            window.i18n.t("newConsultation")
          );

          // Re-observe elements for reading unit animations
          if (typeof observeElements === "function") {
            setTimeout(() => observeElements(), 300);
          }

          // 6. ADD TO 3-CARD COLLECTION
          addCardToCollection(currentCardData);

          // Video removed
          // setTimeout(() => {
          //   playCardVideoOnce();
          // }, 800);
        }, 650);
      }

      /* ==================== ARQUETIPO CARD FLIP ==================== */
      function flipArquetipoCard() {
        const card = document.getElementById("arquetipoCard");
        if (card) {
          card.classList.toggle("flipped");
        }
      }

      /* ==================== MODAL DE EJEMPLOS ==================== */
      function openModal(category) {
        let concepts, title, conceptNumber;

        // Seleccionar array de conceptos según la categoría
        switch (category) {
          case "arquetipo":
            concepts = allArquetipos;
            title = window.i18n.t("archetypeModalTitle");
            break;
          case "misticismo":
            concepts = allMisticismos;
            title = window.i18n.t("mysticismModalTitle");
            break;
          case "sombra":
            concepts = allSombras;
            title = window.i18n.t("shadowModalTitle");
            break;
          case "botanica":
            concepts = allBotanicas;
            title = window.i18n.t("botanicModalTitle");
            break;
          case "cotidiano":
            concepts = allCotidianos;
            title = window.i18n.t("dailyModalTitle");
            break;
          case "gnosis":
            concepts = allGnosis;
            title = window.i18n.t("gnosisModalTitle");
            break;
          case "resonancia_biblica":
            concepts = allResonanciasBiblicas;
            title = window.i18n.t("biblicalModalTitle");
            break;
          default:
            return;
        }

        // Seleccionar un concepto aleatorio
        // USAR ÍNDICE PRE-CALCULADO PARA CONSISTENCIA
        const index = currentExampleIndices[category] || 0;
        const selectedConcept = concepts[index];
        conceptNumber = index + 1; // Para mostrar 1-22 en lugar de 0-21

        // Obtener elementos del modal
        const modalOverlay = document.getElementById("modalOverlay");
        const modalTitle = document.getElementById("modalTitle");
        const modalText = document.getElementById("modalText");
        const modalNumber = document.getElementById("modalNumber");

        // Llenar contenido del modal
        modalTitle.textContent = title;
        modalNumber.textContent = window.i18n.t("exampleOf", conceptNumber);

        if (category === "resonancia_biblica") {
          // Formatear contenido de resonancia bíblica
          modalText.innerHTML = `
                          <strong>${window.i18n.t("citation")}</strong> "${
            selectedConcept.cita
          }"<br><br>
                          <strong>${window.i18n.t("reference")}</strong> ${
            selectedConcept.referencia
          }<br><br>
                          <strong>${window.i18n.t("connection")}</strong> ${
            selectedConcept.conexion
          }
                      `;
        } else {
          // Mostrar concepto normal
          modalText.textContent = selectedConcept;
        }

        // Mostrar modal
        modalOverlay.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevenir scroll del body
      }

      function closeModal() {
        const modalOverlay = document.getElementById("modalOverlay");
        modalOverlay.style.display = "none";
        document.body.style.overflow = "auto"; // Restaurar scroll del body
      }

      /* ==================== RESET DEL ORÁCULO ==================== */
      function resetOracle() {
        if (isProcessing) return;
        isProcessing = true;

        // Reset 3-card collection ONLY if full (new cycle)
        if (collectedCards.length >= maxCards) {
          resetCollection();
        }

        // 1. Desactivar wallpaper dinámico
        wallpaper.classList.remove("active");
        // Resetear colores a blanco después de la transición de opacidad
        // Reset del wallpaper a blanco después de 45 segundos
        resetColorTimeout = setTimeout(() => {
          document.documentElement.style.setProperty("--color1", "#ffffff");
          document.documentElement.style.setProperty("--color2", "#ffffff");
          document.documentElement.style.setProperty("--color3", "#ffffff");
          document.documentElement.style.setProperty("--color4", "#ffffff");
          document.documentElement.style.setProperty(
            "--keyword-color",
            "#FFEB3B"
          );
          resetColorTimeout = null;
        }, 1500); // Coincide con la transición de opacidad de los blobs

        // 2. Ocultar panel
        insightPanel.classList.remove("active");
        // Ocultar resultado IA si estaba visible
        aiResult.style.display = "none";
        aiBtn.disabled = false;
        aiBtn.innerHTML = '<span class="ai-btn-icon">✦</span>';

        // 2.5 Video stop logic removed

        // 2.6. Ocultar introducción
        const introSection = document.getElementById("introSection");
        introSection.style.display = "none";

        // 3. Voltear carta de regreso
        // 3. Voltear carta de regreso
        setTimeout(() => {
          cardInner.classList.add("is-flipping");
          cardStage.classList.remove("flipped");
          setTimeout(() => {
            cardInner.classList.remove("is-flipping");
          }, 850);

          isRevealed = false;
        }, 200);

        // 4. Cargar nueva carta (con delay para fluidez)
        setTimeout(async () => {
          // Ocultar secciones y resetear texto inicial
          seccionAmpliado.style.display = "none";
          seccionNegativo.style.display = "none";
          seccionBotanica.style.display = "none";
          seccionCotidiano.style.display = "none";
          seccionMistico.style.display = "none";
          seccionBiblico.style.display = "none";

          cardTitle.textContent = "";
          textoSignificado.textContent = "";

          cardStage.setAttribute("aria-label", window.i18n.t("revealCard"));

          // CRÍTICO: Preparar nueva carta aleatoria
          await prepareOracle();

          // Animation complete
          setTimeout(() => {
            isProcessing = false;

            // Re-observe elements for letter animations
            if (typeof observeElements === "function") {
              observeElements();
            }
          }, 1500);
        }, 900); // This is the original 900ms timeout for the resetOracle function
      }

      /* ==================== LÓGICA DE VERIFICACIÓN Y PAGO ==================== */
      // FUNCIÓN DESACTIVADA - MiniKit eliminado
      /*
            async function requestPayment() {
              // Payment logic removed
              return true; // Always return true for now
            }
            */
      async function requestPayment() {
        // MiniKit/WLD payment removed - always return true
        return true;
      }

      /* ==================== RECARGAR CARTA POR ID (PRESERVAR SELECCIÓN) ==================== */
      async function reloadCardById(cardId) {
        try {
          // Determinar idioma actual
          const lang = window.i18n ? window.i18n.currentLanguage : "es";
          const suffix = lang === "es" ? "" : `_${lang}`;

          console.log(`🔄 Recargando carta ID ${cardId} en idioma ${lang}`);

          // Cargar TODOS los 4 archivos JSON (igual que prepareOracle)
          const fileRanges = ["0-5", "6-10", "11-15", "16-21"];

          const allCards = [];

          for (const range of fileRanges) {
            try {
              let response = await fetch(
                `./public/data/${range}${suffix}.json`
              );

              if (!response.ok && lang !== "es") {
                response = await fetch(`./public/data/${range}.json`);
              }

              if (response.ok) {
                const data = await response.json();
                allCards.push(...data);
              }
            } catch (error) {
              console.error(`Error cargando ${range}:`, error);
            }
          }

          // BUSCAR LA CARTA ESPECÍFICA POR ID (no aleatoria)
          const selectedCard = allCards.find((card) => card.id === cardId);

          if (!selectedCard) {
            console.error(`❌ No se encontró carta con ID ${cardId}`);
            return;
          }

          console.log(
            `✅ Carta encontrada: ${selectedCard.nombre} (ID: ${selectedCard.id})`
          );

          // EXTRAER TODOS LOS CONCEPTOS POR CATEGORÍA
          allArquetipos = allCards.map((card) => card.contenido.arquetipo);
          allMisticismos = allCards.map((card) => card.contenido.misticismo);
          allSombras = allCards.map((card) => card.contenido.sombra);
          allBotanicas = allCards.map((card) => card.contenido.botanica);
          allCotidianos = allCards.map((card) => card.contenido.cotidiano);
          allGnosis = allCards.map((card) => card.contenido.gnosis);
          allResonanciasBiblicas = allCards.map(
            (card) => card.contenido.resonancia_biblica
          );

          // Actualizar currentCardData con la MISMA carta en el nuevo idioma
          currentCardData = {
            id: selectedCard.id, // Mantener ID
            name: selectedCard.nombre,
            name_short: `ar${selectedCard.id.toString().padStart(2, "0")}`,
            fullData: selectedCard.contenido,
          };

          // La imagen NO cambia (mismo ID)
          const cardSlug = currentCardData.name_short;
          const imageUrl = `./public/cards/${cardSlug}.png`;
          cardImg.src = imageUrl;

          // Si la carta está revelada, actualizar los textos
          if (cardStage.classList.contains("flipped")) {
            updateRevealedCardTexts();
          }
        } catch (error) {
          console.error("Error recargando carta:", error);
        }
      }

      /* ==================== CAMBIAR IDIOMA ==================== */
      function toggleLanguage() {
        // Todos los idiomas con traducciones completas
        const langs = ["es", "en", "pt", "fr", "de", "ja", "ko", "zh"];
        const current = window.i18n.currentLanguage;
        let nextIndex = langs.indexOf(current) + 1;
        if (nextIndex >= langs.length) nextIndex = 0;

        const nextLang = langs[nextIndex];
        window.i18n.currentLanguage = nextLang;

        // Actualizar textos de la interfaz
        window.i18n.applyTranslations();

        // Actualizar títulos de secciones
        if (typeof updateSectionTitles === "function") {
          updateSectionTitles();
        }

        // CRÍTICO: Recargar la MISMA carta (por ID) en el nuevo idioma
        // No generar una carta aleatoria nueva
        if (currentCardData && currentCardData.id !== undefined) {
          reloadCardById(currentCardData.id);
        } else {
          // Si no hay carta actual (primera carga), generar una aleatoria
          prepareOracle();
        }
      }

      /* ==================== ACTUALIZACIÓN DE TEXTOS REVELADOS ==================== */
      function updateRevealedCardTexts() {
        if (!currentCardData || !currentCardData.fullData) return;

        const datos = currentCardData.fullData;
        const lang = window.i18n ? window.i18n.currentLanguage : "es";

        // Actualizar título
        cardTitle.textContent = currentCardData.name;

        // Función auxiliar para obtener item seguro
        const getItem = (category) => {
          const item = datos[category];
          if (!item || typeof item !== "string") return "";
          return item;
        };

        // TEXTO PRINCIPAL (Arquetipo) - Siempre visible, sin título
        if (textoArquetipoPrincipal) {
          textoArquetipoPrincipal.innerHTML = getItem("arquetipo");
        }

        // SECCIONES SECUNDARIAS - Mostrar si tienen contenido
        if (textoMisticismo && getItem("misticismo")) {
          textoMisticismo.innerHTML = getItem("misticismo");
          seccionMisticismo.classList.remove("u-hidden");
        }

        if (textoSombra && getItem("sombra")) {
          textoSombra.innerHTML = getItem("sombra");
          seccionSombra.classList.remove("u-hidden");
        }

        if (textoBotanica && getItem("botanica")) {
          textoBotanica.innerHTML = getItem("botanica");
          seccionBotanica.classList.remove("u-hidden");
        }

        if (textoCotidiano && getItem("cotidiano")) {
          textoCotidiano.innerHTML = getItem("cotidiano");
          seccionCotidiano.classList.remove("u-hidden");
        }

        if (textoGnosis && getItem("gnosis")) {
          textoGnosis.innerHTML = getItem("gnosis");
          seccionGnosis.classList.remove("u-hidden");
        }

        // Versículo Bíblico
        if (textoBiblico && datos.resonancia_biblica) {
          textoBiblico.innerHTML = getTemporalBiblicalVerse();
          seccionBiblico.classList.remove("u-hidden");
        }

        // Aplicar traducciones de títulos
        if (
          window.i18n &&
          typeof window.i18n.applyTranslations === "function"
        ) {
          console.log(
            "🌐 Applying translations, current language:",
            window.i18n.currentLanguage
          );
          window.i18n.applyTranslations();

          // Actualizar títulos de secciones
          if (typeof updateSectionTitles === "function") {
            updateSectionTitles();
          }
        }
      }

      /* ==================== BOTÓN IA - SÍNTESIS NUMEROLÓGICA ==================== */
      const aiBtn = document.getElementById("aiBtn");
      const aiResult = document.getElementById("aiResult");
      const aiText = document.getElementById("aiText");

      // Función de pago simplificada (GRATIS/FREE)
      async function requestAIPayment() {
        // Directamente generamos la lectura, sin cobro.
        await generateAIReading("free_bypass_" + Date.now());
        return true;
      }

      // Función para generar la lectura de IA
      async function generateAIReading(transactionId) {
        // Recapture elements to be safe, though globals exist
        const aiBtn = document.getElementById("aiBtn");
        const aiResult = document.getElementById("aiResult");
        const aiText = document.getElementById("aiText");

        // 2. Estado de carga "Pensando"
        aiBtn.disabled = true;
        aiBtn.classList.add("thinking");

        // 3. Recopilar Contexto
        const currentLang = window.i18n ? window.i18n.currentLanguage : "es";
        const contextData = {
          cardName: currentCardData ? currentCardData.name : "Arcano",
          language: currentLang, // Enviar idioma detectado
          definitions: {
            arquetipo: document.getElementById("textoNegativo").textContent,
            sombra: document.getElementById("textoSignificado").textContent,
            misticismo: document.getElementById("textoAmpliado").textContent,
          },
          examples: currentExampleIndices, // Enviamos los índices para referencia
          transactionId: transactionId, // Enviar transactionId verificado
          mode: IS_FRIENDS_MODE ? "friends" : "normal",
        };

        try {
          // 4. Llamada al Backend Real
          const response = await fetch("/api/synthesize-numerology", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(contextData),
          });

          const data = await response.json();

          if (data.reading) {
            // Mostrar Resultado PROCESADO
            // Usamos highlightKeywords para dividir en reading-units y aplicar efectos
            aiText.innerHTML = highlightKeywords(data.reading, currentLang);
            aiResult.style.display = "block";

            // Scroll hacia el resultado
            aiResult.scrollIntoView({ behavior: "smooth", block: "nearest" });

            // Re-observe elements for letter animations
            if (typeof observeElements === "function") {
              setTimeout(() => observeElements(), 100);
            }
          } else {
            throw new Error(data.error || "Error desconocido");
          }
        } catch (error) {
          console.error("Error IA:", error);
          alert("Error conectando con el oráculo. Por favor intenta de nuevo.");
          throw error; // Re-throw to be caught by handlePaymentSuccess
        } finally {
          aiBtn.disabled = false;
          aiBtn.classList.remove("thinking");
        }
      }

      // Función para manejar el éxito del pago y la generación de la lectura
      // This function is no longer needed as requestAIPayment directly calls generateAIReading
      // async function handlePaymentSuccess(transactionId) {
      //         // Mostrar estado de carga
      //         const originalText = aiBtn.innerHTML;
      //         const currentLang = window.i18n ? window.i18n.currentLanguage : 'es';
      //         aiBtn.innerHTML = '<span class="loader"></span> ' + (window.i18n.translations[currentLang]?.numerologyWait || "Synthesizing...");
      //         aiBtn.disabled = true;
      //         aiBtn.classList.add('thinking'); // Add thinking class for visual feedback

      //         try {
      //             // Generar lectura con el transaction ID verificado
      //             await generateAIReading(transactionId);
      //         } catch (error) {
      //             console.error("Error generating reading after payment:", error);
      //             alert(window.i18n.translations[currentLang]?.error || "Error generating reading");
      //         } finally {
      //             aiBtn.innerHTML = originalText;
      //             aiBtn.disabled = false;
      //             aiBtn.classList.remove('thinking');
      //         }
      //     }

      // The original aiBtn.addEventListener block is replaced by this
      if (aiBtn) {
        aiBtn.addEventListener("click", async () => {
          // 1. Solicitar Pago (2.22 WLD)
          // requestAIPayment now handles calling generateAIReading internally
          await requestAIPayment();
        });
      }

      /* ==================== EVENT LISTENERS ==================== */

      // Performance: Click debouncing
      let clickDebounce = false;

      // Click Pattern State Machine: 1/2/3 clicks
      let clickCount = 0;
      let clickTimer = null;
      const CLICK_WINDOW = 800; // 800ms window (faster response)
      const FINAL_WAIT = 1200; // 1.2s wait for triple click (faster)

      cardStage.addEventListener("click", (e) => {
        console.log("🎯 CARD CLICKED - Starting click handler");
        console.log("   - clickDebounce:", clickDebounce);
        console.log("   - isProcessing:", isProcessing);
        console.log("   - isRevealed:", isRevealed);
        console.log("   - currentCardData:", currentCardData);

        // Reduced debounce to avoid interfering with multi-clicks
        if (clickDebounce) {
          console.log("❌ BLOCKED: clickDebounce is true");
          return;
        }
        clickDebounce = true;
        setTimeout(() => (clickDebounce = false), 150); // Reduced from 300ms

        if (isProcessing) {
          console.log("❌ BLOCKED: isProcessing is true");
          return;
        }

        // Ocultar pista visual
        const tapHint = document.getElementById("tapHint");
        if (tapHint) tapHint.style.opacity = "0";

        // INCREMENT CLICK COUNT
        clickCount++;
        console.log(`🖱️ Click count: ${clickCount}`);

        // Clear existing timer
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }

        // STATE 1: First click (wait for more clicks or timeout)
        if (clickCount === 1) {
          console.log("⏱️ Starting timer for single click detection");
          clickTimer = setTimeout(() => {
            console.log(
              "✅ Single click confirmed - attempting to reveal card"
            );
            console.log("   - isRevealed before reveal:", isRevealed);
            console.log("   - currentCardData:", currentCardData);
            // Single click confirmed: REVEAL CARD DIRECTLY (no payment)
            requestAnimationFrame(() => {
              if (!isRevealed && currentCardData) {
                console.log("🎴 Calling revealDestiny()...");
                revealDestiny();
              } else {
                console.log("❌ NOT revealing:");
                console.log("   - isRevealed:", isRevealed);
                console.log("   - currentCardData:", currentCardData);
              }
            });
            clickCount = 0;
          }, CLICK_WINDOW);
        }

        // STATE 2: Double click (ignored - reserved for future features)
        else if (clickCount === 2) {
          clickTimer = setTimeout(() => {
            console.log("✅ Double click ignored (reserved)");
            clickCount = 0;
          }, CLICK_WINDOW);
        }

        // STATE 3: Triple click (RESET)
        else if (clickCount === 3) {
          clickTimer = setTimeout(() => {
            console.log("✅ Triple click confirmed - resetting oracle");
            requestAnimationFrame(() => {
              if (isRevealed) {
                resetOracle();
              }
            });
            clickCount = 0;
          }, FINAL_WAIT);
        }

        // Ignore additional clicks beyond 3
        else if (clickCount > 3) {
          console.log("⚠️ Too many clicks, resetting count");
          clickCount = 0;
        }
      });

      // Accesibilidad: Enter/Space en la carta
      cardStage.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (isProcessing) return;

          if (!isRevealed && currentCardData) {
            revealDestiny();
          } else if (isRevealed) {
            resetOracle();
          }
        }
      });

      // Hacer la carta accesible por teclado
      cardStage.setAttribute("tabindex", "0");
      cardStage.setAttribute("role", "button");
      cardStage.setAttribute(
        "aria-label",
        window.i18n ? window.i18n.t("revealCard") : "Revelar carta del tarot"
      );

      /* ==================== MOBILE TOUCH DRAG WITH 3D LIGHT REFLECTION ==================== */
      let touchStartX = 0,
        touchStartY = 0;
      let isDragging = false;
      let currentTiltX = 0,
        currentTiltY = 0;

      cardStage.addEventListener(
        "touchstart",
        (e) => {
          // Only work on revealed card for premium interaction
          if (!isRevealed || isProcessing) return;

          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          isDragging = true;

          // Disable transition for immediate response
          cardInner.style.transition = "none";
        },
        { passive: true }
      );

      cardStage.addEventListener(
        "touchmove",
        (e) => {
          if (!isDragging || !isRevealed) return;

          const touchX = e.touches[0].clientX;
          const touchY = e.touches[0].clientY;

          const deltaX = touchX - touchStartX;
          const deltaY = touchY - touchStartY;

          // Convert drag distance to tilt angle
          const maxTilt = 15; // degrees
          currentTiltX = Math.max(
            -maxTilt,
            Math.min(maxTilt, (deltaY / window.innerHeight) * maxTilt * -2)
          );
          currentTiltY = Math.max(
            -maxTilt,
            Math.min(maxTilt, (deltaX / window.innerWidth) * maxTilt * 2)
          );

          // Apply 3D tilt
          cardInner.style.setProperty("--rotate-x", `${currentTiltX}deg`);
          cardInner.style.setProperty("--rotate-y", `${currentTiltY}deg`);

          // Dynamic light reflection effect
          const lightX = 50 + (deltaX / window.innerWidth) * 50;
          const lightY = 50 + (deltaY / window.innerHeight) * 50;

          // Apply light gradient to card image
          const cardImg = document.getElementById("cardImg");
          if (cardImg) {
            cardImg.style.background = `
                          radial-gradient(circle at ${lightX}% ${lightY}%,
                              rgba(255,255,255,0.4) 0%,
                              rgba(255,255,255,0.1) 40%,
                              transparent 70%),
                          url(${cardImg.src})
                      `;
            cardImg.style.backgroundSize = "cover";
            cardImg.style.backgroundPosition = "center";
          }
        },
        { passive: true }
      );

      cardStage.addEventListener(
        "touchend",
        () => {
          if (!isDragging) return;
          isDragging = false;

          // Smooth return to neutral position
          cardInner.style.transition =
            "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
          cardInner.style.setProperty("--rotate-x", "0deg");
          cardInner.style.setProperty("--rotate-y", "0deg");

          // Reset light effect
          const cardImg = document.getElementById("cardImg");
          if (cardImg) {
            cardImg.style.background = `url(${cardImg.src})`;
            cardImg.style.backgroundSize = "cover";
          }

          // Reset to normal card movement after short delay
          setTimeout(() => {
            cardInner.style.transition = "";
          }, 600);
        },
        { passive: true }
      );

      /* ==================== LONG-PRESS VIDEO PLAYBACK (REMOVED) ==================== */
      // Video elements removed
      /*
            const videoOverlay = document.getElementById("videoOverlay");
            const cardVideo = document.getElementById("cardVideo");
            const videoSource = document.getElementById("videoSource");
            */

      let longPressTimer = null;
      let isVideoPlaying = false;

      /* VIDEO LOGIC REMOVED
            function startLongPress() {}
            function cancelLongPress() {}
            function playCardVideoOnce() {}
            function playCardVideo() {}
            function stopCardVideo() {}
            */

      /* ==================== FLOATING STARS (MAGNETIC SCROLL EFFECT) ==================== */
      function initFloatingStars() {
        const starCount = 200; // Maximum density like Apple auto motion indicator
        const stars = [];

        // Create stars
        for (let i = 0; i < starCount; i++) {
          const star = document.createElement("div");
          star.className = "floating-star";
          star.style.left = `${Math.random() * 100}%`;
          star.style.top = `${Math.random() * 100}%`;
          star.style.setProperty("--delay", `${Math.random() * 2}s`);

          document.body.appendChild(star);

          stars.push({
            el: star,
            baseX: parseFloat(star.style.left),
            baseY: parseFloat(star.style.top),
            speedX: (Math.random() - 0.5) * 0.5, // Magnetic parallax factor
            speedY: (Math.random() - 0.5) * 0.8,
          });
        }

        // Magnetic scroll effect
        let scrollY = 0;
        window.addEventListener("scroll", () => {
          scrollY = window.scrollY;
        });

        function updateStars() {
          stars.forEach((star) => {
            const offsetX = scrollY * star.speedX;
            const offsetY = scrollY * star.speedY;
            star.el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
          });
          requestAnimationFrame(updateStars);
        }

        requestAnimationFrame(updateStars);
      }

      /* ==================== INICIALIZACIÓN ==================== */
      // Cargar la primera carta al cargar la página
      /* ==================== MONETIZATION SYSTEM ==================== */

      // Track unlocked content per session
      let unlockedSections = {
        shadow: false,
        deepAnalysis: false,
      };

      // Unlock Shadow Section with Ad
      const unlockShadowBtn = document.getElementById("unlockShadowBtn");
      if (unlockShadowBtn) {
        unlockShadowBtn.addEventListener("click", () => {
          // In production, this triggers actual AdSense ad
          // For now, simulate unlock after delay
          console.log(
            "🎬 User clicked unlock - would show AdSense rewarded ad here"
          );

          // Simulate ad viewing (replace with actual AdSense callback)
          setTimeout(() => {
            unlockContent("shadow");
          }, 500); // In production: triggered by AdSense onAdClosed callback
        });
      }

      // Unlock content function
      function unlockContent(type) {
        if (type === "shadow") {
          unlockedSections.shadow = true;
          const lockUI = document.getElementById("shadowLock");
          const content = document.getElementById("textoNegativo");

          if (lockUI) lockUI.style.display = "none";
          if (content) content.classList.remove("u-hidden");

          console.log("✅ Shadow content unlocked");
        }
      }

      // Interstitial Ad (after reading completion)
      let hasShownInterstitial = false;

      // Interstitial Ad Logic Removed
      // (function showInterstitialAd() ... deleted)

      /* ==================== DARK/LIGHT MODE TOGGLE ==================== */
      const darkModeToggle = document.getElementById("darkModeToggle");
      // Icons
      const sunIcon = `<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      const moonIcon = `<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

      // Initialize
      if (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.body.classList.add("dark-mode");
        darkModeToggle.innerHTML = `<span class="mode-icon">${moonIcon}</span>`;
      } else {
        darkModeToggle.innerHTML = `<span class="mode-icon">${sunIcon}</span>`;
      }

      darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");

        // Use Moon for action to switch to Dark? No, usually icon shows current state.
        // If Dark -> Show Moon. If Light -> Show Sun.
        const content = isDark ? moonIcon : sunIcon;
        darkModeToggle.innerHTML = `<span class="mode-icon">${content}</span>`;
      });

      /* ==================== GYROSCOPE (MOBILE) ==================== */
      window.addEventListener("load", () => {
        // Aplicar traducciones según idioma del navegador
        if (window.i18n) {
          const detectedLang = window.i18n.getBrowserLanguage();
          window.i18n.currentLanguage = detectedLang;

          // Actualizar atributo lang del HTML
          document
            .getElementById("htmlRoot")
            .setAttribute("lang", detectedLang);

          // Aplicar traducciones a la interfaz
          window.i18n.applyTranslations();

          // Actualizar títulos de secciones
          updateSectionTitles();
        }

        prepareOracle();

        // Start 3D Effect
        init3DCardEffect();

        // Initialize floating stars
        initFloatingStars();

        // Arrow Click Listener
        const arrow = document.getElementById("moreContentIndicator");
        if (arrow) {
          arrow.addEventListener("click", () => {
            console.log("🏹 ¡Flecha clickeada! Iniciando scroll...");
            const contenedorAcordeones =
              document.getElementById("seccionExploracion");
            if (contenedorAcordeones) {
              contenedorAcordeones.style.display = "block";
              contenedorAcordeones.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          });
        }

        // Start Gyroscope Border Effects
        initGyroscopeBorders();
      });

      /* ==================== GYROSCOPE IRIDESCENT BORDERS ==================== */
      function initGyroscopeBorders() {
        const root = document.documentElement;
        let smoothGyroX = 0;
        let smoothGyroY = 0;
        let smoothGyroHue = 0;

        // Check for DeviceOrientation API support
        if (window.DeviceOrientationEvent) {
          // Request permission for iOS 13+
          if (typeof DeviceOrientationEvent.requestPermission === "function") {
            // Only request permission on user interaction
            document.addEventListener(
              "click",
              function requestPermission() {
                DeviceOrientationEvent.requestPermission()
                  .then((permissionState) => {
                    if (permissionState === "granted") {
                      window.addEventListener(
                        "deviceorientation",
                        handleOrientation,
                        true
                      );
                      console.log("✅ Gyroscope permissions granted");
                    }
                  })
                  .catch(console.error);
                // Remove listener after first click
                document.removeEventListener("click", requestPermission);
              },
              { once: true }
            );
          } else {
            // Non-iOS devices don't need permission
            window.addEventListener(
              "deviceorientation",
              handleOrientation,
              true
            );
          }
        } else {
          // Fallback to mouse movement for desktop
          console.log("📱 Gyroscope not available, using mouse fallback");
          useFallbackMouse();
        }

        function handleOrientation(event) {
          // Extract orientation angles
          const beta = event.beta; // Front-to-back tilt (-180 to 180)
          const gamma = event.gamma; // Left-to-right tilt (-90 to 90)
          const alpha = event.alpha; // Compass direction (0 to 360)

          if (beta !== null && gamma !== null && alpha !== null) {
            // Smooth transitions using linear interpolation
            smoothGyroX += (gamma - smoothGyroX) * 0.1;
            smoothGyroY += (beta - smoothGyroY) * 0.1;
            smoothGyroHue += (alpha - smoothGyroHue) * 0.05;

            // Update CSS custom properties
            root.style.setProperty("--gyro-x", smoothGyroX.toFixed(2));
            root.style.setProperty("--gyro-y", smoothGyroY.toFixed(2));
            root.style.setProperty("--gyro-z", (beta + gamma).toFixed(2));
            root.style.setProperty("--gyro-hue", smoothGyroHue.toFixed(2));
          }
        }

        function useFallbackMouse() {
          // Use mouse movement as fallback for desktop
          let mouseX = 0;
          let mouseY = 0;

          document.addEventListener("mousemove", (e) => {
            // Normalize mouse position to -45 to 45 range (similar to gyro)
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const targetX = ((e.clientX - centerX) / centerX) * 45;
            const targetY = ((e.clientY - centerY) / centerY) * 45;

            // Smooth transition
            mouseX += (targetX - mouseX) * 0.1;
            mouseY += (targetY - mouseY) * 0.1;

            // Update CSS custom properties
            root.style.setProperty("--gyro-x", mouseX.toFixed(2));
            root.style.setProperty("--gyro-y", mouseY.toFixed(2));
            root.style.setProperty("--gyro-z", (mouseX + mouseY).toFixed(2));

            // Rotate hue based on mouse position
            const hue = (e.clientX / window.innerWidth) * 360;
            smoothGyroHue += (hue - smoothGyroHue) * 0.05;
            root.style.setProperty("--gyro-hue", smoothGyroHue.toFixed(2));
          });

          // Add subtle auto-animation when mouse is idle
          let animationFrame;
          function autoAnimate() {
            smoothGyroHue = (smoothGyroHue + 0.5) % 360;
            root.style.setProperty("--gyro-hue", smoothGyroHue.toFixed(2));
            animationFrame = requestAnimationFrame(autoAnimate);
          }
          autoAnimate();

          // Pause auto-animation during mouse movement
          document.addEventListener(
            "mousemove",
            () => {
              cancelAnimationFrame(animationFrame);
              setTimeout(() => {
                autoAnimate();
              }, 2000);
            },
            { passive: true }
          );
        }
      }

      /* ==================== 3D APPLE STYLE EFFECT ==================== */
      function init3DCardEffect() {
        // Use existing cardStage reference from parent scope
        const cardInner = document.querySelector(".card-inner");

        if (!cardStage || !cardInner) return;

        // Tracking variables
        let bounds;

        function rotateToMouse(e) {
          if (!bounds) bounds = cardStage.getBoundingClientRect();

          // Get mouse/touch position
          let clientX, clientY;
          if (e.type.includes("touch")) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
          } else {
            clientX = e.clientX;
            clientY = e.clientY;
          }

          // Calculate position relative to card center
          const leftX = clientX - bounds.x;
          const topY = clientY - bounds.y;
          const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2,
          };

          // Calculate rotation (Sensitivity: divide by factor)
          // Y rotation is based on X position (tilting left/right)
          // X rotation is based on Y position (tilting up/down)
          // Inverted Y because positive Y is down in screen coords, but we want tilt back
          const maxTilt = 12; // Degrees

          // Map distance to angle
          const rotateX = ((center.y / (bounds.height / 2)) * -maxTilt).toFixed(
            2
          );
          const rotateY = ((center.x / (bounds.width / 2)) * maxTilt).toFixed(
            2
          );

          // Calculate Glare Position (0% to 100%)
          const glareX = ((leftX / bounds.width) * 100).toFixed(2);
          const glareY = ((topY / bounds.height) * 100).toFixed(2);

          // Verify text content of variable before style set? No need.

          // Apply update via RequestAnimationFrame for performance
          requestAnimationFrame(() => {
            cardInner.style.setProperty("--rotate-x", `${rotateX}deg`);
            cardInner.style.setProperty("--rotate-y", `${rotateY}deg`);

            // Glare follows the mouse
            cardStage.style.setProperty("--glare-x", `${glareX}%`);
            cardStage.style.setProperty("--glare-y", `${glareY}%`);
            cardStage.style.setProperty("--glare-opacity", "0.6"); // Make visible

            // PARALLAX 2.5D - Mover layers a diferentes velocidades
            const holoLayers = cardStage.querySelectorAll(".holo-layer");
            holoLayers.forEach((layer, index) => {
              // Cada layer se mueve a diferente profundidad
              // Nature (0) - más lejos, se mueve menos
              // Passion (1) - medio
              // Ink (2) - cerca, se mueve más
              const depthFactor = (index + 1) * 0.5; // 0.5, 1.0, 1.5, etc.
              const moveX = (center.x / bounds.width) * 15 * depthFactor;
              const moveY = (center.y / bounds.height) * 15 * depthFactor;
              layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
          });
        }

        function clearRotate() {
          requestAnimationFrame(() => {
            cardInner.style.setProperty("--rotate-x", "0deg");
            cardInner.style.setProperty("--rotate-y", "0deg");
            cardStage.style.setProperty("--glare-opacity", "0");

            // Reset parallax 2.5D
            const holoLayers = cardStage.querySelectorAll(".holo-layer");
            holoLayers.forEach((layer) => {
              layer.style.transform = "translate(0px, 0px)";
            });
          });
        }

        // Update bounds on scroll/resize
        window.addEventListener("resize", () => {
          bounds = cardStage.getBoundingClientRect();
        });

        // Touch Handling
        cardStage.addEventListener("touchstart", (e) => {
          bounds = cardStage.getBoundingClientRect();
          // e.preventDefault(); // Don't block scroll yet
        });

        cardStage.addEventListener(
          "touchmove",
          (e) => {
            // If it's a small horizontal move, maybe block scroll?
            // For now, let's just animate
            rotateToMouse(e);
          },
          { passive: true }
        ); // Passive allows scroll

        cardStage.addEventListener("touchend", clearRotate);

        // Mouse Handling
        cardStage.addEventListener("mouseenter", () => {
          bounds = cardStage.getBoundingClientRect();
        });

        cardStage.addEventListener("mousemove", rotateToMouse);
        cardStage.addEventListener("mouseleave", clearRotate);
      }

      // Intersection Observer for scroll-triggered letter animations
      let observeElements; // Global reference to re-observe function

      function initScrollAnimations() {
        const observerOptions = {
          threshold: 0.2, // Trigger when 20% of the line is visible
          rootMargin: "0px 0px -20% 0px", // Active zone is slightly above bottom
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Activate reading unit (light up)
              entry.target.classList.add("active");

              // Trigger animation for letters inside
              const letters = entry.target.querySelectorAll(".letter-animate");
              const keywords =
                entry.target.querySelectorAll(".keyword-highlight");

              letters.forEach((letter, index) => {
                letter.classList.add("reveal");
                // Add fill class with delay for white fill effect
                setTimeout(() => {
                  letter.classList.add("fill");
                }, index * 30 + 400); // Stagger the fill effect
              });

              // Add filled class to keywords after all letters animated
              if (letters.length > 0) {
                setTimeout(() => {
                  keywords.forEach((kw) => kw.classList.add("filled"));
                }, letters.length * 30 + 800);
              }

              observer.unobserve(entry.target);
            }
          });
        }, observerOptions);

        observeElements = () => {
          // Observe the reading units generated by highlightKeywords
          const elementsToObserve = document.querySelectorAll(".reading-unit");
          elementsToObserve.forEach((el) => {
            observer.observe(el);
          });

          // Fallback for any content not wrapped (e.g. lists)
          const legacyElements = document.querySelectorAll(".card-insight li");
          legacyElements.forEach((el) => observer.observe(el));
        };

        // Initial observation
        observeElements();
        // Re-observe when new content is added
        return observeElements;
      }

      // Función para actualizar títulos de secciones con i18n
      function updateSectionTitles() {
        if (window.i18n) {
          const titleArquetipo = document.getElementById("titleArquetipo");
          const titleMisticismo = document.getElementById("titleMisticismo");
          const titleSombra = document.getElementById("titleSombra");
          const titleBotanica = document.getElementById("titleBotanica");
          const titleCotidiano = document.getElementById("titleCotidiano");
          const titleGnosis = document.getElementById("titleGnosis");
          const titleResonanciaBiblica = document.getElementById(
            "titleResonanciaBiblica"
          );

          if (titleArquetipo)
            titleArquetipo.textContent = window.i18n.t("archetypeTitle");
          if (titleMisticismo)
            titleMisticismo.textContent = window.i18n.t("mysticismTitle");
          if (titleSombra)
            titleSombra.textContent = window.i18n.t("shadowTitle");
          if (titleBotanica)
            titleBotanica.textContent = window.i18n.t("botanicTitle");
          if (titleCotidiano)
            titleCotidiano.textContent = window.i18n.t("dailyTitle");
          if (titleGnosis)
            titleGnosis.textContent = window.i18n.t("gnosisTitle");
          if (titleResonanciaBiblica)
            titleResonanciaBiblica.textContent = window.i18n.t("biblicalTitle");
        }
      }

      // Agregar event listeners para los títulos con ">"
      document.addEventListener("DOMContentLoaded", () => {
        // BLOQUEAR SCROLL INICIALMENTE HASTA QUE SE REVELE LA CARTA
        document.body.classList.add("no-scroll");

        // Actualizar títulos de secciones con traducciones
        updateSectionTitles();

        // Initialize scroll animations
        initScrollAnimations();

        // Solo mantener el listener de Biblia (ya no hay título de Arquetipo porque la carta es clickeable)

        // Event listener para cerrar modal
        const closeBtn = document.getElementById("modalClose");
        if (closeBtn) {
          closeBtn.addEventListener("click", closeModal);
        }

        // Cerrar modal al hacer click fuera del contenido
        document
          .getElementById("modalOverlay")
          .addEventListener("click", (e) => {
            if (e.target === document.getElementById("modalOverlay")) {
              closeModal();
            }
          });

        // Cerrar modal con tecla Escape
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            closeModal();
          }
        });
      });

      // Discord webhook integration for composite reading requests
      setTimeout(() => {
        const compositeEmailBtn = document.getElementById("compositeEmailBtn");
        if (compositeEmailBtn) {
          compositeEmailBtn.addEventListener("click", async () => {
            // Disable button during request
            compositeEmailBtn.disabled = true;
            compositeEmailBtn.textContent = "📤 Enviando...";

            try {
              // Attempt to send via Discord webhook
              const response = await fetch("/api/composite-reading", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  cards: collectedCards.map((c) => ({ name: c.name })),
                }),
              });

              if (response.ok) {
                // Success
                compositeEmailBtn.textContent = "✅ Enviado!";
                setTimeout(() => {
                  compositeEmailBtn.textContent =
                    "📧 Solicitar Lectura Profunda";
                  compositeEmailBtn.disabled = false;
                }, 3000);
              } else {
                throw new Error("API request failed");
              }
            } catch (error) {
              console.warn(
                "Discord webhook failed, falling back to mailto:",
                error
              );

              // Fallback to mailto
              const cards = collectedCards
                .map((c, idx) => `${idx + 1}. ${c.name}`)
                .join("%0A");
              const subject = "Solicitud de Lectura Profunda - Star Oracle";
              const body = `Hola,%0A%0AHe completado una lectura de 3 cartas y me gustaría solicitar una lectura más profunda.%0A%0AMis cartas son:%0A${cards}%0A%0AGracias!`;
              window.location.href = `mailto:asterin.star@gmail.com?subject=${subject}&body=${body}`;

              // Reset button
              compositeEmailBtn.textContent = "📧 Solicitar Lectura Profunda";
              compositeEmailBtn.disabled = false;
            }
          });
        }
      }, 500);

      // Logic for Collection Button
      const collectionBtn = document.getElementById("collectionBtn");
      const collectionModal = document.getElementById("collectionModal");
      const collectionClose = document.getElementById("collectionClose");
      const collectionList = document.getElementById("collectionList");

      if (collectionBtn) {
        collectionBtn.addEventListener("click", () => {
          return; // Feature disabled per user request
          const requestDeepReadingBtn =
            document.getElementById("requestDeepReading");

          // Render list
          if (collectedCards.length === 0) {
            collectionList.innerHTML =
              '<p style="text-align:center; opacity:0.7; padding: 20px;">' +
              (window.i18n
                ? window.i18n.t("noCards") || "No hay cartas aún"
                : "No hay cartas aún") +
              "</p>";
            if (requestDeepReadingBtn)
              requestDeepReadingBtn.style.display = "none";
          } else {
            let html =
              '<div style="display:flex; flex-direction:column; gap:10px;">';
            collectedCards.forEach((card) => {
              // Format timestamp for display
              const date = new Date(card.timestamp);
              const timeStr = date.toLocaleString("es-AR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              });

              html += `
                                  <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.1); padding:12px; border-radius:10px;">
                                      <img src="${card.image}" style="width:40px; height:60px; object-fit:cover; border-radius:5px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                                      <div style="flex: 1;">
                                          <div style="font-weight:600; margin-bottom:4px;">${card.name}</div>
                                          <div style="font-size:0.85rem; opacity:0.7;">${timeStr}</div>
                                      </div>
                                  </div>
                              `;
            });
            html += "</div>";
            collectionList.innerHTML = html;

            // Show deep reading button when cards exist
            if (requestDeepReadingBtn)
              requestDeepReadingBtn.style.display = "block";
          }
          collectionModal.style.display = "flex";
        });
      }

      if (collectionClose) {
        collectionClose.addEventListener("click", () => {
          collectionModal.style.display = "none";
        });
      }

      /* ==================== TAB NAVIGATION (Main Tabs: Collection / Deep Analysis) ==================== */
      document.querySelectorAll(".portal-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          const targetTab = tab.getAttribute("data-tab");

          // Remove active from all tabs
          document
            .querySelectorAll(".portal-tab")
            .forEach((t) => t.classList.remove("active"));
          // Remove active from all tab contents
          document
            .querySelectorAll(".portal-tab-content")
            .forEach((tc) => tc.classList.remove("active"));

          // Activate clicked tab
          tab.classList.add("active");
          // Show corresponding content
          document.getElementById(`tab-${targetTab}`).classList.add("active");
        });
      });

      /* ==================== SUB-TAB NAVIGATION (Mind / Body / Natal) ==================== */
      document.querySelectorAll(".analysis-sub-tab").forEach((subtab) => {
        subtab.addEventListener("click", () => {
          const targetSubtab = subtab.getAttribute("data-subtab");

          // Remove active from all sub-tabs
          document
            .querySelectorAll(".analysis-sub-tab")
            .forEach((st) => st.classList.remove("active"));
          // Remove active from all sub-tab contents
          document
            .querySelectorAll(".analysis-sub-content")
            .forEach((stc) => stc.classList.remove("active"));

          // Activate clicked sub-tab
          subtab.classList.add("active");
          // Show corresponding content
          document
            .getElementById(`subtab-${targetSubtab}`)
            .classList.add("active");
        });
      });

      // Close on overlay click
      if (collectionModal) {
        collectionModal.addEventListener("click", (e) => {
          if (e.target === collectionModal)
            collectionModal.style.display = "none";
        });
      }

      /* ==================== PORTAL TABS FUNCTIONALITY ==================== */
      const portalTabs = document.querySelectorAll(".portal-tab");
      const portalTabContents = document.querySelectorAll(
        ".portal-tab-content"
      );

      portalTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          // Remove active class from all tabs and contents
          portalTabs.forEach((t) => t.classList.remove("active"));
          portalTabContents.forEach((c) => c.classList.remove("active"));

          // Add active class to clicked tab
          tab.classList.add("active");

          // Show corresponding content
          const tabName = tab.getAttribute("data-tab");
          const content = document.getElementById(`tab-${tabName}`);
          if (content) content.classList.add("active");
        });
      });

      /* ==================== NATAL CHART: LOCATION TYPE TOGGLE ==================== */
      const locationTypeRadios = document.querySelectorAll(
        'input[name="locationType"]'
      );
      const hospitalInput = document.getElementById("hospitalInput");
      const mapInput = document.getElementById("mapInput");

      locationTypeRadios.forEach((radio) => {
        radio.addEventListener("change", (e) => {
          if (e.target.value === "hospital") {
            hospitalInput.style.display = "block";
            mapInput.style.display = "none";
          } else {
            hospitalInput.style.display = "none";
            mapInput.style.display = "block";
            // TODO: Initialize Google Maps here when API key is available
            // initializeGoogleMaps();
          }
        });
      });

      /* ==================== DEEP ANALYSIS API HELPER ==================== */

      async function callDeepAnalysisAPI(type, additionalData = {}) {
        try {
          // Note: In production, endpoint would be /api/deep-analysis
          const endpoint =
            window.location.hostname === "localhost"
              ? "http://localhost:3000/api/deep-analysis"
              : "/api/deep-analysis";

          const payload = {
            type: type,
            collectedCards: collectedCards.map((card) => ({
              name: card.name,
              name_short: card.name_short,
              timestamp: card.timestamp,
            })),
            ...additionalData,
          };

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Deep Analysis API Error:", error);
          throw error;
        }
      }

      /* ==================== PAYMENT VERIFICATION (10 WLD with Friends Bypass) ==================== */
      async function verifyDeepAnalysisPayment() {
        const urlParams = new URLSearchParams(window.location.search);
        const isFriendsMode = urlParams.get("mode") === "friends";

        if (isFriendsMode) {
          console.log("✅ Friends mode - payment bypassed for deep analysis");
          return true;
        }

        // Request 10 WLD payment
        const paymentSuccess = await requestPayment(10);
        return paymentSuccess;
      }

      /* ==================== NEW ANALYSIS HANDLERS (10-Card Spreads from Full Deck) ==================== */

      // Mind Analysis - 10 Cards
      const mindAnalysisBtn = document.getElementById("requestMindAnalysis");
      if (mindAnalysisBtn) {
        mindAnalysisBtn.addEventListener("click", async () => {
          const resultDiv = document.getElementById("mindAnalysisResult");

          const fullName = document.getElementById("fullName")?.value;
          const birthDate = document.getElementById("birthDate")?.value;
          const birthTime = document.getElementById("birthTime")?.value;

          if (!fullName || !birthDate || !birthTime) {
            resultDiv.innerHTML =
              '<p style="color: #ffaa00;">⚠️ Completa tus datos personales primero.</p>';
            resultDiv.style.display = "block";
            return;
          }

          mindAnalysisBtn.disabled = true;
          mindAnalysisBtn.innerHTML =
            '<span class="btn-icon">💳</span> Verificando...';

          const paymentOk = await verifyDeepAnalysisPayment();
          if (!paymentOk) {
            mindAnalysisBtn.disabled = false;
            mindAnalysisBtn.innerHTML =
              '<span class="btn-icon">🧬</span> Realizar Tirada de Mente';
            resultDiv.innerHTML =
              '<p style="color: #ffaa00;">⚠️ Pago requerido (10 WLD).</p>';
            resultDiv.style.display = "block";
            return;
          }

          const cardSpread = drawCardSpread(10);
          mindAnalysisBtn.innerHTML =
            '<span class="btn-icon">⏳</span> Analizando...';
          resultDiv.innerHTML =
            '<p style="opacity:0.7;">🧠 Analizando con 10 cartas...</p>';
          resultDiv.style.display = "block";

          try {
            const response = await callDeepAnalysisAPI("mind", {
              cards: cardSpread,
              birthData: { name: fullName, date: birthDate, time: birthTime },
            });

            resultDiv.innerHTML = `
                              <h5 style="margin:0 0 15px; font-weight:700;">🧠 Análisis de Mente</h5>
                              <div style="white-space:pre-line; line-height:1.7;">${response.analysis}</div>
                          `;
          } catch (error) {
            resultDiv.innerHTML =
              '<p style="color:#ff6b6b;">❌ Error en análisis.</p>';
          } finally {
            mindAnalysisBtn.disabled = false;
            mindAnalysisBtn.innerHTML =
              '<span class="btn-icon">🧬</span> Realizar Tirada de Mente';
          }
        });
      }

      // Body Analysis - 10 Cards
      const bodyAnalysisBtn2 = document.getElementById("requestBodyAnalysis");
      if (bodyAnalysisBtn2) {
        const oldHandler = bodyAnalysisBtn2.onclick;
        bodyAnalysisBtn2.onclick = null;

        bodyAnalysisBtn2.addEventListener("click", async () => {
          const resultDiv = document.getElementById("bodyAnalysisResult");

          const fullName = document.getElementById("fullName")?.value;
          const birthDate = document.getElementById("birthDate")?.value;
          const birthTime = document.getElementById("birthTime")?.value;

          if (!fullName || !birthDate || !birthTime) {
            resultDiv.innerHTML =
              '<p style="color: #ffaa00;">⚠️ Completa tus datos personales primero.</p>';
            resultDiv.style.display = "block";
            return;
          }

          bodyAnalysisBtn2.disabled = true;
          bodyAnalysisBtn2.innerHTML =
            '<span class="btn-icon">💳</span> Verificando...';

          const paymentOk = await verifyDeepAnalysisPayment();
          if (!paymentOk) {
            bodyAnalysisBtn2.disabled = false;
            bodyAnalysisBtn2.innerHTML =
              '<span class="btn-icon">🌓</span> Realizar Tirada de Cuerpo';
            resultDiv.innerHTML =
              '<p style="color: #ffaa00;">⚠️ Pago requerido (10 WLD).</p>';
            resultDiv.style.display = "block";
            return;
          }

          const cardSpread = drawCardSpread(10);
          bodyAnalysisBtn2.innerHTML =
            '<span class="btn-icon">⏳</span> Analizando...';
          resultDiv.innerHTML =
            '<p style="opacity:0.7;">⚖️ Analizando con 10 cartas...</p>';
          resultDiv.style.display = "block";

          try {
            const response = await callDeepAnalysisAPI("body", {
              cards: cardSpread,
              birthData: { name: fullName, date: birthDate, time: birthTime },
            });

            resultDiv.innerHTML = `
                              <h5 style="margin:0 0 15px; font-weight:700;">⚖️ Análisis de Cuerpo</h5>
                              <div style="white-space:pre-line; line-height:1.7;">${response.analysis}</div>
                          `;
          } catch (error) {
            resultDiv.innerHTML =
              '<p style="color:#ff6b6b;">❌ Error en análisis.</p>';
          } finally {
            bodyAnalysisBtn2.disabled = false;
            bodyAnalysisBtn2.innerHTML =
              '<span class="btn-icon">🌓</span> Realizar Tirada de Cuerpo';
          }
        });
      }

      // Natal Chart - Complete Synthesis
      const natalChartBtn2 = document.getElementById("calculateNatalChart");
      if (natalChartBtn2) {
        const oldHandler = natalChartBtn2.onclick;
        natalChartBtn2.onclick = null;

        natalChartBtn2.addEventListener("click", async () => {
          const resultDiv = document.getElementById("natalChartResult");

          const fullName = document.getElementById("fullName")?.value;
          const birthDate = document.getElementById("birthDate")?.value;
          const birthTime = document.getElementById("birthTime")?.value;
          const lat = document.getElementById("selectedLat")?.textContent;
          const lng = document.getElementById("selectedLng")?.textContent;

          if (!fullName || !birthDate || !birthTime || lat === "-") {
            resultDiv.innerHTML =
              '<p style="color: #ffaa00;">⚠️ Completa todos los datos incluyendo ubicación.</p>';
            resultDiv.style.display = "block";
            return;
          }

          natalChartBtn2.disabled = true;
          natalChartBtn2.innerHTML =
            '<span class="btn-icon">💳</span> Verificando...';

          const paymentOk = await verifyDeepAnalysisPayment();
          if (!paymentOk) {
            natalChartBtn2.disabled = false;
            natalChartBtn2.innerHTML =
              '<span class="btn-icon">✨</span> Generar Análisis Completo';
            resultDiv.innerHTML =
              '<p style="color: #ffaa00;">⚠️ Pago requerido (10 WLD).</p>';
            resultDiv.style.display = "block";
            return;
          }

          natalChartBtn2.innerHTML =
            '<span class="btn-icon">⏳</span> Generando...';
          resultDiv.innerHTML =
            '<p style="opacity:0.7;">⭐ Generando análisis completo...</p>';
          resultDiv.style.display = "block";

          try {
            const response = await callDeepAnalysisAPI("complete", {
              birthData: {
                name: fullName,
                date: birthDate,
                time: birthTime,
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),
              },
            });

            resultDiv.innerHTML = `
                              <h5 style="margin:0 0 15px; font-weight:700;">⭐ Análisis Holístico Completo</h5>
                              <p style="margin-bottom:15px;"><strong>${fullName}</strong> - ${new Date(
              birthDate + "T" + birthTime
            ).toLocaleString("es-AR")}</p>
                              <div style="white-space:pre-line; line-height:1.7;">${
                                response.analysis
                              }</div>
                          `;
          } catch (error) {
            resultDiv.innerHTML =
              '<p style="color:#ff6b6b;">❌ Error al generar análisis.</p>';
          } finally {
            natalChartBtn2.disabled = false;
            natalChartBtn2.innerHTML =
              '<span class="btn-icon">✨</span> Generar Análisis Completo';
          }
        });
      }

      /* ==================== ANALYSIS BUTTON HANDLERS ==================== */

      // Brain Analysis Button
      const brainAnalysisBtn = document.getElementById("requestBrainAnalysis");
      if (brainAnalysisBtn) {
        brainAnalysisBtn.addEventListener("click", async () => {
          const resultDiv = document.getElementById("brainAnalysisResult");

          if (collectedCards.length === 0) {
            resultDiv.innerHTML =
              '<p style="text-align:center; opacity:0.7;">⚠️ Primero debes colectar cartas para realizar el análisis.</p>';
            resultDiv.style.display = "block";
            return;
          }

          // Show loading state
          brainAnalysisBtn.disabled = true;
          brainAnalysisBtn.innerHTML =
            '<span class="btn-icon">⏳</span> Analizando...';
          resultDiv.innerHTML =
            '<p style="text-align:center; opacity:0.7;">🧠 Conectando con Google AI para análisis cerebral profundo...</p>';
          resultDiv.style.display = "block";

          try {
            // Call real Google AI API
            const response = await callDeepAnalysisAPI("brain");

            resultDiv.innerHTML = `
                              <h5 style="margin: 0 0 15px 0; font-weight: 700;">🧠 Análisis Cerebral Completo</h5>
                              <div style="white-space: pre-line; line-height: 1.7;">${response.analysis}</div>
                          `;
          } catch (error) {
            resultDiv.innerHTML =
              '<p style="color: #ff6b6b;">❌ Error al realizar el análisis. Por favor intenta nuevamente.</p>';
          } finally {
            brainAnalysisBtn.disabled = false;
            brainAnalysisBtn.innerHTML =
              '<span class="btn-icon">🧬</span> Analizar Estado Cerebral';
          }
        });
      }

      // Body Analysis Button
      const bodyAnalysisBtn = document.getElementById("requestBodyAnalysis");
      if (bodyAnalysisBtn) {
        bodyAnalysisBtn.addEventListener("click", async () => {
          const resultDiv = document.getElementById("bodyAnalysisResult");

          if (collectedCards.length === 0) {
            resultDiv.innerHTML =
              '<p style="text-align:center; opacity:0.7;">⚠️ Primero debes colectar cartas para realizar el análisis.</p>';
            resultDiv.style.display = "block";
            return;
          }

          bodyAnalysisBtn.disabled = true;
          bodyAnalysisBtn.innerHTML =
            '<span class="btn-icon">⏳</span> Analizando...';
          resultDiv.innerHTML =
            '<p style="text-align:center; opacity:0.7;">⚖️ Conectando con Google AI para análisis corporal...</p>';
          resultDiv.style.display = "block";

          try {
            const response = await callDeepAnalysisAPI("body");

            resultDiv.innerHTML = `
                              <h5 style="margin: 0 0 15px 0; font-weight: 700;">⚖️ Análisis de Equilibrio Corporal</h5>
                              <div style="white-space: pre-line; line-height: 1.7;">${response.analysis}</div>
                          `;
          } catch (error) {
            resultDiv.innerHTML =
              '<p style="color: #ff6b6b;">❌ Error al realizar el análisis.</p>';
          } finally {
            bodyAnalysisBtn.disabled = false;
            bodyAnalysisBtn.innerHTML =
              '<span class="btn-icon">🌓</span> Analizar Equilibrio Corporal';
          }
        });
      }

      // Personality Profile Button
      const personalityProfileBtn = document.getElementById(
        "requestPersonalityProfile"
      );
      if (personalityProfileBtn) {
        personalityProfileBtn.addEventListener("click", async () => {
          const resultDiv = document.getElementById("personalityProfileResult");

          if (collectedCards.length === 0) {
            resultDiv.innerHTML =
              '<p style="text-align:center; opacity:0.7;">⚠️ Primero debes colectar cartas para generar tu perfil.</p>';
            resultDiv.style.display = "block";
            return;
          }

          personalityProfileBtn.disabled = true;
          personalityProfileBtn.innerHTML =
            '<span class="btn-icon">⏳</span> Generando...';
          resultDiv.innerHTML =
            '<p style="text-align:center; opacity:0.7;">📊 Conectando con Google AI para generar perfil...</p>';
          resultDiv.style.display = "block";

          try {
            const response = await callDeepAnalysisAPI("personality");

            resultDiv.innerHTML = `
                              <h5 style="margin: 0 0 15px 0; font-weight: 700;">🎴 Perfil de Personalidad (Stats)</h5>
                              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                                  <div style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                                      <strong>💪 Fuerza:</strong> ${response.stats.fuerza}/20
                                  </div>
                                  <div style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                                      <strong>🧠 Inteligencia:</strong> ${response.stats.inteligencia}/20
                                  </div>
                                  <div style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                                      <strong>🦉 Sabiduría:</strong> ${response.stats.sabiduria}/20
                                  </div>
                                  <div style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                                      <strong>✨ Carisma:</strong> ${response.stats.carisma}/20
                                  </div>
                                  <div style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                                      <strong>❤️ Constitución:</strong> ${response.stats.constitucion}/20
                                  </div>
                                  <div style="padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                                      <strong>🎯 Destreza:</strong> ${response.stats.destreza}/20
                                  </div>
                              </div>
                              <div style="white-space: pre-line; line-height: 1.7;">${response.analysis}</div>
                          `;
          } catch (error) {
            resultDiv.innerHTML =
              '<p style="color: #ff6b6b;">❌ Error al generar el perfil.</p>';
          } finally {
            personalityProfileBtn.disabled = false;
            personalityProfileBtn.innerHTML =
              '<span class="btn-icon">📊</span> Generar Perfil Completo';
          }
        });
      }

      /* NATAL CHART LOGIC TEMPORARILY DISABLED FOR DEBUGGING
      // Natal Chart Calculation Button
      const natalChartBtn = document.getElementById("calculateNatalChart");
      if (natalChartBtn) {
         // ... code commented out in next steps because simple comment wrap might break if nested comments exist ...
      }
      */
    </script>

    <a
      href="https://www.patreon.com/cw/star_loop"
      target="_blank"
      rel="noopener noreferrer"
      class="social-btn patreon-btn"
      aria-label="Apóyanos en Patreon"
    >
      <!-- Patreon Logo SVG -->
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.32 5.56C15.32 8.63 12.83 11.12 9.76 11.12C6.69 11.12 4.2 8.63 4.2 5.56C4.2 2.49 6.69 0 9.76 0C12.83 0 15.32 2.49 15.32 5.56ZM0 24H3.2V0H0V24Z"
          fill="#555"
        />
      </svg>
    </a>

    <style>
      .social-btn {
        position: fixed;
        right: 30px;
        width: 56px;
        height: 56px;
        /* Ajustado al nuevo estilo glassmorphism */
        background: rgba(255, 255, 255, 0.5);
        -webkit-backdrop-filter: blur(15px);
        backdrop-filter: blur(15px);
        border: 1.5px solid rgba(255, 255, 255, 0.6);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 1000;
        text-decoration: none;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }

      .instagram-btn {
        display: none;
      }

      .patreon-btn {
        bottom: 30px;
      }

      .social-btn:hover {
        background: rgba(255, 255, 255, 0.7);
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        border-color: rgba(255, 255, 255, 0.8);
      }

      .social-btn svg {
        transition: transform 0.3s ease;
      }

      .social-btn:hover svg {
        transform: scale(1.1);
      }

      /* Ajuste específico para el logo de Patreon que suele ser más pequeño visualmente */
      .patreon-btn svg {
        width: 24px;
        height: 24px;
      }

      @media (max-width: 768px) {
        .social-btn {
          right: 20px;
          width: 48px;
          height: 48px;
        }

        .instagram-btn {
          bottom: 20px;
        }
