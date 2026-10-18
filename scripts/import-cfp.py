"""Import the supplied CFP case-study artwork unchanged, with explicit filename mapping."""
from pathlib import Path
from hashlib import sha256
from urllib.parse import quote
import json
import shutil
from PIL import Image

root = Path(__file__).resolve().parents[1]
source_dir = root.parent / "Choudhari Farm Products CFP/CFP_Website"
target = root / "public/images/projects/cfp"
target.mkdir(parents=True, exist_ok=True)
selections = [
    ("cfp-range", "CFP_Product Range.png", "CFP_Product Range.png", "Opening product-range overview"),
    ("cfp-kids-bajra", "Bajra Chivda Product image.png", "Bajra Chivda Product image(5).png", "Children's Bajra Chivda packshot"),
    ("cfp-kids-chips", "Jowar Chips Product image.png", "Jowar Chips Product image(4).png", "Children's Jowar Chips packshot"),
    ("cfp-kids-chivda", "Jowar Chivda Product image.png", "Jowar Chivda Product image(4).png", "Children's Jowar Chivda packshot"),
    ("cfp-kids-ragi", "Ragi Sticks  Product image.png", "Ragi Sticks  Product image(5).png", "Children's Ragi Sticks packshot"),
    ("cfp-adult-cookies", "Millet Cookie Packaging.png", "Millet Cookie Packaging(2).png", "Attached adult Millet Cookies composition"),
    ("cfp-adult-millet", "Millet Ladoo Packaging.png", "Millet Ladoo Packaging(3).png", "Attached adult Millet Ladoo composition"),
    ("cfp-adult-ragi", "Ragi Ladoo Packaging.png", "Ragi Ladoo Packaging(3).png", "Attached adult Ragi Ladoo composition"),
    ("cfp-adult-nutri", "Nutri Bar Packaging2.png", "Nutri Bar Packaging(3).png", "Attached adult Nutri Bar composition"),
    ("cfp-basket", "cfp-snack-basket-arrangement.jpg", "cfp-snack-basket-arrangement.jpg", "Attached basket arrangement; closing range photograph"),
]
records = []
for asset_id, filename, brief_name, role in selections:
    source = source_dir / filename
    destination = target / filename
    if destination.exists():
        if destination.read_bytes() != source.read_bytes():
            raise RuntimeError(f"Refusing to overwrite differing original: {filename}")
    else:
        shutil.copy2(source, destination)
    with Image.open(source) as image:
        width, height = image.size
        alpha = image.convert("RGBA").getchannel("A").getextrema()[0] < 255
    records.append(dict(id=asset_id, source=source.relative_to(root.parent).as_posix(), filename=filename,
                        requestedFilename=brief_name, format=source.suffix[1:].lower(), width=width, height=height,
                        bytes=source.stat().st_size, sha256=sha256(source.read_bytes()).hexdigest().upper(),
                        role=role, publicPath="/images/projects/cfp/" + quote(filename, safe=""),
                        status="supplied", hasTransparency=alpha))
manifest_path = root / "src/data/assets.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
manifest = [item for item in manifest if item["id"] not in {record["id"] for record in records}] + records
manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
(root / "docs/cfp-asset-inventory.json").write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Imported {len(records)} unchanged CFP originals; exact brief-to-source mappings recorded.")
