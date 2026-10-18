import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
test("all supplied artwork copies keep their original bytes and basenames", () => {
  const assets=JSON.parse(readFileSync("src/data/assets.json","utf8").replace(/^\uFEFF/,""));
  assert.ok(assets.length >= 10);
  assert.equal(new Set(assets.map((asset: {id: string}) => asset.id)).size,assets.length,"Asset IDs must stay unique across progressive imports.");
  for(const asset of assets) {
    const decoded=decodeURIComponent(asset.publicPath);
    assert.equal(decoded.split("/").at(-1),asset.filename);
    const bytes=readFileSync("public"+decoded);
    assert.equal(bytes.length,asset.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex").toUpperCase(),asset.sha256);
    if (asset.format === "pdf") assert.ok(asset.pages>0 && asset.pageWidthPoints>0 && asset.pageHeightPoints>0);
    else assert.ok(asset.width>0 && asset.height>0);
    assert.ok(!asset.publicPath.includes("@"),"Special filename characters must be encoded in web URLs.");
  }
});
