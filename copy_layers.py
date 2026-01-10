import os
import shutil

SOURCE_DIR = "/home/star/Descargas/tarot_downloads/processed"
DEST_BASE = "/home/star/star/public/cards/layers"

os.makedirs(DEST_BASE, exist_ok=True)

# Map logic: "00_The_Fool" -> "ar00"
for folder_name in sorted(os.listdir(SOURCE_DIR)):
    src_folder = os.path.join(SOURCE_DIR, folder_name)
    if not os.path.isdir(src_folder):
        continue

    parts = folder_name.split('_')
    if not parts[0].isdigit():
        continue
    
    try:
        num = int(parts[0])
        if num > 21: continue # Only Major Arcana for now
        
        card_id = f"ar{num:02d}"
        dest_folder = os.path.join(DEST_BASE, card_id)
        os.makedirs(dest_folder, exist_ok=True)
        
        # Layers to copy
        layers = ['layer_ink.png', 'layer_gold.png', 'layer_nature.png', 'layer_passion.png', 'layer_spirit.png', 'original.png']
        
        for layer in layers:
            src_file = os.path.join(src_folder, layer)
            if os.path.exists(src_file):
                shutil.copy2(src_file, os.path.join(dest_folder, layer))
                
        print(f"Copied layers for {card_id}")
        
    except ValueError:
        continue
