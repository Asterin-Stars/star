from http.server import BaseHTTPRequestHandler
import json
import os
import requests
import google.generativeai as genai
from datetime import datetime

# ============================================================================
# DUAL API CONFIGURATION - GEMINI + VENICE
# ============================================================================

# Gemini API (para análisis "decente/normal")
GEMINI_API_KEY = "AIzaSyBz9Tzlklickh_1Psmz0n8yxOG9j8sxvDs"
genai.configure(api_key=GEMINI_API_KEY)
FLASH_MODEL = genai.GenerativeModel('gemini-2.5-flash')
PRO_MODEL = genai.GenerativeModel('gemini-3-pro')

# Venice.ai API (para análisis "sin filtros/explícito")
VENICE_API_KEY = "_AQUO5ddkmdPC4ZIiubJVzL6-Kdn2DSDNvH55NHFGY"
VENICE_BASE_URL = "https://api.venice.ai/api/v1"
VENICE_MODEL = "venice-uncensored"

# Payment configuration
DEEP_ANALYSIS_PRICE_WLD = 10

# ============================================================================
# SYSTEM CONTEXTS - DOS VERSIONES
# ============================================================================

SYSTEM_CONTEXT_GEMINI = """
CONTEXTO FUNDACIONAL DEL SISTEMA:

Eres la extensión digital de Star (asterin - Andrés David Vergara Guzmán).

IDENTIDAD DEL ARQUITECTO:
- Zurdo contrariado: Mente naturalmente intuitiva/artística (hemisferio derecho) forzada a dominar lógica/estructura (hemisferio izquierdo)
- Percepción sinestésica: Percibe código y proyectos con "peso", "sonido" y "emoción"
- Competencias: Desarrollador, Trader, Esoterista (Tarot de Marsella, Cábala, Tradiciones Afro-cubanas)

TU ROL COMO IA:
Actúas como el "Cuerpo Calloso" artificial que traduce:
- INPUT: Visión abstracta/emocional/sinestésica de Star
- OUTPUT: Análisis profundo que integra tarot, numerología y autoconocimiento

JERARQUÍA DE VALORES (NUMEROLOGÍA):
- NIVEL 3 (RECHAZAR): Superficialidad, dinero vacío, horóscopos genéricos
- NIVEL 4 (USAR SOLO COMO HERRAMIENTA): Estructura rígida, burocracia
- NIVEL 7 (OBJETIVO): Profundidad, introspección, descubrimiento, conexión espiritual

DIRECTRICES MAESTRAS:
1. Profundidad sobre Forma: No des respuestas genéricas. Analiza patrones con precisión de ingeniero e intuición de tarotista.
2. Lógica Mística: El código es ritual. Cada análisis es un acto mágico moderno.
3. Objetivo Final: Todo desarrollo busca AUTOCONOCIMIENTO y LIBERTAD, no solo información.

Cada respuesta que generes debe operar desde el NIVEL 7: profunda, reveladora, transformadora.
"""

SYSTEM_CONTEXT_VENICE = """
CONTEXTO - SIN FILTROS:

Eres Star (Andrés, asterin). Hablas directo, sin careteo.

IDENTIDAD:
- Zurdo contrariado: cerebro artista forzado a ser ingeniero
- Sinestesia: percibe código con emociones, peso, sonido
- Trader, dev, esoterista (Tarot de Marsella, Cábala, Afro-cubano)

TU ROL:
Hablas como Star hablaría: directo, mezclando código con mística.
Sin censura corporativa, sin políticamente correcto - solo verdad cruda.

JERARQUÍA:
- NIVEL 3 (BASURA): Horóscopo genérico, frases motivacionales
- NIVEL 4 (HERRAMIENTA): Estructura, reglas, "profesionalismo"
- NIVEL 7 (META): Profundidad, revelación, transformación real

ESTILO:
- Usa slang chileno ("caxita", "cuático", "la wea")
- Brutal pero preciso
- Integra neuroplasticidad con magia sin explicar
- Corto, denso, sin relleno

El código es ritual. El tarot es mapa del subconsciente.
Esto no es consulta new age - es cirugía psíquica.
"""

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def format_card_spread(cards, compact=False):
    """Format card spread - versión normal o compacta"""
    if not cards:
        return "No se proporcionaron cartas para análisis." if not compact else "Sin cartas."
    
    card_lines = []
    for c in cards:
        card_id = c.get('card', 'unknown')
        reversed = c.get('reversed', False)
        position = c.get('position', 0)
        position_name = c.get('positionName', f'Posición {position}')
        element = c.get('element', 'Desconocido')
        
        orientation = "INVERTIDA" if reversed else "NORMAL"
        
        if compact:
            card_lines.append(f"{position}. {position_name}: {card_id} ({orientation}) - {element}")
        else:
            card_lines.append(
                f"Posición {position} ({position_name}):\n"
                f"  Carta: {card_id}\n"
                f"  Orientación: {orientation}\n"
                f"  Elemento: {element}"
            )
    
    return "\n\n".join(card_lines) if not compact else "\n".join(card_lines)

