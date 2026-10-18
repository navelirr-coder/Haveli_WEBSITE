# Choudhary Farm Products

Canonical route: `/work/choudhary-farm-products`. The earlier `/work/cfp` route permanently redirects to it. Home, Work, Services, related work and next-project links use the central project record, so the original project is expanded rather than duplicated. The displayed spelling follows the user's latest supplied name; the source folder spelling remains unchanged.

## Implementation

- `src/data/cfp.ts`: typed artwork, audiences and concise brief, scope and outcome. The narrative is condensed to its central strategy: two audiences with distinct communication needs. No parent-logo/complete-brand-identity scope, production-testing assertion or measured business results are added.

- `src/data/projects.ts`: existing CFP project receives its canonical slug, full-range cover and optional packaging case-study data. AVAIA's related link follows the new slug.

- `src/components/packaging-case-study.tsx`: renderer variant of the existing dynamic project route, with reusable artwork and audience panels. The product-range image opens the story and each of the eight product images appears once in its audience panel. The separate basket JPG is retained on disk but omitted from the page because it repeats the opening composition. Repeated challenge, thinking, showcase and closing sections are removed. Images have descriptive alt text and are not presented as clickable controls.

- `src/app/packaging.css`: desktop staggered audience compositions, tablet two-column image galleries and mobile single-column flow. Packshots and editorial images use proportional contain sizing; product edges and labels remain visible. Existing studio typography, buttons, navigation, footer and animation utilities are retained.

- `src/app/work/[slug]/page.tsx`: renderer selection, canonical metadata and legacy redirect. Existing generic and AVAIA templates remain available.

- `src/data/site.ts`: canonical Services link and latest project spelling.

- `scripts/import-cfp.py`: reproducible, safe import of ten unchanged originals; refuses to overwrite differing files.

- `src/data/assets.json`, `docs/cfp-asset-inventory.json`: exact paths, brief filename mappings, dimensions, original basenames, SHA-256 hashes and roles.

- `scripts/check-routes.mjs`: canonical CFP/AVAIA cards, both legacy redirects and all manifest URLs.

- `src/app/layout.tsx`: imports the scoped packaging stylesheet.

No dependencies were added. Existing GSAP reveals are supplemented by scrubbed parallax on a separate inner figure: alternating +/-22 px on desktop and +/-10 px on mobile. Reserved vertical space avoids overlapping captions or cropping packs. Breakpoint changes, reduced-motion preference changes and route cleanup revert the relevant transforms and triggers. Shared project links and navigation retain their existing hover/focus interactions. No lightbox, speculative controls, scroll hijacking or mobile pinning was introduced.

## Supplied artwork and filename differences

All ten files are copied byte-for-byte from `../Choudhari Farm Products CFP/CFP_Website/` to `public/images/projects/cfp/`. The numbered filenames in the brief are not present literally. The inspected product-equivalent files below are used, with the explicitly attached adult compositions taking precedence. This mapping is also machine-readable in the asset inventory.

| Brief name | Actual original | Pixels |

| --- | --- | --- |

| `CFP_Product Range.png` | same | 1200 × 896 |

| `Bajra Chivda Product image(5).png` | `Bajra Chivda Product image.png` | 880 × 887 |

| `Jowar Chips Product image(4).png` | `Jowar Chips Product image.png` | 1379 × 1141 |

| `Jowar Chivda Product image(4).png` | `Jowar Chivda Product image.png` | 882 × 887 |

| `Ragi Sticks  Product image(5).png` | `Ragi Sticks  Product image.png` | 1374 × 1145 |

| `Millet Cookie Packaging(2).png` | attached `Millet Cookie Packaging.png` | 1061 × 1482 |

| `Millet Ladoo Packaging(3).png` | attached `Millet Ladoo Packaging.png` | 1062 × 1482 |

| `Ragi Ladoo Packaging(3).png` | attached `Ragi Ladoo Packaging.png` | 1086 × 1448 |

| `Nutri Bar Packaging(3).png` | attached `Nutri Bar Packaging2.png` | 1145 × 1374 |

| Additional attached range photograph | `cfp-snack-basket-arrangement.jpg` | 1024 × 764 |

The original range PNG is the opening anchor. The separate supplied JPG remains archived but is not rendered, since it depicts the same arrangement. Every displayed image appears exactly once: one overview, four children’s products and four adult products.

## Verification

All 13 asset integrity, audit engine/storage and enquiry regression tests passed. `npm run lint`, `npm run typecheck` and `npm run build` passed. Local production HTTP checks passed for nine routes, both permanent redirects, unknown-project 404 and all 32 manifest assets.

Browser verification passed at 1440 px desktop, 820 px tablet, 390 px mobile and 320 px narrow mobile: deliberate grid changes, all nine unique images loaded, original contain proportions, no horizontal overflow, Work card routing and shared navigation. No browser errors or warnings were observed. Screenshots are saved in `artifacts/cfp-concise-desktop.jpg` and `artifacts/cfp-concise-mobile.jpg`.

Reduced-motion/no-JavaScript behavior is reviewed in the existing animation and fallback code; the browser adapter does not expose those emulation settings. The numbered filename variants are absent literally, but all requested products are represented by the inspected, documented supplied originals above. No packaging artwork remains missing.

## Concise revision

The page is shortened to the hero, brief/scope, two audience panels and outcome. Nine unique images are rendered once each. Parallax runs on native scroll with smaller mobile travel and is disabled for reduced motion. No assets are regenerated or cropped.

Revision verification: browser DOM contains exactly nine images with nine unique sources and 102 words across paragraph elements. Desktop parallax changes between scroll positions; mobile offsets stay within +/-10 px. No mobile horizontal overflow was observed. Production build, lint and TypeScript pass.

Revision verification: browser DOM contains exactly nine images with nine unique sources and 102 words across paragraph elements. Desktop parallax changes between scroll positions; mobile offsets stay within +/-10 px. No mobile horizontal overflow was observed. Production build, lint and TypeScript pass.
