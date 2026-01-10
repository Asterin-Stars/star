
# Script to generate palette data for Minors based on their Suit Element colors
# This is a heuristic generation to solve the missing palette issue.

suits_colors = {
    'wands': ["#e37329", "#b33939", "#ffcc00", "#5c2a2a"], # Fire: Orange, Red, Gold, Dark Red
    'cups': ["#2e86de", "#54a0ff", "#00d2d3", "#222f3e"], # Water: Blue, Light Blue, Cyan, Dark Blue
    'swords': ["#c8d6e5", "#8395a7", "#576574", "#222f3e"], # Air: Grey, Blue-Grey, Dark Grey, Navy
    'pentacles': ["#10ac84", "#2ecc71", "#feca57", "#2c3e50"] # Earth: Green, Light Green, Gold, Dark
}

# Order: ace, 02..10, page, knight, queen, king
order = ['ace', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'page', 'knight', 'queen', 'king']

print("export const MINOR_PALETTES = {")

for suit, palette in suits_colors.items():
    for key in order:
        card_id = f"{suit}_{key}"
        # Variation: slightly shift colors? No, consistency is fine for now.
        print(f'  "{card_id}": {json.dumps(palette)},')

print("};")
