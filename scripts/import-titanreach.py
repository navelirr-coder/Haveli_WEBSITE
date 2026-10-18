"""Import the supplied TitanReach Exim case-study artwork.

Sources sit in ``../Downloads`` (supplied mockups) and ``../00 Titan reach``
(identity and product packaging). Photographic mockups are flattened and
resized to web sizes; the identity mark keeps its alpha. Originals are never
overwritten. Run from the website root: ``python scripts/import-titanreach.py``.
"""

from pathlib import Path
import hashlib

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
STUDIO = ROOT.parent
DOWNLOADS = Path(r"C:\Users\navel\Downloads")
OUT = ROOT / "public" / "images" / "projects" / "titanreach"
MAX_WIDTH = 1600


def export_photo(source: Path, filename: str, quality: int = 88) -> tuple[Path, str, tuple[int, int]]:
    image = Image.open(source).convert("RGB")
    if image.width > MAX_WIDTH:
        height = round(MAX_WIDTH * image.height / image.width)
        image = image.resize((MAX_WIDTH, height), Image.LANCZOS)
    path = OUT / filename
    image.save(path, quality=quality, optimize=True, progressive=True)
    digest = hashlib.sha256(path.read_bytes()).hexdigest().upper()
    return path, digest, image.size


def export_mark(source: Path, filename: str, width: int = 1200) -> tuple[Path, str, tuple[int, int]]:
    image = Image.open(source).convert("RGBA")
    height = round(width * image.height / image.width)
    image = image.resize((width, height), Image.LANCZOS)
    path = OUT / filename
    image.save(path, optimize=True)
    digest = hashlib.sha256(path.read_bytes()).hexdigest().upper()
    return path, digest, image.size


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    jobs = [
        ("trx-container.jpg", export_photo, DOWNLOADS / "Titan Reach Container in Flight.png"),
        ("trx-website.jpg", export_photo, DOWNLOADS / "TitanReach Exim Global Trade Laptop Scene.png"),
        ("trx-stationery.jpg", export_photo, DOWNLOADS / "Luxury Navy Corporate Stationery Mockup.png"),
        ("trx-packaging.jpg", export_photo, DOWNLOADS / "Luxury TitanReach Exim Packaging Setup.png"),
        ("trx-mealkit.jpg", export_photo, STUDIO / "00 Titan reach" / "More Eatzz Packaging" / "3x" / "packaging pg@3x.png"),
    ]
    for filename, exporter, source in jobs:
        if not source.exists():
            raise SystemExit(f"Missing supplied artwork: {source}")
        path, digest, size = exporter(source, filename)
        print(f"{filename}: {size[0]}x{size[1]}, {path.stat().st_size} bytes, {digest}")

    mark_source = STUDIO / "00 Titan reach" / "1x" / "3x" / "TR_logo@3x-8.png"
    if not mark_source.exists():
        raise SystemExit(f"Missing supplied artwork: {mark_source}")
    path, digest, size = export_mark(mark_source, "trx-mark.png")
    print(f"trx-mark.png: {size[0]}x{size[1]}, {path.stat().st_size} bytes, {digest}")


if __name__ == "__main__":
    main()
