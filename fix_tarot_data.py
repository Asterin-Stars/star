#!/usr/bin/env python3
"""
Fix tarot-data.js by properly exporting FULL_DECK with object structures
"""
import json

# Load the complete 22 majors JSON
with open('/home/star/star/src/scripts/data/complete_22_majors.json', 'r', encoding='utf-8') as f:
    majors_data = json.load(f)

# Convert to array format  
full_deck = []
for card_id in sorted(majors_data.keys(), key=lambda x: int(x.replace('ar', ''))):
    card = majors_data[card_id]
    # Wrap content in a "content" property
    full_deck.append({
        "id": card["id"],
        "name": card["name"],
        "content": {
            "arquetipo": card["arquetipo"],
            "pasaje": card["pasaje"]
        }
    })

# Color palettes (basic)
color_palettes = {
    f"ar{i:02d}": ["#e37329", "#b33939", "#ffcc00", "#5c2a2a"]
    for i in range(22)
}

# Write JS file
output = f'''/* =====================================================
   22-CARD TAROT DECK DATA (Multi-Archetype)
   Content: Tech-Mage, Mystic, Psychologist, Everyday, Philosopher
===================================================== */

export const colorPalettes = {json.dumps(color_palettes, indent=2)};

export const FULL_DECK = {json.dumps(full_deck, ensure_ascii=False, indent=2)};
'''

with open('/home/star/star/src/js/tarot-data.js', 'w', encoding='utf-8') as f:
    f.write(output)

print("✓ Fixed tarot-data.js with proper object structure")
print(f"  - {len(full_deck)} cards exported")
print(f"  - Structure: id, name, content{{arquetipo[], pasaje[]}}")
