"""Import the studio's chilli-and-lemon mark.

The supplied PNG already carries a clean alpha cutout; it is trimmed to its
alpha bounds and resized proportionally for the cursor follower. Colours,
outline and proportions are untouched. Run from the website root:
``python scripts/import-studio-art.py``.
"""

from pathlib import Path
import hashlib

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path(r"C:\Users\navel\Downloads")
OUT = ROOT / "public" / "assets" / "studio"
PADDING = 12
WIDTH = 720


def main() -> None:
    source = DOWNLOADS / "Lemonchilli.png"
    if not source.exists():
        raise SystemExit(f"Missing supplied artwork: {source}")

    image = Image.open(source).convert("RGBA")
    bounds = image.getchannel("A").getbbox()
    if bounds is None:
        raise SystemExit("Supplied artwork is fully transparent.")

    left, top, right, bottom = bounds
    crop = image.crop((
        max(0, left - PADDING),
        max(0, top - PADDING),
        min(image.width, right + PADDING),
        min(image.height, bottom + PADDING),
    ))
    height = round(WIDTH * crop.height / crop.width)
    crop = crop.resize((WIDTH, height), Image.LANCZOS)

    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / "chilli-lemon.png"
    crop.save(path, optimize=True)
    digest = hashlib.sha256(path.read_bytes()).hexdigest().upper()
    print(f"chilli-lemon.png: {crop.width}x{crop.height}, {path.stat().st_size} bytes, {digest}")
    print(f"source alpha bounds: {bounds}")


if __name__ == "__main__":
    main()
