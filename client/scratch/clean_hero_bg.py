import os
import numpy as np
from PIL import Image

bg_path = r"c:\Users\Computer House\.gemini\antigravity\scratch\phishing-detection-system\client\src\assets\phishguard_hero.jpg"
img = Image.open(bg_path).convert("RGBA")
width, height = img.size

img_np = np.array(img, dtype=np.float32)

# Create a gradient background for the right side matching the dark blue theme
# Top right color: (4, 11, 28, 255), Bottom right color: (2, 6, 18, 255)
y_coords = np.linspace(0, 1, height)[:, None]

top_color = np.array([4, 11, 28, 255], dtype=np.float32)
bottom_color = np.array([2, 6, 18, 255], dtype=np.float32)

right_bg = (1 - y_coords) * top_color + y_coords * bottom_color
right_bg_full = np.tile(right_bg[:, None, :], (1, width, 1))

# Blend mask: x < 540 is 100% original image. x between 540 and 620 smooth transition. x > 620 is 100% clean dark background
blend_start = 540
blend_end = 630

mask = np.zeros((height, width, 1), dtype=np.float32)

for x in range(width):
    if x < blend_start:
        mask[:, x, 0] = 0.0
    elif x > blend_end:
        mask[:, x, 0] = 1.0
    else:
        # Smooth cosine alpha transition
        alpha = (x - blend_start) / (blend_end - blend_start)
        mask[:, x, 0] = alpha

# Composite: result = (1 - mask) * original + mask * right_bg
composite = (1.0 - mask) * img_np + mask * right_bg_full
composite = np.clip(composite, 0, 255).astype(np.uint8)

res_img = Image.fromarray(composite, mode="RGBA").convert("RGB")
res_img.save(bg_path, quality=95)
print("Successfully cleaned right side of phishguard_hero.jpg!")
