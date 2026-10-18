"""Import More Worldwide Exim artwork and reproducible display derivatives.

Run with the bundled Python (Pillow, PyMuPDF). Originals live untouched in the
studio folder "02 More World Wide"; only display copies are written inside this
checkout. The script is idempotent: any previously registered mwe-* records are
replaced, and every other manifest byte is preserved. tests/assets.test.ts
re-hashes each registered public file against its record.
"""
from pathlib import Path
from hashlib import sha256
from urllib.parse import quote
import json
import shutil

from PIL import Image
import pymupdf

ROOT = Path(__file__).resolve().parents[1]
STUDIO = ROOT.parent
SOURCE = STUDIO / "02 More World Wide"
DEST = ROOT / "public/images/projects/mwe"
DEST.mkdir(parents=True, exist_ok=True)
MANIFEST = ROOT / "src/data/assets.json"

WHITE = (255, 255, 255)
records: list[dict] = []


def digest(path: Path) -> str:
    return sha256(path.read_bytes()).hexdigest().upper()


def entry(asset_id, path, source, role, status, **extra):
    with Image.open(path) as image:
        width, height = image.size
    record = {
        "id": asset_id,
        "source": source,
        "filename": path.name,
        "format": path.suffix[1:],
        "width": width,
        "height": height,
        "bytes": path.stat().st_size,
        "sha256": digest(path),
        "role": role,
        "publicPath": "/images/projects/mwe/" + quote(path.name),
        "status": status,
    }
    record.update(extra)
    records.append(record)
    return record


def copy_supplied(asset_id, rel, filename, role):
    src = SOURCE / rel
    out = DEST / filename
    if out.exists() and out.read_bytes() != src.read_bytes():
        raise SystemExit(f"refusing to overwrite differing {out.name}")
    shutil.copyfile(src, out)
    with Image.open(out) as image:
        transparency = image.mode in ("RGBA", "LA")
    return entry(asset_id, out, rel.as_posix(), role, "supplied", hasTransparency=transparency)


def open_flat(rel):
    """Open a source image and drop any transparency onto white."""
    image = Image.open(SOURCE / rel)
    if image.mode in ("RGBA", "LA", "P"):
        image = image.convert("RGBA")
        canvas = Image.new("RGB", image.size, WHITE)
        canvas.paste(image, mask=image.split()[-1])
        return canvas
    return image.convert("RGB")


def fit_width(image, max_width):
    height = round(image.height * max_width / image.width)
    return image.resize((max_width, height), Image.LANCZOS)


def product(asset_id, rel, filename, role, max_width=1500):
    image = fit_width(open_flat(rel), max_width)
    out = DEST / filename
    image.save(out, "JPEG", quality=86, optimize=True, progressive=True)
    return entry(
        asset_id, out, rel.as_posix(), role, "derived", hasTransparency=False,
        transformation=f"Flattened onto white, LANCZOS resize to {max_width} px wide, JPEG quality 86",
    )


def cover_page(rel, target_height=1400):
    page = pymupdf.open(SOURCE / rel).load_page(0)
    scale = target_height / page.rect.height
    pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def sheet(images, columns, cell, margin, gap, background=WHITE):
    """Lay equal-weight images into a tidy bounded sheet on a flat background."""
    rows = (len(images) + columns - 1) // columns
    width = margin * 2 + columns * cell[0] + (columns - 1) * gap
    height = margin * 2 + rows * cell[1] + (rows - 1) * gap
    canvas = Image.new("RGB", (width, height), background)
    for index, image in enumerate(images):
        copy = image.copy()
        copy.thumbnail(cell, Image.LANCZOS)
        column, row = index % columns, index // columns
        x = margin + column * (cell[0] + gap) + (cell[0] - copy.width) // 2
        y = margin + row * (cell[1] + gap) + (cell[1] - copy.height) // 2
        canvas.paste(copy, (x, y))
    return canvas


