
import json
import os
import re

# Import content sources
# Note: We will manually define them here or import if paths were simple, 
# but for reliability in this environment, I will paste the content mappings directly 
# or use strict file reading if I was sure of the path context, but pasting is safer for "one-shot" generation.
# However, the files are large. I will read them from the file system.

MAJORS_PATH = "/home/star/star/src/scripts/data/majors_content.py"
MINORS_PATH = "/home/star/star/src/scripts/data/minors_content.py"
EXISTING_JS_PATH = "/home/star/star/src/js/tarot-data.js"

# Helper to parse python dicts from text files (since we can't easily import relative paths in this env without setup)
def parse_python_dict_from_file(path, var_name):
    with open(path, 'r') as f:
        content = f.read()
    
    # Extract the dictionary string
    # We assume it starts with var_name = { and ends with }
    # This is a bit hacky but works for the known structure
    # Actually, using exec() is cleaner for this specific one-off script
    local_scope = {}
    try:
        exec(content, {}, local_scope)
        return local_scope.get(var_name, {})
    except Exception as e:
        print(f"Error parsing {path}: {e}")
        return {}

def split_into_variants(text):
    if not isinstance(text, str):
        return ["Sin datos."]
    
    # Split by periods, but respect "..." or abbreviations?
    # Simple split by ". "
    parts = [p.strip() for p in text.split('. ') if p.strip()]
    
    # Clean trailing dots
    clean_parts = []
    for p in parts:
        if p.endswith('.'):
            p = p[:-1]
        if len(p) > 3: # Ignore tiny fragments
            clean_parts.append(p + ".")
            
    if len(clean_parts) < 3:
        # Add generic Tech-Mage filler if not enough variants
        clean_parts.append("El sistema observa tus movimientos en el éter digital.")
        
    return clean_parts

def generate_js():
    print("🔮 Loading Content...")
    majors_data = parse_python_dict_from_file(MAJORS_PATH, "MAJORS_NEW_DATA")
    minors_wands = parse_python_dict_from_file(MINORS_PATH, "WANDS_CONTENT")
    minors_cups = parse_python_dict_from_file(MINORS_PATH, "CUPS_CONTENT")
    minors_swords = parse_python_dict_from_file(MINORS_PATH, "SWORDS_CONTENT")
    minors_pentacles = parse_python_dict_from_file(MINORS_PATH, "PENTACLES_CONTENT")
    
    all_minors = {**minors_wands, **minors_cups, **minors_swords, **minors_pentacles}
    
    # Parse existing JS for Color Palettes
    with open(EXISTING_JS_PATH, 'r') as f:
        js_content = f.read()
        
    # Extract palettes using regex
    palettes_match = re.search(r'export const colorPalettes = ({[\s\S]*?});', js_content)
    palettes_str = palettes_match.group(1) if palettes_match else "{}"
    
    # Define Full Deck Structure
    # We need to map ID keys specific to the project
    
    deck_objects = []
    
    # Process Majors
    # IDs 0 to 21 -> ar00 to ar21
    names_es = [
        "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador", 
        "El Sumo Sacerdote", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño", 
        "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte", "La Templanza", 
        "El Diablo", "La Torre", "La Estrella", "La Luna", "El Sol", "El Juicio", "El Mundo"
    ]
    
    names_en = [
        "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
        "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
        "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
        "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgment", "The World"
    ]

    for i in range(22):
        card_id = f"ar{i:02d}"
        content = majors_data.get(i, {})
        
        # Structure fields as arrays
        processed_content = {}
        for key in ["arte", "ciencia", "computacion", "social"]:
            processed_content[key] = split_into_variants(content.get(key, ""))
            
        # Add missing fields if any
        if "arquetipo" not in processed_content:
             processed_content["arquetipo"] = [f"Arquetipo de {names_es[i]}"]
        
        deck_objects.append({
            "id": card_id,
            "name": names_es[i],
            "name_en": names_en[i],
            "image_id": card_id,
            "content": processed_content
        })

    # Process Minors
    # The keys in python dict are like "wands_ace"
    suite_map = {"wands": "Bastos", "cups": "Copas", "swords": "Espadas", "pentacles": "Oros"}
    
    for key, content in all_minors.items():
        # Determine name
        parts = key.split('_')
        suit = parts[0].capitalize() # Wands
        val = parts[1] # ace, 02, king
        
        if val == "ace": name_val = "As"
        elif val == "page": name_val = "Sota"
        elif val == "knight": name_val = "Caballo"
        elif val == "queen": name_val = "Reina"
        elif val == "king": name_val = "Rey"
        else: name_val = val
        
        name_es = f"{name_val} de {suite_map.get(parts[0], suit)}"
        
        processed_content = {}
        for field in ["arquetipo", "sombra", "misticismo", "arte", "ciencia", "computacion", "social"]:
            processed_content[field] = split_into_variants(content.get(field, ""))
            
        deck_objects.append({
            "id": key,
            "name": name_es,
            "image_id": key,
            "content": processed_content
        })
        
    # Write output
    output_js = f"""/* =====================================================
   FULL 78-CARD TAROT DECK DATA (GENERATED)
   Tech-Mage Edition - Multi-variant Content
===================================================== */

export const colorPalettes = {palettes_str};

export const FULL_DECK = {json.dumps(deck_objects, indent=2, ensure_ascii=False)};
"""

    with open(EXISTING_JS_PATH, 'w') as f:
        f.write(output_js)

    print(f"✅ Generated tarot-data.js with {len(deck_objects)} cards.")

if __name__ == "__main__":
    generate_js()
