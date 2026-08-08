import fitz
import glob
import os
import json

out_dir = r'c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\public\images\blogs'
os.makedirs(out_dir, exist_ok=True)

blog_pdfs = sorted(glob.glob(r'C:\Users\Thusitha\Downloads\blogs*.pdf'))
print('Found blog PDFs in Downloads:', len(blog_pdfs))

results = []

for b_idx, p in enumerate(blog_pdfs):
    doc = fitz.open(p)
    text = ''
    for page in doc:
        text += page.get_text('text') + '\n'
    
    meta = {
        'file': os.path.basename(p),
        'full_path': p,
        'pages': len(doc),
        'raw_text': text
    }
    for line in text.split('\n'):
        sline = line.strip()
        if sline.startswith('Title -') and 'title' not in meta:
            meta['title'] = sline.replace('Title -', '').strip()
        elif sline.startswith('Meta title -') and 'meta_title' not in meta:
            meta['meta_title'] = sline.replace('Meta title -', '').strip()
        elif sline.startswith('Meta description -') and 'meta_desc' not in meta:
            meta['meta_desc'] = sline.replace('Meta description -', '').strip()
        elif sline.startswith('URL slug -') and 'slug' not in meta:
            meta['slug'] = sline.replace('URL slug -', '').strip()
        elif sline.startswith('Alt tag -') and 'alt' not in meta:
            meta['alt'] = sline.replace('Alt tag -', '').strip()

    slug = meta.get('slug', f'blog-{b_idx}')
    
    # Extract image
    img_found = False
    for page_num in range(len(doc)):
        image_list = doc[page_num].get_images(full=True)
        for img in image_list:
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image['image']
            image_ext = base_image['ext']
            img_filename = f"{slug}.{image_ext}"
            img_dest = os.path.join(out_dir, img_filename)
            with open(img_dest, 'wb') as f:
                f.write(image_bytes)
            meta['image'] = f"/images/blogs/{img_filename}"
            print(f"[{b_idx+1}] File: {os.path.basename(p)} | Title: {meta.get('title')} | Slug: {slug} | Saved: {img_filename}")
            img_found = True
            break
        if img_found:
            break
            
    results.append(meta)

with open(r'c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\scratch\blogs_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print('Done dumping extracted JSON!')
