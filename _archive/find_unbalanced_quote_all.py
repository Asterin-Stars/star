import re

with open('full_script.js', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    line_num = i + 1
    quotes = line.count("'")
    if quotes % 2 != 0:
        print(f"Line {line_num}: {quotes} quotes: {line.strip()}")
