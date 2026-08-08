import re

slug_map = {
    'custom-stencils-vs-letter-stencils': 'an-illustration-depicting-custom-vs-letter-stencils',
    'what-kind-of-laser-cutting-service-do-you-actually-need': 'a-laser-cutting-machine-on-duty',
    'how-to-pick-the-right-wall-stencil-for-your-space': 'a-man-is-applying-a-wall-stencil',
    'custom-screen-printing-for-small-batches': 'a-man-is-using-a-screen-printing-machine',
    'what-to-actually-look-for-before-you-order-a-dtf-printing-near-me': 'a-woman-is-wearing-a-dtf-printed-t-shirt',
    'why-dtf-printing-is-taking-over-custom-apparel': 'a-dtf-print-and-a-set-of-printed-objrcts',
    'laser-cutting-service-guide': 'a-man-checking-the-laser-cutting-output',
    'traditional-tools-for-batik-stamps': 'a-person-is-designing-a-batik-stamp',
    'beginners-guide-to-batik-stamps': 'a-woman-is-using-a-batik-stamp',
    'how-to-choose-a-screen-printing-shop-near-me': 'a-man-is-operating-a-screen-printing-printer',
}

file_path = r'c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\lib\blogs.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

for old_slug, new_slug in slug_map.items():
    content = content.replace(f'"slug": "{old_slug}"', f'"slug": "{new_slug}"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated lib/blogs.ts successfully!')
