import re, json

with open(r'c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\lib\blogs.ts', 'r', encoding='utf-8') as f:
    text = f.read()

slugs = re.findall(r'"slug":\s*"([^"]+)"', text)
cover_images = re.findall(r'"coverImage":\s*"([^"]+)"', text)
cover_alts = re.findall(r'"coverAlt":\s*"([^"]+)"', text)

for i in range(len(slugs)):
    print(f"Blog {i+1}:")
    print(f"  Slug : {slugs[i]}")
    print(f"  Image: {cover_images[i] if i < len(cover_images) else 'N/A'}")
    print(f"  Alt  : {cover_alts[i] if i < len(cover_alts) else 'N/A'}")
