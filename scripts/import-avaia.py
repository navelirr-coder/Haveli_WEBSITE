"""Import inspected AVAIA originals and reproducible display derivatives.

Run with the bundled Python (Pillow/pypdf) and Poppler pdftoppm on PATH.
Never overwrite differing originals; all work stays within this checkout.
"""
from pathlib import Path
from hashlib import sha256
from urllib.parse import quote
import json
import shutil
import subprocess
from PIL import Image
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
STUDIO = ROOT.parent
SOURCE = STUDIO / "00 AVAIA"
DEST = ROOT / "public/images/projects/avaia"
DEST.mkdir(parents=True, exist_ok=True)
manifest_path = ROOT / "src/data/assets.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
records = []


def digest(path):
    return sha256(path.read_bytes()).hexdigest().upper()


def register(asset_id, path, source, role, status="supplied", **extra):
    record = dict(id=asset_id, source=source, filename=path.name,
                  format=path.suffix[1:], width=0, height=0,
                  bytes=path.stat().st_size, sha256=digest(path), role=role,
                  publicPath="/images/projects/avaia/" + quote(path.name, safe=""), status=status)
    if path.suffix.lower() == ".png":
        with Image.open(path) as image:
            record.update(width=image.width, height=image.height,
                          hasTransparency=(("A" in image.getbands() and image.getchannel("A").getextrema()[0] < 255) or "transparency" in image.info))
    else:
        reader = PdfReader(path)
        record.update(pages=len(reader.pages), pageWidthPoints=float(reader.pages[0].mediabox.width),
                      pageHeightPoints=float(reader.pages[0].mediabox.height))
    record.update(extra)
    records.append(record)
    return path


def original(asset_id, relative, role):
    source = SOURCE / relative
    if not source.is_file():
        raise FileNotFoundError(source)
    destination = DEST / source.name
    if destination.exists():
        if digest(source) != digest(destination):
            raise RuntimeError(f"Refusing to overwrite differing artwork: {destination}")
    else:
        shutil.copy2(source, destination)
    return register(asset_id, destination, source.relative_to(STUDIO).as_posix(), role)


banner = original("avaia-banner-original", "2x/1Artboard 1@2x-8.png", "Original large-format AVAIA Mind Clinic banner; preserved source")
original("avaia-visiting-cards", "1x/Asset 3.png", "Original paired visiting-card artwork; show complete at native scale")
original("avaia-phoenix-detail", "1x/avaia logo-8.png", "Original transparent phoenix symbol; concept cell")
original("avaia-primary-phoenix", "1x/avaia logo 2.png", "Original cream-backed tall phoenix artwork; primary vertical gallery cell")
letterhead = original("avaia-letterhead-pdf", "letterhead.pdf", "User-attached letterhead; original PDF")
original("avaia-alternate-letterhead-pdf", "PDF/1AVAIA Letter head .pdf", "Alternate supplied letterhead PDF; retained reference")
typeface = original("avaia-typeface-pdf", "1x/1x/PDF/type face.pdf", "Original custom lettering specimen; artwork, not an installable font")

# A documented resampling derivative avoids decoding a 90-megapixel banner on every request.
banner_web = DEST / "1Artboard 1@2x-8.web.png"
with Image.open(banner) as image:
    image.thumbnail((3200, 3200), Image.Resampling.LANCZOS)
    image.save(banner_web, optimize=True)
register("avaia-banner-web", banner_web, "00 AVAIA/2x/1Artboard 1@2x-8.png",
         "Proportional web display copy of the original banner; no crop or redesign", "derived",
         derivedFrom="avaia-banner-original", transformation="Pillow LANCZOS resize, maximum width 3200 px; original retained")

for asset_id, pdf, output_name, role in [
    ("avaia-letterhead-preview", letterhead, "letterhead-preview.png", "Complete letterhead rendered from the attached PDF, page 1"),
    ("avaia-typeface-preview", typeface, "type-face-preview.png", "Custom letterform specimen rendered from the supplied PDF, page 1"),
]:
    output = DEST / output_name
    subprocess.run(["pdftoppm", "-f", "1", "-singlefile", "-scale-to", "2200", "-png", str(pdf), str(output.with_suffix(""))], check=True)
    register(asset_id, output, next(record["source"] for record in records if record["filename"] == pdf.name),
             role, "derived", derivedFrom="avaia-letterhead-pdf" if pdf == letterhead else "avaia-typeface-pdf",
             transformation="Poppler pdftoppm, page 1, complete page, maximum dimension 2200 px")

ids = {record["id"] for record in records}
manifest = [record for record in manifest if record["id"] not in ids] + records
manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
(ROOT / "docs/avaia-asset-inventory.json").write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(json.dumps([dict(id=r["id"], filename=r["filename"], width=r["width"], height=r["height"], status=r["status"]) for r in records], indent=2))
