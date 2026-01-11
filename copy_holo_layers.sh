#!/bin/bash
# Copy holographic layers from processed to public

SRC_BASE="/home/star/Descargas/tarot_downloads/processed"
DEST_BASE="/home/star/star/public/cards/holo_layers"

# Process only Major Arcana (00-21)
for i in $(seq -f "%02g" 0 21); do
    # Find the matching folder (format: 00_The_Fool, 01_The_Magician, etc.)
    FOLDER=$(ls "$SRC_BASE" | grep "^${i}_")
    
    if [ -n "$FOLDER" ]; then
        echo "Processing $FOLDER..."
        mkdir -p "$DEST_BASE/ar${i}"
        
        # Copy the 5 holographic layers
        cp "$SRC_BASE/$FOLDER/layer_gold.png" "$DEST_BASE/ar${i}/gold.png" 2>/dev/null || echo "  Warning: gold layer not found"
        cp "$SRC_BASE/$FOLDER/layer_ink.png" "$DEST_BASE/ar${i}/ink.png" 2>/dev/null || echo "  Warning: ink layer not found"
        cp "$SRC_BASE/$FOLDER/layer_nature.png" "$DEST_BASE/ar${i}/nature.png" 2>/dev/null || echo "  Warning: nature layer not found"
        cp "$SRC_BASE/$FOLDER/layer_passion.png" "$DEST_BASE/ar${i}/passion.png" 2>/dev/null || echo "  Warning: passion layer not found"
        cp "$SRC_BASE/$FOLDER/layer_spirit.png" "$DEST_BASE/ar${i}/spirit.png" 2>/dev/null || echo "  Warning: spirit layer not found"
    else
        echo "Warning: Folder for card $i not found"
    fi
done

echo "✅ Holographic layers copied successfully"
