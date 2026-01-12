import os
import shutil

source_root = "/home/star/Descargas/tarot_downloads/processed"
dest_dir = "/home/star/star/public/cards"

# Ensure destination exists
os.makedirs(dest_dir, exist_ok=True)

# Map of directory prefixes to ID
# we can just sort the directories that start with a number
subdirs = sorted([d for d in os.listdir(source_root) if os.path.isdir(os.path.join(source_root, d)) and d[0].isdigit()])

print(f"Found {len(subdirs)} directories.")

count = 0
for subdir in subdirs:
    # We only care about the first 22 (Major Arcana) for now, as per the classic app logic which uses 'arXX'
    # The folders are like '00_The_Fool', '01_The_Magician'... '21_The_World'
    # We need to extract the number.
    
    try:
        prefix = subdir.split('_')[0]
        card_id = int(prefix)
        
        # Classic app uses ar00.jpg / ar00.png logic.
        # We only strictly need 0-21 for the current request.
        if 0 <= card_id <= 21:
            src_img = os.path.join(source_root, subdir, "original.png")
            dest_filename = f"ar{card_id:02d}.png"
            dest_path = os.path.join(dest_dir, dest_filename)
            
            if os.path.exists(src_img):
                shutil.copy2(src_img, dest_path)
                print(f"Copied {subdir}/original.png -> {dest_filename}")
                count += 1
            else:
                print(f"Warning: original.png not found in {subdir}")
    except ValueError:
        continue

print(f"Successfully processed {count} Major Arcana cards.")
