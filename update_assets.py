import os
import json
from PIL import Image

SOURCE_DIR = "/home/star/Descargas/tarot_downloads/processed"
DEST_DIR = "/home/star/star/public/cards"

# Ensure dest dir exists
os.makedirs(DEST_DIR, exist_ok=True)

new_palettes = {}

# Filter for folders starting with a number (Major Arcana usually 00-21 in this set)
# We assume the folder format is "00_The_Fool", etc.

sorted_folders = sorted(os.listdir(SOURCE_DIR))

for folder_name in sorted_folders:
    folder_path = os.path.join(SOURCE_DIR, folder_name)
    if not os.path.isdir(folder_path):
        continue

    # Parse ID from folder name (e.g. "00_The_Fool" -> 0)
    parts = folder_name.split('_')
    if not parts[0].isdigit():
        continue # Skip "Cups_...", "Swords_..." etc.
    
    try:
        num = int(parts[0])
        if num > 21: # Solo Arcanos Mayores 0-21
             continue
             
        card_id = f"ar{num:02d}"
        
        # 1. Process Image
        src_img_path = os.path.join(folder_path, "original.png")
        if not os.path.exists(src_img_path):
            print(f"Warning: No original.png for {folder_name}")
            continue
            
        dest_img_path = os.path.join(DEST_DIR, f"{card_id}.jpg")
        
        try:
            with Image.open(src_img_path) as img:
                rgb_im = img.convert('RGB')
                rgb_im.save(dest_img_path, quality=95)
                print(f"Updated image: {dest_img_path}")
        except Exception as e:
            print(f"Error converting image {folder_name}: {e}")
            continue

        # 2. Process Palette
        data_json_path = os.path.join(folder_path, "data.json")
        if os.path.exists(data_json_path):
            with open(data_json_path, 'r') as f:
                data = json.load(f)
                if 'hex_palette' in data:
                    # Take up to 4 colors
                    palette = data['hex_palette'][:4]
                    new_palettes[card_id] = palette
                    
    except ValueError:
        continue 

print("\nJSON_START")
print(json.dumps(new_palettes, indent=4))
print("JSON_END")
