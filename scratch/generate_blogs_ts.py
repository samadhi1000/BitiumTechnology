import json
import re

with open(r'c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\scratch\blogs_extracted.json', 'r', encoding='utf-8') as f:
    blogs_data = json.load(f)

print(f"Loaded {len(blogs_data)} blogs from JSON.")

category_map = {
    'custom-stencils-vs-letter-stencils': 'Stencils & Fabric',
    'what-kind-of-laser-cutting-service-do-you-actually-need': 'Laser Cutting',
    'how-to-pick-the-right-wall-stencil-for-your-space': 'Stencils & Fabric',
    'custom-screen-printing-for-small-batches': 'Screen Printing',
    'what-to-actually-look-for-before-you-order-a-dtf-printing-near-me': 'DTF Printing',
    'why-dtf-printing-is-taking-over-custom-apparel': 'DTF Printing',
    'laser-cutting-service-guide': 'Laser Cutting',
    'traditional-tools-for-batik-stamps': 'Batik Craft',
    'beginners-guide-to-batik-stamps': 'Batik Craft',
    'how-to-choose-a-screen-printing-shop-near-me': 'Screen Printing'
}

service_map = {
    'Screen Printing': {
        'title': 'Need Custom Exposed Screens or Screen Printing in Sri Lanka?',
        'description': 'Get high-density positive tracing films, precision screen exposure, and full textile printing done by Bitium experts.',
        'linkText': 'Explore Screen Printing Services',
        'linkUrl': '/screen-printing'
    },
    'Batik Craft': {
        'title': 'Looking for Authentic Traditional Batik Stamps & Vectors?',
        'description': 'Explore our catalog of traditional Sri Lankan Cap Batik stamps, copper stamps, and original vector downloads.',
        'linkText': 'View Batik Stamp Collection',
        'linkUrl': '/batik-stamp'
    },
    'Laser Cutting': {
        'title': 'Precision Acrylic & Wood CNC Laser Cutting',
        'description': 'Send us your DXF/SVG vector file or sketch for precision laser cutting and engraving with 24h dispatch.',
        'linkText': 'Explore Laser Cutting Services',
        'linkUrl': '/laser-cutting'
    },
    'DTF Printing': {
        'title': 'Build Your Custom DTF Gang Sheet Online',
        'description': 'Upload your PNG files to our live 2D/3D Canvas builder, auto-nest your artwork, and get instant pricing.',
        'linkText': 'Launch DTF Canvas Builder',
        'linkUrl': '/canvas'
    },
    'Stencils & Fabric': {
        'title': 'Order Custom Reusable Mylar Stencils for Fabric & Walls',
        'description': 'Choose from hundreds of precision laser-cut stencil codes or order custom designs with fast islandwide delivery.',
        'linkText': 'Open Stencil Order Form',
        'linkUrl': '/order-form'
    }
}

tags_map = {
    'custom-stencils-vs-letter-stencils': ['Custom Stencils', 'Letter Stencils', 'Fabric Painting', 'Laser Cut Stencils', 'Mylar Stencils'],
    'what-kind-of-laser-cutting-service-do-you-actually-need': ['Laser Cutting', 'CO2 Laser', 'Acrylic Cutting', 'Wood Engraving', 'Local Laser Service'],
    'how-to-pick-the-right-wall-stencil-for-your-space': ['Wall Stencils', 'Home Decor', 'Pattern Design', 'Reusable Stencils', 'Interior Accents'],
    'custom-screen-printing-for-small-batches': ['Screen Printing', 'Small Batch', 'Apparel Printing', 'Cost Per Unit', 'Custom Shirts'],
    'what-to-actually-look-for-before-you-order-a-dtf-printing-near-me': ['DTF Printing', 'Direct to Film', 'Gang Sheets', 'Local DTF', 'Apparel Transfers'],
    'why-dtf-printing-is-taking-over-custom-apparel': ['DTF Printing', 'Direct to Film', 'Custom Apparel', 'Gang Sheets', 'T-Shirt Printing'],
    'laser-cutting-service-guide': ['Laser Cutting', 'CO2 Laser', 'Acrylic Cutting', 'CNC Precision', 'Vector DXF'],
    'traditional-tools-for-batik-stamps': ['Batik Art', 'Cap Batik', 'Copper Stamps', 'Heritage Crafts', 'Wax Resist'],
    'beginners-guide-to-batik-stamps': ['Batik Stamps', 'Cap Batik', 'Wooden Stamps', 'Handmade Craft', 'Textile Art'],
    'how-to-choose-a-screen-printing-shop-near-me': ['Screen Printing', 'Local Print Shop', 'Screen Exposure', 'Artwork Vectorization', 'Apparel Printing']
}

def clean_blog_content(raw_text, title, meta_title, meta_desc, slug, alt):
    # Remove metadata lines
    lines = raw_text.split('\n')
    cleaned_lines = []
    skip_header = True
    
    for l in lines:
        s = l.strip()
        if not s:
            continue
        if s.startswith('Title -') or s.startswith('Meta title -') or s.startswith('Meta description -') or s.startswith('URL slug -') or s.startswith('Alt tag -'):
            continue
        # Also skip repeated title at the very beginning
        if s.lower() == title.lower() or s.lower() == meta_title.lower():
            continue
        cleaned_lines.append(s)
        
    full_body = '\n\n'.join(cleaned_lines)
    return full_body

