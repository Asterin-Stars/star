#!/bin/bash

SOURCE_DIR="/home/star/Descargas/tarot_downloads/processed"
DEST_DIR="/home/star/star/public/cards_layered"

mkdir -p "$DEST_DIR"

# Función para copiar capas
copy_layers() {
    local src_folder="$1"
    local dest_code="$2"
    
    local target_dir="$DEST_DIR/$dest_code"
    mkdir -p "$target_dir"
    
    # Copiar capas si existen
    if [ -d "$SOURCE_DIR/$src_folder" ]; then
        echo "Procesando $src_folder -> $dest_code"
        cp "$SOURCE_DIR/$src_folder/layer_gold.png" "$target_dir/gold.png" 2>/dev/null
        cp "$SOURCE_DIR/$src_folder/layer_ink.png" "$target_dir/ink.png" 2>/dev/null
        cp "$SOURCE_DIR/$src_folder/layer_nature.png" "$target_dir/nature.png" 2>/dev/null
        cp "$SOURCE_DIR/$src_folder/layer_passion.png" "$target_dir/passion.png" 2>/dev/null
        cp "$SOURCE_DIR/$src_folder/layer_spirit.png" "$target_dir/spirit.png" 2>/dev/null
        cp "$SOURCE_DIR/$src_folder/original.png" "$target_dir/base.png" 2>/dev/null
    else
        echo "Advertencia: No se encontró $src_folder"
    fi
}

# Arcanos Mayores
copy_layers "00_The_Fool" "ar00"
copy_layers "01_The_Magician" "ar01"
copy_layers "02_The_High_Priestess" "ar02"
copy_layers "03_The_Empress" "ar03"
copy_layers "04_The_Emperor" "ar04"
copy_layers "05_The_Hierophant" "ar05"
copy_layers "06_The_Lovers" "ar06"
copy_layers "07_The_Chariot" "ar07"
copy_layers "08_Strength" "ar08"
copy_layers "09_The_Hermit" "ar09"
copy_layers "10_Wheel_of_Fortune" "ar10"
copy_layers "11_Justice" "ar11"
copy_layers "12_The_Hanged_Man" "ar12"
copy_layers "13_Death" "ar13"
copy_layers "14_Temperance" "ar14"
copy_layers "15_The_Devil" "ar15"
copy_layers "16_The_Tower" "ar16"
copy_layers "17_The_Star" "ar17"
copy_layers "18_The_Moon" "ar18"
copy_layers "19_The_Sun" "ar19"
copy_layers "20_Judgement" "ar20"
copy_layers "21_The_World" "ar21"

# Bastos (Wands)
copy_layers "Wands_01_Ace" "waac"
copy_layers "Wands_02" "wa02"
copy_layers "Wands_03" "wa03"
copy_layers "Wands_04" "wa04"
copy_layers "Wands_05" "wa05"
copy_layers "Wands_06" "wa06"
copy_layers "Wands_07" "wa07"
copy_layers "Wands_08" "wa08"
copy_layers "Wands_09" "wa09"
copy_layers "Wands_10" "wa10"
copy_layers "Wands_king" "waki" # Ojo con mayúsculas/minúsculas, verifica nombres exactos
copy_layers "Wands_King" "waki"
copy_layers "Wands_Queen" "waqu"
copy_layers "Wands_Knight" "wakn"
copy_layers "Wands_Page" "wapa"
# Espadas (Swords)
copy_layers "Swords_01_Ace" "swac"
copy_layers "Swords_02" "sw02"
copy_layers "Swords_03" "sw03"
copy_layers "Swords_04" "sw04"
copy_layers "Swords_05" "sw05"
copy_layers "Swords_06" "sw06"
copy_layers "Swords_07" "sw07"
copy_layers "Swords_08" "sw08"
copy_layers "Swords_09" "sw09"
copy_layers "Swords_10" "sw10"
copy_layers "Swords_King" "swki"
copy_layers "Swords_Queen" "swqu"
copy_layers "Swords_Knight" "swkn"
copy_layers "Swords_Page" "swpa"
# Copas (Cups)
copy_layers "Cups_01_Ace" "cuac"
copy_layers "Cups_02" "cu02"
copy_layers "Cups_03" "cu03"
copy_layers "Cups_04" "cu04"
copy_layers "Cups_05" "cu05"
copy_layers "Cups_06" "cu06"
copy_layers "Cups_07" "cu07"
copy_layers "Cups_08" "cu08"
copy_layers "Cups_09" "cu09"
copy_layers "Cups_10" "cu10"
copy_layers "Cups_King" "cuki"
copy_layers "Cups_Queen" "cuqu"
copy_layers "Cups_Knight" "cukn"
copy_layers "Cups_Page" "cupa"
# Pentaculos (Pentacles)
copy_layers "Pentacles_01_Ace" "peac"
copy_layers "Pentacles_02" "pe02"
copy_layers "Pentacles_03" "pe03"
copy_layers "Pentacles_04" "pe04"
copy_layers "Pentacles_05" "pe05"
copy_layers "Pentacles_06" "pe06"
copy_layers "Pentacles_07" "pe07"
copy_layers "Pentacles_08" "pe08"
copy_layers "Pentacles_09" "pe09"
copy_layers "Pentacles_10" "pe10"
copy_layers "Pentacles_King" "peki"
copy_layers "Pentacles_Queen" "pequ"
copy_layers "Pentacles_Knight" "pekn"
copy_layers "Pentacles_Page" "pepa"

echo "✅ Importación de capas completada."
