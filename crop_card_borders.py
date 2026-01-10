#!/usr/bin/env python3
"""
Remove white borders from tarot card images
"""
from PIL import Image, ImageChops
import os
import glob

def trim_whitespace(image_path, output_path):
    """Remove white borders from image"""
    img = Image.open(image_path)
    
    # Convert to RGB if necessary
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Create a white background
    bg = Image.new('RGB', img.size, (255, 255, 255))
    
    # Calculate difference
    diff = ImageChops.difference(img, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    
    # Get bounding box
    bbox = diff.getbbox()
    
    if bbox:
        # Crop to content
        cropped = img.crop(bbox)
        cropped.save(output_path, 'PNG', quality=95)
        return True
    else:
        # No border found, save as is
        img.save(output_path, 'PNG', quality=95)
        return False

def process_all_cards():
    """Process all cards in /public/cards/"""
    cards_dir = "/home/star/star/public/cards"
    
    png_files = glob.glob(os.path.join(cards_dir, "*.png"))
    
    print(f"Processing {len(png_files)} card images...")
    
    trimmed_count = 0
    for img_path in png_files:
        filename = os.path.basename(img_path)
        if trim_whitespace(img_path, img_path):
            trimmed_count += 1
            print(f"  ✓ Trimmed: {filename}")
        else:
            print(f"  - No trim needed: {filename}")
    
    print(f"\n✓ Processed {len(png_files)} images ({trimmed_count} trimmed)")

if __name__ == "__main__":
    process_all_cards()
