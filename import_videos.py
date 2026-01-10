import os
import shutil

source_dir = "/home/star/Descargas/tarot_downloads/animadas"
target_dir = "/home/star/star/public/cards/animadas"
os.makedirs(target_dir, exist_ok=True)

# Mapping from destination name (arXX) to source filename part
# I will use the base filenames found in the list.
mapping = {
    "ar00": "loco.mp4",
    "ar01": "mago.mp4",
    "ar02": "papisa.mp4",
    "ar03": "empe.mp4", 
    "ar04": "4emp.mp4",
    "ar05": "sacer.mp4",
    "ar06": "enamorados.mp4",
    "ar07": "carro_missing", # Placeholder
    "ar08": "fuerza.mp4",
    "ar09": "ermi.mp4",
    "ar10": "rueda_missing", # Placeholder
    "ar11": "justi.mp4",
    "ar12": "colg.mp4",
    "ar13": "muer.mp4",
    "ar14": "temp.mp4",
    "ar15": "diablo.mp4",
    "ar16": "torre.mp4",
    "ar17": "star.mp4",
    "ar18": "luna.mp4",
    "ar19": "sun.mp4",
    "ar20": "juicio.mp4",
    "ar21": "mundo.mp4"
}

print(f"Starting video import to {target_dir}...")

for card_id, src_name in mapping.items():
    if "missing" in src_name:
        print(f"⚠️ Skipped {card_id}: Source file not identified.")
        continue
        
    src_path = os.path.join(source_dir, src_name)
    dst_path = os.path.join(target_dir, f"{card_id}.mp4")
    
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f"✅ Imported {src_name} -> {card_id}.mp4")
    else:
        # Try alternatives if base missing (e.g. sun vs sol)
        print(f"❌ Failed to find {src_name} for {card_id}")

print("Import complete.")