formatted_posts = []

for idx, b in enumerate(blogs_data):
    slug = b['slug']
    title = b['title']
    meta_title = b['meta_title']
    meta_desc = b['meta_desc']
    alt = b.get('alt', title)
    image = b.get('image', f'/images/blogs/{slug}.jpeg')
    raw_text = b['raw_text']
    category = category_map.get(slug, 'DTF Printing')
    tags = tags_map.get(slug, ['Printing', 'Bitium Technology'])
    service = service_map.get(category, service_map['DTF Printing'])
    
    # Parse sections and headings for TOC
    lines = raw_text.split('\n')
    toc = []
    content_lines = []
    
    # Identify headings (short lines without period, bold topics, etc.)
    for l in lines:
        s = l.strip()
        if not s:
            continue
        if s.startswith('Title -') or s.startswith('Meta title -') or s.startswith('Meta description -') or s.startswith('URL slug -') or s.startswith('Alt tag -'):
            continue
        if s.lower() == title.lower() or s.lower() == meta_title.lower():
            continue
            
        # Detect if this line looks like a major heading (e.g. "Wood vs copper: what's the actual difference", "Step one: ...", "What to look for...")
        is_heading = False
        if len(s) < 80 and not s.endswith('.') and not s.startswith('●') and not s.startswith('-') and not s.startswith('*'):
            # Heading heuristics
            if any(s.lower().startswith(prefix) for prefix in ['ask ', 'vectorized', 'color matching', 'turnaround', 'setup costs', 'what ', 'where ', 'bottom line', 'wood vs', 'depth and', 'handle attachment', 'wood type', 'pattern repeat', 'starting with', 'caring for', 'getting started', 'step ', 'common mistakes', 'from idea', 'wrapping up', 'why ', 'no more', 'color that', 'it fits', 'the short', 'letter stencils', 'custom stencils', 'when letter', 'when custom', 'making the choice', 'co2 vs', 'materials and', 'file prep', 'tolerances and', 'questions to', 'choosing a pattern', 'measuring your', 'stencil types', 'application and', 'maintenance and', 'screen printing for', 'the real cost', 'when small', 'quality vs', 'what to ask', 'curing and', 'film quality', 'design prep', 'turnaround and']):
                is_heading = True
        
        if is_heading:
            h_id = re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
            toc.append({'id': h_id, 'title': s})
            content_lines.append(f"### {s} {{#{h_id}}}")
        elif s.startswith('● ') or s.startswith('- ') or s.startswith('* '):
            item = s.lstrip('●-* ')
            content_lines.append(f"* {item}")
        else:
            content_lines.append(s)
            
    content_md = '\n\n'.join(content_lines)
    
    # Get excerpt from first paragraph
    first_para = ''
    for cl in content_lines:
        if not cl.startswith('###') and not cl.startswith('*') and len(cl) > 40:
            first_para = cl
            break
    if not first_para:
        first_para = meta_desc
        
    formatted_posts.append({
        'id': f'blog-{idx+1}',
        'slug': slug,
        'title': title,
        'metaTitle': f'{meta_title} | Bitium Technology',
        'metaDescription': meta_desc,
        'excerpt': first_para,
        'category': category,
        'tags': tags,
        'author': {
            'name': 'Asanka Udawatte',
            'role': 'Director of Growth & AI Strategy - Stack Unleash',
            'avatar': '/images/bitium-logo.jpg'
        },
        'publishedAt': f'2026-08-0{idx+1}' if idx < 9 else '2026-08-10',
        'readTime': '5 min read',
        'coverImage': image,
        'coverAlt': alt,
        'featured': idx == 0,
        'tableOfContents': toc,
        'content': content_md,
        'relatedService': service
    })

# Write to lib/blogs.ts
ts_code = f"""export interface TableOfContentItem {{
  id: string;
  title: string;
}}

export interface Author {{
  name: string;
  role: string;
  avatar: string;
}}

export interface BlogPost {{
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: 'Screen Printing' | 'Batik Craft' | 'Laser Cutting' | 'DTF Printing' | 'Stencils & Fabric';
  tags: string[];
  author: Author;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  coverAlt: string;
  featured?: boolean;
  tableOfContents: TableOfContentItem[];
  content: string;
  relatedService: {{
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
  }};
}}

export const BLOG_POSTS: BlogPost[] = {json.dumps(formatted_posts, indent=2, ensure_ascii=False)};

export function getBlogPostBySlug(slug: string): BlogPost | undefined {{
  return BLOG_POSTS.find((p) => p.slug === slug);
}}

export function getRelatedBlogPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {{
  return BLOG_POSTS.filter((p) => p.slug !== currentSlug && p.category === category).slice(0, limit);
}}
"""

with open(r'c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\lib\blogs.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("Successfully generated lib/blogs.ts with all 10 blogs and exact images!")
