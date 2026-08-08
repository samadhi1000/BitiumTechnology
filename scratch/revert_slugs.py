import re

revert_map = {
    'an-illustration-depicting-custom-vs-letter-stencils': 'custom-stencils-vs-letter-stencils',
    'a-laser-cutting-machine-on-duty': 'what-kind-of-laser-cutting-service-do-you-actually-need',
    'a-man-is-applying-a-wall-stencil': 'how-to-pick-the-right-wall-stencil-for-your-space',
    'a-man-is-using-a-screen-printing-machine': 'custom-screen-printing-for-small-batches',
    'a-woman-is-wearing-a-dtf-printed-t-shirt': 'what-to-actually-look-for-before-you-order-a-dtf-printing-near-me',
    'a-dtf-print-and-a-set-of-printed-objrcts': 'why-dtf-printing-is-taking-over-custom-apparel',
    'a-man-checking-the-laser-cutting-output': 'laser-cutting-service-guide',
    'a-person-is-designing-a-batik-stamp': 'traditional-tools-for-batik-stamps',
    'a-woman-is-using-a-batik-stamp': 'beginners-guide-to-batik-stamps',
    'a-man-is-operating-a-screen-printing-printer': 'how-to-choose-a-screen-printing-shop-near-me',
}

file_path = r'c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\lib\blogs.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

for new_slug, original_slug in revert_map.items():
    content = content.replace(f'"slug": "{new_slug}"', f'"slug": "{original_slug}"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Reverted all 10 blog slugs in lib/blogs.ts successfully!')
