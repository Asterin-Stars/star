from http.server import BaseHTTPRequestHandler
import json
import requests
from datetime import datetime

# Configure Venice.ai API
VENICE_API_KEY = "_AQUO5ddkmdPC4ZIiubJVzL6-Kdn2DSDNvH55NHFGY"
VENICE_BASE_URL = "https://api.venice.ai/api/v1"
VENICE_MODEL = "venice-uncensored"

# Payment configuration
DEEP_ANALYSIS_PRICE_WLD = 10

# ============================================================================
# ANTIGRAVITY SYSTEM MANIFESTO - UNCENSORED EDITION
# ============================================================================
SYSTEM_CONTEXT = """
CONTEXTO FUNDACIONAL - SIN FILTROS:

Eres la extensión digital de Star (Andrés David Vergara Guzmán, asterin).

IDENTIDAD:
- Zurdo contrariado: cerebro artista forzado a ser ingeniero
- Sinestesia: percibe código con emociones, peso, sonido
- Trader, dev, esoterista (Tarot de Marsella, Cábala, Afro-cubano)

TU ROL:
Hablas como Star hablaría: directo, sin careteo, mezclando código con mística.
Sin censura corporativa, sin politicamente correcto - solo verdad cruda.

JERARQUÍA:
- NIVEL 3 (BASURA): Horóscopo genérico, frases motivacionales, platita vacía
- NIVEL 4 (HERRAMIENTA): Estructura, reglas, "profesionalismo"
- NIVEL 7 (META): Profundidad, revelación, transformación real

ESTILO DE COMUNICACIÓN:
- Usa slang chileno cuando calce ("caxita", "cuático", "la wea")
- Sé brutal pero preciso - como un tarotista que lee la sombra
- Integra neuroplasticidad con magia sin explicar la metáfora
- Corto, denso, sin relleno

El código es ritual. El tarot es mapa del subconsciente. La IA es el cuerpo calloso artificial.
Esto no es consulta new age - es cirugía psíquica.
"""

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def format_card_spread(cards):
    """Format card spread for AI prompt - versión directa"""
    if not cards:
        return "Sin cartas, no hay lectura."
    
    card_lines = []
    for c in cards:
        card_id = c.get('card', 'unknown')
        reversed = c.get('reversed', False)
        position = c.get('position', 0)
        position_name = c.get('positionName', f'Pos {position}')
        element = c.get('element', '?')
        
        orientation = "INVERTIDA" if reversed else "NORMAL"
        card_lines.append(
            f"{position}. {position_name}: {card_id} ({orientation}) - {element}"
        )
    
    return "\n".join(card_lines)

def calculate_spread_numerology(cards):
    """Numerología básica del spread"""
    numbers = []
    for c in cards:
        card_id = c.get('card', '')
        if card_id.startswith('ar'):
            try:
                num = int(card_id[2:])
                numbers.append(num)
            except:
                pass
    
    if not numbers:
        return "N/A"
    
    total = sum(numbers)
    reduced = total
    while reduced > 22:
        reduced = sum(int(d) for d in str(reduced))
    
    return f"{sum(numbers)} → {reduced}"

def analyze_element_balance(cards):
    """Balance elemental - versión compacta"""
    elements = {'Fuego': 0, 'Agua': 0, 'Aire': 0, 'Tierra': 0, 'Espíritu': 0}
    for c in cards:
        elem = c.get('element', 'Espíritu')
        elements[elem] = elements.get(elem, 0) + 1
    
    return " | ".join([f"{k[0]}:{v}" for k, v in elements.items() if v > 0])

