"""Import the supplied Aaradhyaa Global Impex identity artwork.

Sources sit in ``../ARGI`` (the studio's logo delivery pack). The supplied
PNGs are very large print-resolution exports, so each is downscaled with
LANCZOS for the web; transparency, colours and proportions are unchanged.
Run from the website root: ``python scripts/import-argi.py``.
"""

from gc import collect
from pathlib import Path
import hashlib

from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "ARGI" / "ARGI LOGO files"
OUT = ROOT / "public" / "images" / "projects" / "aaradhyaa"

JOBS = [
    # filename, source, target width
    ("argi-primary-logo.png", r"ARGI_PNG\7ARGI_Primary Logo.png", 2400),
    ("argi-vertical-stack.png", r"ARGI_PNG\8ARGI_Vertical Stack.png", 1700),
    ("argi-wordmark.png", r"ARGI_PNG\9ARGI_Wordmark.png", 2000),
    ("argi-icon-colour.png", r"ARGI_PNG\4ARGI_LOGO ICON_Full Colour.png", 1200),
    ("argi-icon-gold.png", r"ARGI_PNG\1ARGI_Logo Icon_All Gold.png", 1200),
    ("argi-typeface-display.png", r"300ppi\1Artboard 1.png", 1700),
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for filename, relative, width in JOBS:
        source = SOURCE / relative
        if not source.exists():
            raise SystemExit(f"Missing supplied artwork: {source}")

        image = Image.open(source)
        # A palette image with a transparency index converts to a clean RGBA
        # cutout; the artwork itself is never repainted.
        image = image.convert("RGBA")
        height = round(width * image.height / image.width)
        image = image.resize((width, height), Image.LANCZOS)
        path = OUT / filename
        image.save(path, optimize=True)
        digest = hashlib.sha256(path.read_bytes()).hexdigest().upper()
        print(f"{filename}: {width}x{height}, {path.stat().st_size} bytes, {digest}")
        del image
        collect()


if __name__ == "__main__":
    main()
