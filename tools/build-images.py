#!/usr/bin/env python3
"""Generate responsive WebP assets from the source JPGs (run once, output is committed)."""
import os, glob
from PIL import Image

SRC = 'assets/img'
WIDTHS = {'card': 480, 'card@2x': 960, 'hero': 1000, 'hero@2x': 1800}

def build(name, path):
    im = Image.open(path).convert('RGB')
    out = []
    for key, w in WIDTHS.items():
        if key.startswith('hero') != name.startswith('hero'):
            continue
        h = round(im.height * w / im.width)
        resized = im.resize((w, h), Image.LANCZOS)
        target = os.path.join(SRC, f'{name}-{w}.webp')
        resized.save(target, 'WEBP', quality=78, method=6)
        out.append((os.path.basename(target), os.path.getsize(target)))
    return out

names = sorted({os.path.basename(p)[:-4] for p in glob.glob(os.path.join(SRC, '*.jpg'))})
total_before = total_after = 0
for n in names:
    jpg = os.path.join(SRC, n + '.jpg')
    total_before += os.path.getsize(jpg)
    for f, s in build(n, jpg):
        total_after += s
        print(f'{f:28} {s/1024:7.1f} KB')
print(f'\nJPG source total: {total_before/1024:.0f} KB   ->   WebP total: {total_after/1024:.0f} KB')
