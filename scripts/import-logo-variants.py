"""Build the four display wordmark layers used by the signature transition.

The flat pink, red and green layers share one alpha mask taken from the
supplied flat red wordmark, so they cross-fade without shifting. The chrome
layer is the supplied chrome render, trimmed and cleaned of its checkerboard
background (the supplied ``haveli_chrome_no_drip.png`` already carries the
keyed alpha).

Sources live in ``../HAVELI LOGO/3x``; run from the website root:
``python scripts/import-logo-variants.py``.
"""

from pathlib import Path
import hashlib

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\navel\OneDrive\Desktop\HAVELI STUDIOS\HAVELI LOGO\3x")
OUT = ROOT / "public" / "assets" / "studio"
TARGET_WIDTH = 2400
CHROME_WIDTH = 1800

PINK = (196, 0, 126)
RED = (183, 17, 17)
GREEN = (0, 183, 22)


def alpha_mask(path: Path) -> Image.Image:
    # The supplied flat wordmarks ship as indexed PNGs with a real alpha channel.
    return Image.open(path).convert("RGBA").getchannel("A")


def trim(image: Image.Image, padding: int = 8) -> Image.Image:
    bbox = image.point(lambda value: 255 if value > 12 else 0).getbbox()
    if not bbox:
        raise SystemExit("The supplied wordmark has no visible pixels.")
    crop = (
        max(0, bbox[0] - padding),
        max(0, bbox[1] - padding),
        min(image.width, bbox[2] + padding),
        min(image.height, bbox[3] + padding),
    )
    return image.crop(crop)


def tint(alpha: Image.Image, colour: tuple[int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", alpha.size, (*colour, 0))
    layer.putalpha(alpha)
    return layer


def load_chrome(path: Path) -> Image.Image:
    # Background already removed in the supplied file; trim the empty margin
    # and scale once so the render stays crisp at the largest display size.
    image = trim(Image.open(path).convert("RGBA"), padding=6)
    height = round(CHROME_WIDTH * image.height / image.width)
    return image.resize((CHROME_WIDTH, height), Image.LANCZOS)


def main() -> None:
    red_source = SOURCE / "1Asset 2@3x-8.png"
    green_source = SOURCE / "1Asset 1@3x-8.png"
    chrome_source = SOURCE / "haveli_chrome_no_drip.png"
    for path in (red_source, green_source, chrome_source):
        if not path.exists():
            raise SystemExit(f"Missing supplied artwork: {path}")

    alpha = trim(alpha_mask(red_source))
    height = round(TARGET_WIDTH * alpha.height / alpha.width)
    shared = alpha.resize((TARGET_WIDTH, height), Image.LANCZOS)

    # Confirm the supplied green artwork has the same geometry.
    green_bbox = alpha_mask(green_source).point(lambda value: 255 if value > 12 else 0).getbbox()
    red_bbox = alpha_mask(red_source).point(lambda value: 255 if value > 12 else 0).getbbox()
    if green_bbox != red_bbox:
        print(f"warning: green bbox {green_bbox} differs from red bbox {red_bbox}")

    OUT.mkdir(parents=True, exist_ok=True)
    outputs = {
        "haveli-wordmark-pink.png": tint(shared, PINK),
        "haveli-wordmark-red.png": tint(shared, RED),
        "haveli-wordmark-green.png": tint(shared, GREEN),
        "haveli-wordmark-chrome.png": load_chrome(chrome_source),
    }
    for name, image in outputs.items():
        path = OUT / name
        image.save(path, optimize=True)
        digest = hashlib.sha256(path.read_bytes()).hexdigest().upper()
        print(f"{name}: {image.width}x{image.height}, {path.stat().st_size} bytes, {digest}")


if __name__ == "__main__":
    main()
