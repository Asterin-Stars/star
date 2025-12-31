#!/usr/bin/env python3
"""
Venice.ai Card Description Generator
Generates authentic, unfiltered tarot card descriptions for all 78 cards

Usage:
    python generate_cards.py --batch 1  # Generate first 10 cards
    python generate_cards.py --all      # Generate all 78 cards
"""

import requests
import json
import time
import argparse
from pathlib import Path

# Venice.ai Configuration
VENICE_API_KEY = "_AQUO5ddkmdPC4ZIiubJVzL6-Kdn2DSDNvH55NHFGY"
VENICE_BASE_URL = "https://api.venice.ai/api/v1"
VENICE_MODEL = "venice-uncensored"

# Card Structure
MAJOR_ARCANA = [f"ar{i:02d}" for i in range(22)]  # ar00-ar21

MINOR_ARCANA_SUITS = {
    'wands': ['as', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'paje', 'caballero', 'reina', 'rey'],
    'cups': ['as', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'paje', 'caballero', 'reina', 'rey'],
    'swords': ['as', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'paje', 'caballero', 'reina', 'rey'],
    'pentacles': ['as', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'paje', 'caballero', 'reina', 'rey']
}

ELEMENTS = {
    'wands': 'Fuego',
    'cups': 'Agua',
    'swords': 'Aire',
    'pentacles': 'Tierra'
}

# Build full deck
ALL_CARDS = MAJOR_ARCANA.copy()
for suit, ranks in MINOR_ARCANA_SUITS.items():
    for rank in ranks:
        ALL_CARDS.append(f"{suit}_{rank}")

# Total: 78 cards

def call_venice_api(prompt, max_tokens=500):
    """Call Venice.ai API"""
    headers = {
        "Authorization": f"Bearer {VENICE_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": VENICE_MODEL,
        "messages": [
            {"role": "system", "content": "Eres un tarotista experto que habla directo, sin filtros. Mezclas sabiduría esotérica con lenguaje cotidiano chileno."},
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
        print(f"❌ Error: {e}")
        return None

def generate_card_description(card_id):
    """Generate description for a single card"""
    # Determine card type and name
    if card_id.startswith('ar'):
        card_num = int(card_id[2:])
        card_type = "Major Arcana"
        # Map to Spanish names
        major_names = [
            "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
            "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño",
            "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte", "Templanza",
            "El Diablo", "La Torre", "La Estrella", "La Luna", "El Sol",
            "El Juicio", "El Mundo"
        ]
        card_name = major_names[card_num]
        element = "Espíritu"
    else:
        # Minor Arcana
        suit, rank = card_id.split('_')
        card_type = "Minor Arcana"
        element = ELEMENTS[suit]
        
        rank_names = {
            'as': 'As', 'paje': 'Paje', 'caballero': 'Caballero',
            'reina': 'Reina', 'rey': 'Rey'
        }
        rank_name = rank_names.get(rank, rank)
        
        suit_names = {
            'wands': 'Bastos', 'cups': 'Copas',
            'swords': 'Espadas', 'pentacles': 'Oros'
        }
        suit_name = suit_names[suit]
        
        card_name = f"{rank_name} de {suit_name}"
    
    # Generate prompt
    prompt = f"""Describe la carta "{card_name}" ({card_type}, elemento: {element}).

Formato requerido (200-300 palabras):

**Arquetipo**: Una frase que capture la esencia
**Significado Normal**: Qué representa cuando sale derecha (3-4 líneas)
**Significado Invertido**: Qué representa al revés (3-4 líneas)
**Mensaje Práctico**: Consejo directo, sin floro (2-3 líneas)

Habla directo, sin careteo. Usa lenguaje cotidiano pero profundo.
Ejemplo de tono: "Esta carta te está diciendo que pares de darle vueltas y actúes ya..."
"""
    
    print(f"📝 Generando: {card_name} ({card_id})...")
    description = call_venice_api(prompt, max_tokens=600)
    
    if description:
        print(f"✅ Completado: {card_name}")
        return {
            "id": card_id,
            "name": card_name,
            "type": card_type,
            "element": element,
            "description": description
        }
    else:
        print(f"❌ Error en: {card_name}")
        return None

def generate_batch(start_idx=0, count=10):
    """Generate a batch of cards"""
    end_idx = min(start_idx + count, len(ALL_CARDS))
    batch_cards = ALL_CARDS[start_idx:end_idx]
    
    results = []
    for i, card_id in enumerate(batch_cards):
        result = generate_card_description(card_id)
        if result:
            results.append(result)
        
        # Rate limiting (avoid hitting API too fast)
        if i < len(batch_cards) - 1:
            time.sleep(2)  # 2 seconds between requests
    
    return results

def save_results(results, filename="card_descriptions.json"):
    """Save results to JSON file"""
    output_dir = Path("./generated_cards")
    output_dir.mkdir(exist_ok=True)
    
    output_file = output_dir / filename
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Guardado en: {output_file}")
    print(f"📊 Total cartas: {len(results)}")

def main():
    parser = argparse.ArgumentParser(description="Generate tarot card descriptions with Venice.ai")
    parser.add_argument('--batch', type=int, help='Generate batch number (1-8, each batch = 10 cards)')
    parser.add_argument('--all', action='store_true', help='Generate all 78 cards')
    parser.add_argument('--count', type=int, default=10, help='Cards per batch (default: 10)')
    
    args = parser.parse_args()
    
    print("🔮 Venice.ai Card Generator")
    print(f"📦 Total cards in deck: {len(ALL_CARDS)}")
    print(f"💳 Credits available: 996")
    print()
    
    if args.all:
        print("🚀 Generating ALL 78 cards...")
        print("⏱️  Estimated time: ~5 minutes (with rate limiting)")
        print()
        
        all_results = []
        for i in range(0, len(ALL_CARDS), args.count):
            batch_num = (i // args.count) + 1
            print(f"\n--- BATCH {batch_num} ---")
            batch_results = generate_batch(i, args.count)
            all_results.extend(batch_results)
        
        save_results(all_results, "all_cards.json")
        
    elif args.batch:
        batch_num = args.batch
        start_idx = (batch_num - 1) * args.count
        
        if start_idx >= len(ALL_CARDS):
            print(f"❌ Batch {batch_num} fuera de rango")
            return
        
        print(f"🚀 Generating batch {batch_num} (cards {start_idx+1}-{min(start_idx+args.count, len(ALL_CARDS))})")
        print()
        
        results = generate_batch(start_idx, args.count)
        save_results(results, f"batch_{batch_num}.json")
        
    else:
        print("ℹ️  Uso:")
        print("  python generate_cards.py --batch 1     # Primer lote (cartas 1-10)")
        print("  python generate_cards.py --batch 2     # Segundo lote (cartas 11-20)")
        print("  python generate_cards.py --all         # Todas las 78 cartas")

if __name__ == "__main__":
    main()
