import re

with open('full_script.js', 'r') as f:
    lines = f.readlines()

in_block_comment = False
for i, line in enumerate(lines):
    line_num = i + 1
    stripped = line.strip()
    
    if '/*' in stripped and '*/' not in stripped:
        in_block_comment = True
    if '*/' in stripped:
        in_block_comment = False
        continue
    if in_block_comment:
        continue
        
    content = stripped.split('//')[0]
    
    # Use simple count for now, assume no escaped quotes for quick check
    quotes = content.count("'")
    
    if quotes % 2 != 0:
        print(f"Line {line_num}: {content.strip()}")