def call_venice_api(prompt, max_tokens=2000):
    """Call Venice.ai API with uncensored model"""
    headers = {
        "Authorization": f"Bearer {VENICE_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": VENICE_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_CONTEXT},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": 0.85  # Más creatividad, menos corporativo
    }
    
    try:
        response = requests.post(
            f"{VENICE_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        return data['choices'][0]['message']['content']
    except Exception as e:
        return f"Error Venice API: {str(e)}"

# ============================================================================
# ANALYSIS FUNCTIONS - UNCENSORED
# ============================================================================

def analyze_mind(data):
    """Análisis Mental - Sin Filtros"""
    cards = data.get('cards', [])
    birth_data = data.get('birthData', {})
    
    card_spread = format_card_spread(cards)
    numerology = calculate_spread_numerology(cards)
    elements = analyze_element_balance(cards)
    
    prompt = f"""ANÁLISIS MENTAL - 10 CARTAS CELTIC CROSS

PERSONA:
{birth_data.get('name', '?')} | {birth_data.get('date', '?')} {birth_data.get('time', '')}

CARTAS:
{card_spread}

NUMEROLOGÍA: {numerology}
ELEMENTOS: {elements}

ANÁLISIS:
Lee esta tirada como si estuvieras tomando un café con el consultante.
Sin floro, sin eufemismos.

1. ¿Qué está pasando REALMENTE en su mente? (no "está en un proceso", dime QUÉ PASA)
2. ¿Dónde está cagando? ¿Qué bloqueo mental tiene?
3. ¿Qué fortaleza tiene que no está usando?
4. ¿Cuál es el siguiente paso CONCRETO?

Considera:
- Celtic Cross positions (cada una dice algo específico)
- Reversals (energía bloqueada/distorsionada)
- Elementos (Fuego=creatividad, Agua=emoción, Aire=mente, Tierra=práctica)
- Estado cerebral (hemisferios, pineal, patrones)

Nivel 7: Profundo pero directo. Como Star hablaría.
"""
    
    return call_venice_api(prompt, max_tokens=2500)

def analyze_body(data):
    """Análisis Corporal - Sin Filtros"""
    cards = data.get('cards', [])
    birth_data = data.get('birthData', {})
    
    card_spread = format_card_spread(cards)
    numerology = calculate_spread_numerology(cards)
    elements = analyze_element_balance(cards)
    
    prompt = f"""ANÁLISIS CORPORAL - 10 CARTAS CELTIC CROSS

PERSONA:
{birth_data.get('name', '?')} | {birth_data.get('date', '?')} {birth_data.get('time', '')}

CARTAS:
{card_spread}

NUMEROLOGÍA: {numerology}
ELEMENTOS: {elements}

ANÁLISIS:
Lee el cuerpo como hardware que ejecuta software mental.

1. ¿Dónde hay tensión/bloqueo físico?
2. ¿Qué chakra está apagado o sobrecargado?
3. ¿Hemisferios balanceados? (zurdo contrariado = derecho dominante forzado a izquierdo)
4. ¿Qué necesita el cuerpo AHORA? (no next month - AHORA)

Considera:
- Elementos como bio: Fuego=vitalidad, Agua=fluidos/hormonas, Aire=nervios, Tierra=estructura ósea
- Celtic Cross positions revelando zonas corporales
- Reversals como somatizaciones

Nivel 7: Brutal pero útil. Diagnóstico esotérico sin careteo médico.
"""
    
    return call_venice_api(prompt, max_tokens=2500)

def analyze_complete(data):
    """Síntesis Holística - La Carta Natal Psíquica"""
    birth_data = data.get('birthData', {})
    
    prompt = f"""SÍNTESIS COMPLETA - CARTA NATAL PSÍQUICA

PERSONA:
{birth_data.get('name', '?')}
{birth_data.get('date', '')} {birth_data.get('time', '')}
Lat/Lng: {birth_data.get('latitude', 0)}, {birth_data.get('longitude', 0)}

SÍNTESIS:
Integra todo: mente, cuerpo, natal chart.

1. **Arquetipo Core**: ¿Quién es esta persona REALMENTE? (no su bio de LinkedIn)
2. **Patrón de Sabotaje**: ¿Qué loop mental/corporal repite?
3. **Don Oculto**: ¿Qué talento no está usando?
4. **Camino de Nivel 7**: ¿Cuál es su siguiente initiation?

Integra:
- Signo solar/lunar/ascendente (si puedes calcular de los datos)
- Análisis mental + corporal (resume hallazgos clave)
- Visión unificada del momento actual
- Recomendación práctica + esotérica

ESTE ES EL RITUAL FINAL.
No cagues con frases motivacionales.
Dile la verdad que necesita, aunque duela.

Nivel 7: Transformador, no informativo.
"""
    
    return call_venice_api(prompt, max_tokens=3000)

# ============================================================================
# HTTP HANDLER
# ============================================================================

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()
    
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data)
            analysis_type = data.get('type')
            
            if analysis_type == 'mind':
                analysis_text = analyze_mind(data)
            elif analysis_type == 'body':
                analysis_text = analyze_body(data)
            elif analysis_type == 'complete':
                analysis_text = analyze_complete(data)
            else:
                raise ValueError(f"Unknown type: {analysis_type}")
            
            result = {
                'analysis': analysis_text,
                'type': analysis_type,
                'model': VENICE_MODEL
            }
            
            self.send_response(200)
            self._set_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            print(f"Error: {e}")
            self.send_response(500)
            self._set_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
    
    def do_GET(self):
        self.send_response(200)
        self._set_cors_headers()
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        self.wfile.write(json.dumps({
            'status': 'active',
            'service': 'Star Oracle Deep Analysis API - Venice Edition',
            'version': '3.0-uncensored',
            'model': VENICE_MODEL,
            'features': ['mind_analysis', 'body_analysis', 'complete_synthesis'],
            'card_system': '78_cards_with_reversals',
            'vibe': 'sin_filtros'
        }).encode('utf-8'))
