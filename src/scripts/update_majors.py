
import json
import os
from data.majors_content import MAJORS_NEW_DATA

DATA_DIR = "/home/star/star/public/data"
FILES = ["0-5.json", "6-10.json", "11-15.json", "16-21.json"]

def update_majors():
    print("🔮 Updating Major Arcana Data...")
    
    for filename in FILES:
        path = os.path.join(DATA_DIR, filename)
        if not os.path.exists(path):
            print(f"⚠️ File not found: {path}")
            continue
            
        with open(path, 'r') as f:
            data = json.load(f)
            
        updated = False
        for card in data:
            card_id = card.get('id')
            if card_id is not None and card_id in MAJORS_NEW_DATA:
                new_fields = MAJORS_NEW_DATA[card_id]
                # Merge into 'contenido'
                if 'contenido' not in card:
                    card['contenido'] = {}
                
                card['contenido'].update(new_fields)
                updated = True
                print(f"✨ Updated Arcana {card_id} ({card.get('key')})")
        
        if updated:
            with open(path, 'w') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"✅ Saved {filename}")

if __name__ == "__main__":
    update_majors()