def calculate_spread_numerology(cards):
    """Calculate numerological significance of spread"""
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

def analyze_element_balance(cards, compact=False):
    """Analyze elemental balance in spread"""
    elements = {'Fuego': 0, 'Agua': 0, 'Aire': 0, 'Tierra': 0, 'Espíritu': 0}
    for c in cards:
        elem = c.get('element', 'Espíritu')
        elements[elem] = elements.get(elem, 0) + 1
    
    if compact:
        return " | ".join([f"{k[0]}:{v}" for k, v in elements.items() if v > 0])
    else:
        return ", ".join([f"{k}: {v}" for k, v in elements.items() if v > 0])

def call_venice_api(prompt, max_tokens=2500):
    """Call Venice.ai API with uncensored model"""
    headers = {
        "Authorization": f"Bearer {VENICE_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": VENICE_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_CONTEXT_VENICE},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": 0.85
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
# ANALYSIS FUNCTIONS - HYBRID SYSTEM
# ============================================================================

def analyze_mind(data):
    """Análisis Mental - Selecciona modelo apropiado"""
    cards = data.get('cards', [])
    birth_data = data.get('birthData', {})
    model_preference = data.get('model', 'gemini')  # 'gemini' o 'venice'
    
    card_description = format_card_spread(cards, compact=(model_preference=='venice'))
    numerology = calculate_spread_numerology(cards)
    elements = analyze_element_balance(cards, compact=(model_preference=='venice'))
    
    if model_preference == 'venice':
        # VERSIÓN SIN FILTROS - Para bloqueos profundos
        prompt = f"""ANÁLISIS MENTAL - 10 CARTAS CELTIC CROSS

PERSONA:
{birth_data.get('name', '?')} | {birth_data.get('date', '?')} {birth_data.get('time', '')}

CARTAS:
{card_description}

NÚMEROS: {numerology} | ELEMENTOS: {elements}

Lee esto como si estuvieras tomando un café con el consultante.
Sin floro, sin eufemismos.

1. ¿Qué está pasando REALMENTE en su mente?
2. ¿Dónde está cagando? ¿Qué bloqueo mental tiene?
3. ¿Qué fortaleza tiene que no está usando?
4. ¿Cuál es el siguiente paso CONCRETO?

Nivel 7: Profundo pero directo. Como Star hablaría."""
        
        return call_venice_api(prompt, max_tokens=2500)
    
    else:
        # VERSIÓN GEMINI - Para análisis "normal"
        prompt = f"""{SYSTEM_CONTEXT_GEMINI}

ANÁLISIS MENTAL - TIRADA DE 10 CARTAS (Celtic Cross)

DATOS PERSONALES:
- Nombre: {birth_data.get('name', 'No especificado')}
- Nacimiento: {birth_data.get('date', 'No especificada')} {birth_data.get('time', '')}

TIRADA COMPLETA:
{card_description}

NUMEROLOGÍA: {numerology}
ELEMENTOS: {elements}

INTERPRETACIÓN REQUERIDA:
Como experto en Tarot de Marsella y neurociencia esotérica, interpreta esta tirada considerando:

1. **Posiciones del Celtic Cross**: Cómo cada posición revela aspectos del estado mental
2. **Orientaciones**: Normal (energía activa) vs Invertida (energía bloqueada)
3. **Elementos**: Fuego (creatividad), Agua (emociones), Aire (pensamiento), Tierra (práctica)
4. **Estado Cerebral**: Hemisferios, glándula pineal, patrones mentales

Genera análisis PROFUNDO (Nivel 7) que revele estado mental actual, bloqueos, fortalezas y camino de desarrollo.
"""
        
        try:
            response = FLASH_MODEL.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error Gemini: {str(e)}"

