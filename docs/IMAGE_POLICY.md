# Editorial image policy

## Preference order

1. Hakan’s own photographs, screenshots, diagrams, and project artifacts.
2. Free editorial photography from Unsplash or Pexels, with attribution even when the license does not require it.
3. Wikimedia Commons when a specific historical, geographic, or technical image is needed; preserve the exact work-level license.
4. Generated imagery only when the subject cannot be honestly photographed or diagrammed, and label it.

## Workflow

1. Choose an image because it adds information, texture, place, or pacing—not because every section needs decoration.
2. Open the image’s canonical page and verify that it is free rather than a paid “Plus” result.
3. Record photographer name/profile, source page, and license page.
4. Download the original. Do not hotlink.
5. Auto-orient, crop intentionally, strip metadata, and export WebP:

```bash
magick input.jpg -auto-orient -resize '1600x900^' -gravity center -extent 1600x900 -strip -quality 82 hero.webp
```

6. Use literal alt text for informative images. Use empty alt text when the image is purely decorative and the caption already supplies context.
7. Keep the quiet credit immediately below the image.

Avoid identifiable people or brands when the article could imply endorsement, blame, diagnosis, criminality, or another sensitive context.
