from PIL import Image, ImageDraw

bg_path = r"c:\Users\Computer House\.gemini\antigravity\scratch\phishing-detection-system\client\src\assets\phishguard_hero.jpg"
img = Image.open(bg_path).convert("RGBA")
width, height = img.size

# Create gradient overlay image for right side
overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)

blend_start = 540
blend_end = 620

for x in range(blend_start, width):
    if x < blend_end:
        alpha = int(255 * (x - blend_start) / (blend_end - blend_start))
    else:
        alpha = 255
    
    # Draw vertical line for each x with vertical gradient color
    for y in range(height):
        t = y / float(height)
        r = int(4 * (1 - t) + 2 * t)
        g = int(11 * (1 - t) + 6 * t)
        b = int(28 * (1 - t) + 18 * t)
        draw.point((x, y), fill=(r, g, b, alpha))

composite = Image.alpha_composite(img, overlay)
composite.convert("RGB").save(bg_path, quality=95)
print("Successfully cleaned phishguard_hero.jpg with pure PIL!")
