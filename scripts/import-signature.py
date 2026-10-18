"""Preserve HAVELI artwork and make a proportional display copy.

The provided OTF's README permits personal use only, so no font is embedded.
Only transparent outer canvas is trimmed from the display derivative.
"""
from pathlib import Path
from hashlib import sha256
from urllib.parse import quote
import json
import shutil
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root.parent / "HAVELI Branding/HAVELI TYPEFACE.png"
destination = root / "public/assets/studio" / source.name
if destination.exists():
    if destination.read_bytes() != source.read_bytes():
        raise RuntimeError("Refusing to overwrite existing HAVELI artwork")
else:
    shutil.copy2(source, destination)

with Image.open(source) as image:
    original_width, original_height = image.size
    bounds = image.getchannel("A").getbbox()
    if not bounds:
        raise RuntimeError("The supplied wordmark is empty")
    padded = (max(0, bounds[0]-8), max(0, bounds[1]-8), min(image.width, bounds[2]+8), min(image.height, bounds[3]+8))
    display = image.crop(padded)
    display.thumbnail((2400,2400), Image.Resampling.LANCZOS)
    display_path = destination.with_name("HAVELI TYPEFACE.web.png")
    display.save(display_path, optimize=True)
    display_width, display_height = display.size

def record(asset_id, path, width, height, role, status, **extra):
    return dict(id=asset_id, source="HAVELI Branding/HAVELI TYPEFACE.png", filename=path.name,
                format="png", width=width, height=height, bytes=path.stat().st_size,
                sha256=sha256(path.read_bytes()).hexdigest().upper(), role=role,
                publicPath="/assets/studio/"+quote(path.name,safe=""), status=status,
                hasTransparency=True, **extra)

records = [
    record("haveli-wordmark-original",destination,original_width,original_height,"Original supplied Studio Haveli wordmark artwork; retained unchanged","supplied"),
    record("haveli-wordmark-web",display_path,display_width,display_height,"Authentic HAVELI artwork used by the single hero/navigation wordmark","derived",derivedFrom="haveli-wordmark-original",transformation="Trim transparent outer canvas with 8 source-pixel padding; proportional LANCZOS resize to 2400 px width; no lettering, colours or proportions changed",sourceAlphaBounds=list(bounds)),
]
manifest_path = root / "src/data/assets.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
manifest = [item for item in manifest if item["id"] not in {r["id"] for r in records}] + records
manifest_path.write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
print(f"Preserved original {original_width} x {original_height}; display derivative {display_width} x {display_height}. No demo font embedded.")
