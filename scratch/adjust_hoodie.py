from PIL import Image

def adjust_hoodie():
    # Open the transparent image
    img = Image.open("public/images/products/black_hoodie_uploaded.png")
    
    # Get bounding box of non-transparent content
    bbox = img.getbbox()
    print("Bounding box:", bbox)
    
    # Crop to bounding box
    cropped = img.crop(bbox)
    print("Cropped size:", cropped.size)
    
    # We want it to fit nicely inside the target aspect ratio.
    # The original image was 211 x 273 (width x height).
    # Let's create a canvas of 211 x 273, and fit the cropped hoodie inside it.
    target_w, target_h = 211, 273
    
    # Calculate scale factor to fit the cropped hoodie inside the target canvas with some padding.
    # Let's leave some padding, say 10px on sides/top/bottom.
    max_w = target_w - 20
    max_h = target_h - 40 # leave more space for text at top/bottom
    
    scale_w = max_w / cropped.size[0]
    scale_h = max_h / cropped.size[1]
    scale = min(scale_w, scale_h)
    
    new_w = int(cropped.size[0] * scale)
    new_h = int(cropped.size[1] * scale)
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create new transparent canvas
    canvas = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    
    # Paste resized hoodie onto canvas, centered horizontally, and positioned vertically.
    # Let's see: original black_hoodie_blank had the hoodie chest area around top-[38.4%].
    # Let's place it such that the hoodie is centered horizontally and nicely positioned vertically.
    paste_x = (target_w - new_w) // 2
    paste_y = (target_h - new_h) // 2 + 10 # offset down slightly
    
    canvas.paste(resized, (paste_x, paste_y), resized)
    
    canvas.save("public/images/products/black_hoodie_uploaded_fitted.png", "PNG")
    print("Saved adjusted image to public/images/products/black_hoodie_uploaded_fitted.png")

if __name__ == "__main__":
    adjust_hoodie()
