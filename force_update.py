
import os
import shutil

# Mapping from directory name to card ID (arXX)
MAPPING = {
    "00_The_Fool": "ar00",
    "01_The_Magician": "ar01",
    "02_The_High_Priestess": "ar02",
    "03_The_Empress": "ar03",
    "04_The_Emperor": "ar04",
    "05_The_Hierophant": "ar05",
    "06_The_Lovers": "ar06",
    "07_The_Chariot": "ar07",
    "08_Strength": "ar08",
    "09_The_Hermit": "ar09",
    "10_Wheel_of_Fortune": "ar10",
    "11_Justice": "ar11",
    "12_The_Hanged_Man": "ar12",
    "13_Death": "ar13",
    "14_Temperance": "ar14",
    "15_The_Devil": "ar15",
    "16_The_Tower": "ar16",
    "17_The_Star": "ar17",
    "18_The_Moon": "ar18",
    "19_The_Sun": "ar19",
    "20_Judgement": "ar20",
    "21_The_World": "ar21"
}

SOURCE_BASE = "/home/star/Descargas/tarot_downloads/processed"
DEST_CARDS = "/home/star/star/public/cards"
DEST_LAYERS = "/home/star/star/public/cards/holo_layers"

def main():
    print("Starting Asset Force Update...")
    
    for folder_name, card_id in MAPPING.items():
        src_dir = os.path.join(SOURCE_BASE, folder_name)
        if not os.path.exists(src_dir):
            print(f"Skipping {folder_name} (Not found in source)")
            continue
            
        # 1. Copy Main Image
        src_img = os.path.join(src_dir, "original.png")
        dest_img = os.path.join(DEST_CARDS, f"{card_id}.png")
        
        if os.path.exists(src_img):
            shutil.copy2(src_img, dest_img)
            print(f"Copied {src_img} -> {dest_img}")
        else:
            print(f"WARNING: Main image missing for {folder_name}")

        # 2. Copy Layers
        # Source: layer_gold.png -> Dest: arXX/gold.png
        layers = ["gold", "ink", "nature", "passion", "spirit"]
        dest_layer_dir = os.path.join(DEST_LAYERS, card_id)
        
        if not os.path.exists(dest_layer_dir):
            os.makedirs(dest_layer_dir)
            
        for layer in layers:
            src_layer = os.path.join(src_dir, f"layer_{layer}.png")
            dest_layer = os.path.join(dest_layer_dir, f"{layer}.png")
            
            if os.path.exists(src_layer):
                shutil.copy2(src_layer, dest_layer)
                print(f"Copied Layer {src_layer} -> {dest_layer}")
            else:
                print(f"WARNING: Layer {layer} missing for {folder_name}")

    print("Asset Update Complete.")

if __name__ == "__main__":
    main()
