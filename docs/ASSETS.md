# Supplied assets

`src/data/assets.json` is the central runtime manifest. Each selected asset has an ID, source path relative to the parent studio folder, original filename, measured dimensions, file size, SHA-256, role and public path. Artwork is copied byte-for-byte, displayed proportionally with `object-fit: contain`, and never repainted or cropped. Next.js may deliver optimized display variants without changing the retained originals.

`identity-asset-inventory.json` catalogues all 30 identity raster, Illustrator, PDF and archive files discovered in `../HAVELI LOGO` and `../HAVELI Branding`. Pixel dimensions apply to raster files; Illustrator and print sources retain null pixel dimensions because they are not web images. Original files remain in place.

## Integrated selections

| Source basename | Dimensions | Role |
| --- | --- | --- |
| `1Asset 3.png` | 1799 × 1938 | Original red theatre-mask illustration; retained initial asset |
| `F p card@2x.png` | 1292 × 325 | Complete pink paired business cards; Studio Haveli portfolio cover |
| `F g card@2x.png` | 1252 × 325 | Complete green paired business cards; gallery |
| `F r card@2x.png` | 1270 × 325 | Complete deep-red paired business cards; gallery |
| `logo.png` (AVAIA) | 636 × 808 | Original bird symbol; identity cover |
| `Avaia B F.png` | 242 × 178 | Original low-resolution visiting-card export; gallery |
| `Jowar Chips Pouch.png` | 1379 × 1141 | CFP snack packaging cover |
| `CFP Ragi Sticks Snack Pouch.png` | 1374 × 1145 | CFP packaging gallery |
| `Bajra Chivda Pouches.png` | 880 × 887 | CFP packaging gallery |
| `YUGMA logo.jpg` | 4240 × 2092 | Original YUGMA International identity artwork |

Source `HAVELI LOGO/2x/Asset 5@2x.png` was inspected but not used; it contains another paired business-card version. The selected final pink card supplies the studio email address. No social handles are guessed.

The table records the initial ten assets. The manifest now includes 38 entries: the AVAIA expansion adds seven originals and three documented previews, the signature adds the authentic HAVELI wordmark and its display derivative, CFP adds ten unchanged originals, and More Worldwide Exim adds three supplied logos and three documented display copies. AVAIA uses the supplied tall phoenix as its cover; CFP uses the supplied product-range composition; More Worldwide Exim uses the supplied colour lockup. The home intro and global navigation share the supplied HAVELI artwork. See [AVAIA sources](AVAIA-CASE-STUDY.md), [CFP sources](CFP-CASE-STUDY.md), [More Worldwide Exim sources](MWE-CASE-STUDY.md) and [signature artwork and licensing](SIGNATURE.md) for current roles and provenance.

The ARGI folder was **not** used: a file named `7ARGI_Primary Logo.jpg` visibly contains Aradhya Global Impex artwork, and a 300ppi PNG could not be decoded by the image inspection tool. Folder names alone are insufficient evidence for a project attribution.

`The Augusta.otf` is present in the parent directory but has not been embedded as a webfont. The baseline uses system serif/sans families without external font requests. Supplied final web typography can replace the CSS display/sans tokens.

## Progressive uploads

1. Inspect the new file's contents, dimensions and intended role.
2. Keep its source path and basename; never overwrite a differing existing file.
3. Copy the selected file into an appropriate `public/assets/<project>/` directory.
4. Add a manifest entry with dimensions, source, role and hash, then reference its ID in `src/data/projects.ts` or the component.
5. Add real brief, strategy, applications or credits to the typed project entry only when provided. The case-study template renders optional sections only when present.
6. Check the page at desktop and mobile sizes. Use a clearly labelled temporary placeholder for missing artwork; do not substitute stock or generated designs.

`scripts/import-assets.ps1` reproduces the initial import and refuses to overwrite mismatched existing copies. It only reads the adjacent source files and writes within this website folder.
