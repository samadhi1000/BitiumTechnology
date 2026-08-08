import json
import os
import shutil
import re

out_dir = r'c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\public\images\blogs'

with open(r'c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\scratch\blogs_extracted.json', 'r', encoding='utf-8') as f:
    blogs_data = json.load(f)

# Read lib/blogs.ts
with open(r'c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\lib\blogs.ts', 'r', encoding='utf-8') as f:
    content = f.read()

for b in blogs_data:
    slug = b['slug']
    alt = b['alt']
    
    # Generate alt tag slug for the image filename
    alt_slug = re.sub(r'[^a-zA-Z0-9]+', '-', alt.lower()).strip('-')
    
    # Find existing image file
    src_jpg = os.path.join(out_dir, f'{slug}.jpeg')
    src_png = os.path.join(out_dir, f'{slug}.png')
    
    dest_jpg = os.path.join(out_dir, f'{alt_slug}.jpeg')
    dest_png = os.path.join(out_dir, f'{alt_slug}.png')
    
    ext = 'jpeg'
    if os.path.exists(src_png):
        shutil.copyfile(src_png, dest_png)
        ext = 'png'
        new_img_path = f'/images/blogs/{alt_slug}.png'
    elif os.path.exists(src_jpg):
        shutil.copyfile(src_jpg, dest_jpg)
        new_img_path = f'/images/blogs/{alt_slug}.jpeg'
    else:
        # Check if alt_slug image already exists
        if os.path.exists(dest_png):
            new_img_path = f'/images/blogs/{alt_slug}.png'
        else:
            new_img_path = f'/images/blogs/{alt_slug}.jpeg'
            
    print(f"Mapped blog: {slug} -> Alt: {alt} -> New Image: {new_img_path}")
    
    # Also replace in lib/blogs.ts
    # Replace old image paths
    content = content.replace(f'"coverImage": "/images/blogs/{slug}.jpeg"', f'"coverImage": "{new_img_path}"')
    content = content.replace(f'"coverImage": "/images/blogs/{slug}.png"', f'"coverImage": "{new_img_path}"')
    
    # Make sure coverAlt is exact
    content = content.replace(f'"coverAlt": "An illustration depicting custom vs letter stencils"', f'"coverAlt": "An illustration depicting custom vs letter stencils"')

with open(r'c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\lib\blogs.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("lib/blogs.ts updated successfully with Alt Tag image filenames!")
