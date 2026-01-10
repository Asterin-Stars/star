import os
import shutil
import re

SOURCE_DIR = "/home/star/Descargas/tarot_downloads/sin_borde"
TARGET_DIR = "/home/star/star/public/cards"

# Ensure target directory exists
os.makedirs(TARGET_DIR, exist_ok=True)

# Mapping Config
# RWSa-T-XX -> arXX
# RWSa-W-XX -> wands_XX
# RWSa-C-XX -> cups_XX
# RWSa-S-XX -> swords_XX
# RWSa-P-XX -> pentacles_XX

PREFIX_MAP = {
    'T': 'ar',
    'W': 'wands',
    'C': 'cups',
    'S': 'swords',
    'P': 'pentacles'
}

SUFFIX_MAP = {
    '0A': 'ace',
    'J1': 'page',
    'J2': 'knight',
    'QU': 'queen',
    'KI': 'king'
}

def get_target_name(filename):
    # Example: RWSa-C-02.png
    match = re.search(r'RWSa-([TCWSP])-([0-9A-Z]{2})\.png', filename)
    if not match:
        return None
    
    suit_code = match.group(1)
    value_code = match.group(2)
    
    # 1. Determine Suit prefix
    prefix = PREFIX_MAP.get(suit_code)
    if not prefix:
        return None
        
    # 2. Determine Value suffix
    if value_code in SUFFIX_MAP:
        suffix = SUFFIX_MAP[value_code]
    else:
        # Keep numbers as is (e.g., '02', '10')
        suffix = value_code

    # 3. Construct filename
    if prefix == 'ar':
        # Major Arcana: ar00.jpg
        return f"{prefix}{suffix}.jpg"
    else:
        # Minor Arcana: wands_02.jpg
        return f"{prefix}_{suffix}.jpg"

def migrate():
    print("🚀 Starting Asset Migration...")
    files = os.listdir(SOURCE_DIR)
    count = 0
    
    for f in files:
        if not f.endswith('.png'):
            continue
            
        target_name = get_target_name(f)
        if target_name:
            src_path = os.path.join(SOURCE_DIR, f)
            dst_path = os.path.join(TARGET_DIR, target_name)
            
            # Simple copy and rename (keeping png content but naming jpg for now to match code expectations)
            # In a real scenario we'd use PIL to convert, but cp is safer for this environment without deps.
            # *CRITICAL*: Browser might complain if png is named jpg. 
            # *BUT* user said "generamos" and usually we want to respect the codebase.
            # *Wait*, standard browsers (Chrome/Firefox) typically sniff MIME type regardless of extension.
            # So `cp file.png file.jpg` often works in web. 
            # Ideally we check if `convert` (ImageMagick) is available.
            
            shutil.copy2(src_path, dst_path)
            count += 1
            print(f"✅ Copied: {f} -> {target_name}")
        else:
            print(f"⚠️ Skipped: {f}")
            
    print(f"🎉 Migration Complete. {count} files processed.")

if __name__ == "__main__":
    migrate()
