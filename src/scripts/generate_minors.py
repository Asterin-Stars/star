import json
import os
from data.minors_content import WANDS_CONTENT, CUPS_CONTENT, SWORDS_CONTENT, PENTACLES_CONTENT

OUTPUT_DIR = "/home/star/star/public/data"

CONTENT_MAP = {
    'wands': WANDS_CONTENT,
    'cups': CUPS_CONTENT,
    'swords': SWORDS_CONTENT,
    'pentacles': PENTACLES_CONTENT
}

SUITS = {
    'wands': {'name': 'Bastos', 'element': 'Fuego'},
    'cups': {'name': 'Copas', 'element': 'Agua'},
    'swords': {'name': 'Espadas', 'element': 'Aire'},
    'pentacles': {'name': 'Oros', 'element': 'Tierra'}
}

NUMBERS = {
    'ace': {'name': 'As', 'meaning': 'Origen'},
    '02': {'name': 'Dos', 'meaning': 'Equilibrio'},
    '03': {'name': 'Tres', 'meaning': 'Creación'},
    '04': {'name': 'Cuatro', 'meaning': 'Estabilidad'},
    '05': {'name': 'Cinco', 'meaning': 'Conflicto'},
    '06': {'name': 'Seis', 'meaning': 'Armonía'},
    '07': {'name': 'Siete', 'meaning': 'Estrategia'},
    '08': {'name': 'Ocho', 'meaning': 'Movimiento'},
    '09': {'name': 'Nueve', 'meaning': 'Culminación'},
    '10': {'name': 'Diez', 'meaning': 'Final'},
    'page': {'name': 'Sota', 'meaning': 'Inicio'},
    'knight': {'name': 'Caballo', 'meaning': 'Acción'},
    'queen': {'name': 'Reina', 'meaning': 'Maestría Interna'},
    'king': {'name': 'Rey', 'meaning': 'Autoridad'}
}

# Helper to get numeric suffix or key match
def get_card_content(suit_key, number_key):
    # Construct the key expected in the dictionaries (e.g., "wands_ace")
    # Our dictionaries use keys like "wands_ace", "wands_10", "wands_king"
    key = f"{suit_key}_{number_key}"
    
    # Locate in specific content dict
    content_dict = CONTENT_MAP.get(suit_key, {})
    
    if key in content_dict:
        return content_dict[key]
    else:
        # Fallback if key missing (should not happen with full data)
        return {
            "arquetipo": "Energía indefinida.",
            "sombra": "Bloqueo desconocido.",
            "misticismo": "Misterio.",
            "arte": "...",
            "ciencia": "...",
            "computacion": "...",
            "social": "..."
        }

def generate_minors():
    print("🚀 Generating High-Fidelity Minor Arcana Data...")
    
    for suit_key, suit_data in SUITS.items():
        cards = []
        # Order matching the content keys
        order = ['ace', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'page', 'knight', 'queen', 'king']
        
        for idx, key in enumerate(order):
            content_key = f"{suit_key}_{key}" # e.g. wands_02
            
            # Name construction
            short_name = NUMBERS.get(key, {}).get('name', key)
            full_name = f"{short_name} de {suit_data['name']}"
            
            # Get Rich Content
            content = get_card_content(suit_key, key)
            
            # Add universal "cotidiano" if missing
            if "cotidiano" not in content:
                content["cotidiano"] = f"Un momento de {content['arquetipo'].split('.')[0]} en tu día."

            # Structure
            card_entry = {
                "id": content_key, # wands_ace
                "key": content_key.upper(),
                "nombre": full_name,
                "contenido": content
            }
            cards.append(card_entry)
            
        # Save suit file
        filename = f"{suit_key}.json"
        with open(os.path.join(OUTPUT_DIR, filename), 'w') as f:
            json.dump(cards, f, indent=2, ensure_ascii=False)
        print(f"✅ Generated {filename} with {len(cards)} cards")

if __name__ == "__main__":
    generate_minors()

