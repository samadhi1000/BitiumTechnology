import os
from PIL import Image, ImageOps, ImageFilter

def make_background_transparent(image_path, output_path):
    # Open the image
    img = Image.open(image_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # If the pixel is very close to white, make it transparent
        # Since the hoodie is black, anything above 240, 240, 240 is background.
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    
    # Save the result
    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

if __name__ == "__main__":
    src = r"C:\Users\Thusitha\.gemini\antigravity\brain\79e171cc-b1e9-4035-85a3-3fc74638ca4d\.user_uploaded\media_1786095408219.jpg"
    dest = r"c:\Users\Thusitha\Desktop\New Antigravity\Bitium Technology\public\images\products\black_hoodie_uploaded.png"
    make_background_transparent(src, dest)