# --- identity: supplied logos, copied unchanged -------------------------------
copy_supplied("mwe-lockup", Path("MWE Logo Files/Full Lockup/png/lockup-colour_MWE.png"),
              "mwe-lockup.png", "Supplied More Worldwide Exim full colour lockup; identity and project cover")
copy_supplied("mwe-icon", Path("MWE Logo Files/Icon/png/Icon-colour_MWE.png"),
              "mwe-icon.png", "Supplied corrected MWE monogram; the letters now read M, W and E")
copy_supplied("mwe-wordmark", Path("MWE Logo Files/word mark/Png/word-colour_MWE.png"),
              "mwe-wordmark.png", "Supplied More Worldwide Exim colour wordmark")

# --- products: flattened, resized display copies ------------------------------
product("mwe-moringa", Path("website/moringa.png"), "mwe-moringa.jpg",
        "Moringa powder pack, supplied product photography")
range_images = [
    open_flat(Path("website/beetroot.png")),
    open_flat(Path("website/rose water.png")),
    open_flat(Path("website/inscense.png")),
    open_flat(Path("website/fitkari.png")),
]
sheet(range_images, columns=2, cell=(700, 880), margin=30, gap=30).save(
    DEST / "mwe-range.jpg", "JPEG", quality=86, optimize=True, progressive=True)
entry("mwe-range", DEST / "mwe-range.jpg",
      "website/beetroot.png; website/rose water.png; website/inscense.png; website/fitkari.png",
      "Beet powder, rose water, incense and mineral pack shots arranged as one wellness range",
      "derived", hasTransparency=False,
      transformation="Flattened onto white, LANCZOS resize, 2x2 sheet, JPEG quality 86")

# --- catalogues: one two-by-two family sheet --------------------------------
catalogues = [
    "website/herbal catalogue master.pdf",
    "website/alum catalogue.pdf",
    "website/incense catalogue.pdf",
    "website/rose water catalogue.pdf",
]
covers = [cover_page(rel) for rel in catalogues]
sheet(covers, columns=2, cell=(900, 636), margin=60, gap=60, background=WHITE).save(
    DEST / "mwe-catalogues.jpg", "JPEG", quality=88, optimize=True, progressive=True)
entry("mwe-catalogues", DEST / "mwe-catalogues.jpg", "website/*.pdf",
      "The four export catalogues (herbal powders, minerals, incense and rose water) shown as one family",
      "derived", hasTransparency=False,
      transformation="Rendered catalogue covers, LANCZOS resize, 2x2 sheet, JPEG quality 88")

# --- manifest: replace mwe-* records, keep every other existing byte ----------
text = MANIFEST.read_bytes().decode("utf-8-sig")
line_end = "\r\n" if "\r\n" in text else "\n"
lines = text.rstrip().split(line_end)
index = next((i for i, line in enumerate(lines) if line.strip().startswith('"id":  "mwe-')), None)
if index is not None:
    start = index - 1
    assert lines[start].strip() == "{", lines[start]
    lines = lines[:start]
    while lines and not lines[-1].strip():
        lines.pop()
    assert lines[-1].rstrip().endswith("},"), lines[-1]
    lines[-1] = lines[-1].rstrip()[:-1]
body = line_end.join(lines)
assert body.endswith("}")


def scalar(value):
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    return str(value)


def block(record):
    lines = ["    {"]
    items = list(record.items())
    for position, (key, value) in enumerate(items):
        comma = "," if position < len(items) - 1 else ""
        lines.append(f"        {json.dumps(key)}:  {scalar(value)}{comma}")
    lines.append("    }")
    return line_end.join(lines)


merged = body + "," + line_end + ("," + line_end).join(block(record) for record in records) + line_end + "]" + line_end
MANIFEST.write_bytes(merged.encode("utf-8-sig"))
print(f"registered {len(records)} assets in {MANIFEST.relative_to(ROOT)}")
for record in records:
    print(f"  {record['id']:<26} {record['width']}x{record['height']}  {record['bytes']:,} bytes")
