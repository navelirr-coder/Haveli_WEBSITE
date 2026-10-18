# AVAIA Mind Clinic case study

The original AVAIA portfolio placeholder is expanded at `/work/avaia-mind-clinic`. `/work/avaia` permanently redirects to it, preserving earlier links. Home, Work, Services and next-project navigation use the canonical portfolio entry; no duplicate client project was created.

## Content and implementation

- `src/data/projects.ts`: typed editorial cells, project services and all supplied brief, challenge, concept, strategy, execution and outcome copy. Edit content here.
- `src/components/editorial-case-study.tsx`: optional editorial variant of the existing case-study route; image/text bento cells, original-artwork/PDF links and related real projects.
- `src/app/avaia.css`: cream/brown local frame, 12-column desktop composition and logical single-column mobile sequence. Artwork always uses proportional contain sizing. Studio navigation/footer remain shared.
- `src/app/work/[slug]/page.tsx`: renderer selection, metadata/canonical link and legacy redirect; the generic case-study layout remains available to every other project.
- `src/data/site.ts`: canonical AVAIA link from Services.

The existing GSAP animation utility handles the title and selected image/text reveals, including reduced-motion matching and route cleanup. The banner and primary symbol use clip reveals; nothing is hidden in the server-rendered non-JavaScript fallback.

## Confirmed sources

Originals are copied into `public/images/projects/avaia/` without renaming or overwriting different files. Hashes, source paths, actual dimensions, display roles, transparency and derivative provenance are recorded in the central `src/data/assets.json` and `docs/avaia-asset-inventory.json`.

| Original | Actual dimensions | Usage |
| --- | --- | --- |
| `1Artboard 1@2x-8.png` | 17,309 × 5,199 px | Original banner retained; 3,200 × 961 proportional display derivative |
| `Asset 3.png` | 503 × 183 px | Both visiting cards, displayed together, without enlargement beyond their intrinsic width |
| `avaia logo 2.png` | 1,631 × 2,411 px | Tall cream-backed phoenix artwork, shown in full |
| `avaia logo-8.png` | 1,530 × 2,235 px | Transparent phoenix symbol, including the complete tail |
| `letterhead.pdf` | 1 A4 page | Attached version; complete-page 1,556 × 2,200 PNG preview, with original PDF link |
| `1AVAIA Letter head .pdf` | 1 A4 page | Supplied alternative; preserved as a source reference |
| `type face.pdf` | 1 page, 164.045 × 36.1901 pt | Custom wordmark artwork; complete-page 2,200 × 486 PNG preview, with original PDF link |

These differ from some dimensions and descriptions in the brief. In particular, the actual tall `avaia logo 2.png` depicts the phoenix; the custom AVAIA lettering is shown faithfully using the supplied typography specimen and banner, rather than being reconstructed in a system font.

Both letterhead PDFs and the typography PDF were rendered and visually inspected. The selected preview is generated from the explicitly attached `letterhead.pdf`. The originals and their spelling/artwork remain unchanged.

`scripts/import-avaia.py` reproduces the import and display derivatives using Pillow, pypdf and Poppler; it refuses to overwrite differing originals. The initial `scripts/import-assets.ps1` now retains later manifest entries when rerun.

## Font and missing materials

No corresponding AVAIA `.otf`, `.ttf`, `.woff` or `.woff2` was found in the supplied project directory or this website. The PDF is a visual specimen, not a font. No substitute font is claimed to be AVAIA's lettering. If the real web-licensed font is provided later, add it to `public/fonts/avaia/` and declare an `@font-face` family scoped to `.avaia-case-study`; the original specimen can remain in the gallery.

All requested artwork was located. No social-media mockups, research findings, client quotations or additional outcomes were invented.

## Verification

Production build, TypeScript, ESLint and all 13 regression tests passed. The canonical route, legacy redirect and every imported asset returned the expected HTTP response. Desktop and 390 px mobile gallery views were inspected: banner, complete phoenix, visiting cards, letterhead and type specimen loaded proportionally without horizontal overflow. Original PDF links are retained, and the shared mobile navigation opens, closes with Escape and restores focus.
