#!/usr/bin/env python3
"""
Map RWSa-* image names to correct ar/cup/pent/sw/wand format
"""
import os
import shutil

# Mapping RWSa naming to our naming convention
MAPPING = {
    # Major Arcana (Trumps - T)
    "RWSa-T-00.png": "ar00.png",
    "RWSa-T-01.png": "ar01.png",
    "RWSa-T-02.png": "ar02.png",
    "RWSa-T-03.png": "ar03.png",
    "RWSa-T-04.png": "ar04.png",
    "RWSa-T-05.png": "ar05.png",
    "RWSa-T-06.png": "ar06.png",
    "RWSa-T-07.png": "ar07.png",
    "RWSa-T-08.png": "ar08.png",
    "RWSa-T-09.png": "ar09.png",
    "RWSa-T-10.png": "ar10.png",
    "RWSa-T-11.png": "ar11.png",
    "RWSa-T-12.png": "ar12.png",
    "RWSa-T-13.png": "ar13.png",
    "RWSa-T-14.png": "ar14.png",
    "RWSa-T-15.png": "ar15.png",
    "RWSa-T-16.png": "ar16.png",
    "RWSa-T-17.png": "ar17.png",
    "RWSa-T-18.png": "ar18.png",
    "RWSa-T-19.png": "ar19.png",
    "RWSa-T-20.png": "ar20.png",
    "RWSa-T-21.png": "ar21.png",
    
    # Cups (C)
    "RWSa-C-0A.png": "cup01.png",  # Ace
    "RWSa-C-02.png": "cup02.png",
    "RWSa-C-03.png": "cup03.png",
    "RWSa-C-04.png": "cup04.png",
    "RWSa-C-05.png": "cup05.png",
    "RWSa-C-06.png": "cup06.png",
    "RWSa-C-07.png": "cup07.png",
    "RWSa-C-08.png": "cup08.png",
    "RWSa-C-09.png": "cup09.png",
    "RWSa-C-10.png": "cup10.png",
    "RWSa-C-J1.png": "cup11.png",  # Page
    "RWSa-C-J2.png": "cup12.png",  # Knight
    "RWSa-C-QU.png": "cup13.png",  # Queen
    "RWSa-C-KI.png": "cup14.png",  # King
    
    # Pentacles (P)
    "RWSa-P-0A.png": "pent01.png",
    "RWSa-P-02.png": "pent02.png",
    "RWSa-P-03.png": "pent03.png",
    "RWSa-P-04.png": "pent04.png",
    "RWSa-P-05.png": "pent05.png",
    "RWSa-P-06.png": "pent06.png",
    "RWSa-P-07.png": "pent07.png",
    "RWSa-P-08.png": "pent08.png",
    "RWSa-P-09.png": "pent09.png",
    "RWSa-P-10.png": "pent10.png",
    "RWSa-P-J1.png": "pent11.png",
    "RWSa-P-J2.png": "pent12.png",
    "RWSa-P-QU.png": "pent13.png",
    "RWSa-P-KI.png": "pent14.png",
    
    # Swords (S)
    "RWSa-S-0A.png": "sw01.png",
    "RWSa-S-02.png": "sw02.png",
    "RWSa-S-03.png": "sw03.png",
    "RWSa-S-04.png": "sw04.png",
    "RWSa-S-05.png": "sw05.png",
    "RWSa-S-06.png": "sw06.png",
    "RWSa-S-07.png": "sw07.png",
    "RWSa-S-08.png": "sw08.png",
    "RWSa-S-09.png": "sw09.png",
    "RWSa-S-10.png": "sw10.png",
    "RWSa-S-J1.png": "sw11.png",
    "RWSa-S-J2.png": "sw12.png",
    "RWSa-S-QU.png": "sw13.png",
    "RWSa-S-KI.png": "sw14.png",
    
    # Wands (W)
    "RWSa-W-0A.png": "wand01.png",
    "RWSa-W-02.png": "wand02.png",
    "RWSa-W-03.png": "wand03.png",
    "RWSa-W-04.png": "wand04.png",
    "RWSa-W-05.png": "wand05.png",
    "RWSa-W-06.png": "wand06.png",
    "RWSa-W-07.png": "wand07.png",
    "RWSa-W-08.png": "wand08.png",
    "RWSa-W-09.png": "wand09.png",
    "RWSa-W-10.png": "wand10.png",
    "RWSa-W-J1.png": "wand11.png",
    "RWSa-W-J2.png": "wand12.png",
    "RWSa-W-QU.png": "wand13.png",
    "RWSa-W-KI.png": "wand14.png",
}

def rename_images():
    source_dir = "/home/star/Descargas/tarot_downloads/sin_borde"
    target_dir = "/home/star/star/public/cards"
    
    for old_name, new_name in MAPPING.items():
        old_path = os.path.join(source_dir, old_name)
        new_path = os.path.join(target_dir, new_name)
        
        if os.path.exists(old_path):
            shutil.copy2(old_path, new_path)
            print(f"✓ {old_name} -> {new_name}")
        else:
            print(f"✗ Missing: {old_name}")

if __name__ == "__main__":
    rename_images()
    print("\n✓ Card images mapped successfully!")
