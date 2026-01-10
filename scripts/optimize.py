import os
import glob
from PIL import Image
from pathlib import Path

# Paths
BASE_DIR = Path("/home/star/star/public/cards_layered")
LEGACY_DIR = Path("/home/star/star/public/cards")

def convert_to_webp(directory):
    print(f"Scanning {directory}...")
    files = list(directory.rglob("*.png")) + list(directory.rglob("*.jpg"))
    print(f"Found {len(files)} images.")

    for file_path in files:
        target_path = file_path.with_suffix(".webp")
        if target_path.exists():
            print(f"Skipping {file_path.name} (WebP exists)")
            continue

        try:
            with Image.open(file_path) as img:
                img.save(target_path, "WEBP", quality=80)
                print(f"Converted: {file_path.name}")
            
            # Remove original to save space immediately
            os.remove(file_path)
        except Exception as e:
            print(f"Error converting {file_path.name}: {e}")

def main():
    if not BASE_DIR.exists():
        print(f"Directory not found: {BASE_DIR}")
        return

    # Convert Layered Cards
    convert_to_webp(BASE_DIR)

    # Legacy Cleanup
    if LEGACY_DIR.exists():
        print(f"Removing legacy directory: {LEGACY_DIR}")
        # Using system command for speed on large dir
        os.system(f"rm -rf {LEGACY_DIR}")
    else:
        print("Legacy directory already gone.")

    print("Optimization Complete.")

if __name__ == "__main__":
    main()