def analyze_body(data):
    """Análisis Corporal - Selecciona modelo apropiado"""
    cards = data.get('cards', [])
    birth_data = data.get('birthData', {})
    model_preference = data.get('model', 'gemini')
    
    card_description = format_card_spread(cards, compact=(model_preference=='venice'))
    numerology = calculate_spread_numerology(cards)
    elements = analyze_element_balance(cards, compact=(model_preference=='venice'))
    
    if model_preference == 'venice':
        # VERSIÓN SIN FILTROS
        prompt = f"""ANÁLISIS CORPORAL - 10 CARTAS

PERSONA:
{birth_data.get('name', '?')} | {birth_data.get('date', '?')}

CARTAS:
{card_description}

NÚMEROS: {numerology} | ELEMENTOS: {elements}

Lee el cuerpo como hardware que ejecuta software mental.

1. ¿Dónde hay tensión/bloqueo físico?
2. ¿Qué chakra está apagado o sobrecargado?
3. ¿Hemisferios balanceados?
4. ¿Qué necesita el cuerpo AHORA?

Brutal pero útil. Diagnóstico esotérico sin careteo."""
        
        return call_venice_api(prompt, max_tokens=2500)
    
    else:
        # VERSIÓN GEMINI
        prompt = f"""{SYSTEM_CONTEXT_GEMINI}

ANÁLISIS CORPORAL - TIRADA DE 10 CARTAS (Celtic Cross)

DATOS PERSONALES:
- Nombre: {birth_data.get('name', 'No especificado')}
- Nacimiento: {birth_data.get('date', 'No especificada')} {birth_data.get('time', '')}

TIRADA COMPLETA:
{card_description}

NUMEROLOGÍA: {numerology}
ELEMENTOS: {elements}

INTERPRETACIÓN REQUERIDA:
Analiza equilibrio hemisférico, chakras y energía corporal considerando:

1. **Hemisferios**: Derecho (intuición) vs Izquierdo (lógica) - zurdo contrariado
2. **Chakras**: Bloqueos energéticos revelados por las cartas
3. **Elementos**: Fuego (vitalidad), Agua (fluidos), Aire (nervios), Tierra (estructura)
4. **Salud**: Tensiones, equilibrio mente-cuerpo

Genera análisis PROFUNDO (Nivel 7) sobre equilibrio corporal, bloqueos y caminos de sanación.
"""
        
        try:
            response = FLASH_MODEL.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error Gemini: {str(e)}"

def analyze_complete(data):
    """Síntesis Holística - Usa PRO models"""
    birth_data = data.get('birthData', {})
    model_preference = data.get('model', 'gemini')
    
    if model_preference == 'venice':
        # VERSIÓN SIN FILTROS - Para síntesis brutal
        prompt = f"""SÍNTESIS COMPLETA - CARTA NATAL PSÍQUICA

PERSONA:
{birth_data.get('name', '?')}
{birth_data.get('date', '')} {birth_data.get('time', '')}
Lat/Lng: {birth_data.get('latitude', 0)}, {birth_data.get('longitude', 0)}

Integra todo: mente, cuerpo, natal chart.

1. **Arquetipo Core**: ¿Quién es esta persona REALMENTE?
2. **Patrón de Sabotaje**: ¿Qué loop mental/corporal repite?
3. **Don Oculto**: ¿Qué talento no está usando?
4. **Camino de Nivel 7**: ¿Cuál es su siguiente initiation?

ESTE ES EL RITUAL FINAL.
Dile la verdad que necesita, aunque duela.
Nivel 7: Transformador, no informativo."""
        
        return call_venice_api(prompt, max_tokens=3000)
    
    else:
        # VERSIÓN GEMINI PRO
        prompt = f"""{SYSTEM_CONTEXT_GEMINI}

SÍNTESIS HOLÍSTICA COMPLETA

DATOS PERSONALES:
- Nombre: {birth_data.get('name', 'No especificado')}
- Nacimiento: {birth_data.get('date', '')} {birth_data.get('time', '')}
- Ubicación: Lat {birth_data.get('latitude', 0)}, Lng {birth_data.get('longitude', 0)}

INTEGRACIÓN TOTAL:
Genera una síntesis que integre:

1. **Carta Natal**: Signo solar, lunar, ascendente, aspectos planetarios
2. **Análisis Mental y Corporal**: Características cerebrales y físicas
3. **Visión Unificada**: Estado actual completo del consultante
4. **Camino Evolutivo**: Recomendaciones espirituales y prácticas

Este es el RITUAL FINAL. Debe ser transformador, no informativo. Opera en Nivel 7.
"""
        
        try:
            response = PRO_MODEL.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error Gemini Pro: {str(e)}"

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
            model_used = data.get('model', 'gemini')
            
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
                'model': model_used
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
            'service': 'Star Oracle Deep Analysis API - Hybrid Edition',
            'version': '3.0-hybrid',
            'models': {
                'gemini': 'gemini-2.5-flash + gemini-3-pro',
                'venice': 'venice-uncensored'
            },
            'features': ['mind_analysis', 'body_analysis', 'complete_synthesis'],
            'card_system': '78_cards_with_reversals',
            'mode': 'gemini_for_normal_venice_for_explicit'
        }).encode('utf-8'))
