# More Worldwide Exim: case study

Canonical route: `/work/more-worldwide-exim`. Home, Work and next-project navigation all use the single central project record in `src/data/projects.ts`, so the client is expanded rather than duplicated.

## Confirmed scope

The user supplied four catalogue PDFs, a corrected logo lockup and the live site:

- The website `moreworldwideexim.com`, built by the studio for the exporter.
- Four print catalogues for herbal and fruit powders, natural minerals (alum/fitkari), incense sticks and rose water, also downloadable on the live site.
- A corrected logo: the earlier mark did not resolve into the letters M, W and E.

Products are Indian wellness and personal-care goods: moringa and beet powders, rose water, incense sticks and natural minerals.

Do not claim measured export volumes, buyer counts, awards or other commercial results. Do not claim creation of the parent company itself; the studio corrected the logo and produced the catalogues and website.

## Layout and theme

The page reuses the editorial bento layout (`.avaia-case-study` in `src/app/avaia.css`), themed to the brand indigo with `.avaia-case-study[data-theme="mwe"]`. Two additions were made to the shared renderer:

- `study.titleLines` replaces the previously hardcoded AVAIA heading, so each study supplies its own two-line title.
- `study.links` renders optional external project links under the services list.

`EditorialCaseStudyPage` sets `data-theme={project.theme}` on the article; AVAIA keeps its cream/brown palette, More Worldwide Exim uses light indigo (`#e9ecfa`) on `#f6f7fc`.

## Artwork and provenance

Sources live in the adjacent `02 More World Wide` studio folder. `scripts/import-mwe.py` reproduces the import, is idempotent (it replaces its own `mwe-*` records and leaves every other manifest byte untouched) and refuses to overwrite differing copies.

| Asset ID | Source | Handling |
| --- | --- | --- |
| `mwe-lockup` | `MWE Logo Files/Full Lockup/png/lockup-colour_MWE.png` | Copied unchanged; identity and project cover |
| `mwe-icon` | `MWE Logo Files/Icon/png/Icon-colour_MWE.png` | Copied unchanged; corrected monogram |
| `mwe-wordmark` | `MWE Logo Files/word mark/Png/word-colour_MWE.png` | Copied unchanged |
| `mwe-moringa` | `website/moringa.png` | Flattened onto white, resized to 1500 px wide, JPEG 86 |
| `mwe-range` | `website/beetroot.png`, `rose water.png`, `inscense.png`, `fitkari.png` | Flattened onto white, 2×2 sheet, JPEG 86 |
| `mwe-catalogues` | `website/*.pdf` page one | Rendered covers, 2×2 sheet, JPEG 88 |

The catalogue PDFs are **not** re-hosted: the incense and rose files are 21 MB and 30 MB, and the live site already serves all four. Page-one covers are rendered only for the family sheet.

## Checks

`npm run lint`, `npm run typecheck`, `npm test` (13/13) and `npm run build` pass; `/work/more-worldwide-exim` is prerendered by `generateStaticParams`. `tests/assets.test.ts` re-hashes every registered public file, including the six `mwe-*` records.
