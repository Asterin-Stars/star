import os
import shutil

SOURCE_DIR = "/home/star/Descargas/tarot_downloads/processed"
DEST_CARDS = "/home/star/star/public/cards"
DEST_HOLO = "/home/star/star/public/cards/holo_layers"

if not os.path.exists(DEST_CARDS):
    os.makedirs(DEST_CARDS)
if not os.path.exists(DEST_HOLO):
    os.makedirs(DEST_HOLO)

print(f"Scanning {SOURCE_DIR}...")

count = 0
for d in sorted(os.listdir(SOURCE_DIR)):
    # Check if folder starts with digits 00-21
    if len(d) >= 2 and d[0:2].isdigit():
        num_val = int(d[0:2])
        if num_val > 21:
            continue # Skip minor arcana for now if not mapped

        dest_code = f"ar{d[0:2]}"
        src_path = os.path.join(SOURCE_DIR, d)
        
        print(f"Processing {d} -> {dest_code}")
        
        # 1. Main Image
        # Copy original.png to arXX.png
        src_img = os.path.join(src_path, "original.png")
        if os.path.exists(src_img):
            dest_img = os.path.join(DEST_CARDS, f"{dest_code}.png")
            shutil.copy2(src_img, dest_img)
        else:
            print(f"Warning: original.png not found in {d}")

        # 2. Holo Layers
        # Create dest folder public/cards/holo_layers/arXX
        dest_holo_subdir = os.path.join(DEST_HOLO, dest_code)
        if not os.path.exists(dest_holo_subdir):
            os.makedirs(dest_holo_subdir)
            
        layers = ["nature", "passion", "ink", "gold", "spirit"]
        for l in layers:
            src_layer = os.path.join(src_path, f"layer_{l}.png")
            if os.path.exists(src_layer):
                dest_layer = os.path.join(dest_holo_subdir, f"{l}.png")
                shutil.copy2(src_layer, dest_layer)
        
        count += 1

print(f"Processed {count} Major Arcana folders.")
