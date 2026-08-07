from PIL import Image

def test_overlays():
    hoodie = Image.open("public/images/products/black_hoodie_uploaded_fitted.png")
    motif = Image.open("public/images/products/design_1_motif.png")
    
    # Resize motif to fit (like 40px width on a 211px width canvas)
    # The canvas is 211x273. w-[40px] h-[40px] is roughly 40/211 = 19% of the width.
    # In our python script, target width is 211, height is 273.
    # 40px is a good size. Let's resize motif to 40x40.
    motif_resized = motif.resize((40, 40), Image.Resampling.LANCZOS)
    
    # Try different top percentages
    percentages = [38.4, 42.0, 45.0, 48.0]
    for pct in percentages:
        temp_hoodie = hoodie.copy()
        
        # Calculate coordinates
        x = (211 - 40) // 2
        y = int((273 * (pct / 100.0)) - 20) # center of motif is at (pct/100)*273
        
        temp_hoodie.paste(motif_resized, (x, y), motif_resized)
        temp_hoodie.save(f"scratch/test_overlay_{pct}.png")
        print(f"Saved scratch/test_overlay_{pct}.png")

if __name__ == "__main__":
    test_overlays()
