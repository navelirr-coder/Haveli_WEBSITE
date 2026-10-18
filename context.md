# Studio Haveli: Project Context

Updated: 18 October 2026 (Asia/Calcutta).

This file records the current implementation and decisions for continuing work in this checkout. New user instructions take precedence over this snapshot.

## Project and brand direction

Studio Haveli is an independent branding and identity practice. The website was created from an initially empty website folder; an existing Brand Audit implementation was recovered from adjacent source files and preserved.

The studio is a space for people who dare to be specific: authentic people with a voice of their own who want to build a space that accurately represents that voice and their narrative. The homepage expresses this through:

> For people who dare to be specific.

Keep the voice calm, direct and plain. Talk about voice, story, space, everyday life, authenticity and belonging. Do not position the studio with "bold", "turn heads", "attention", "impact" or hype. Avoid invented commercial results, client quotes or unsupported claims. Use authentic supplied artwork, with proportional sizing and legible product information.

## Stack and commands

- Next.js 16.4.2 App Router; React 19.3.1; TypeScript 6.
- Tailwind CSS 4 and custom CSS.
- GSAP 3.15, ScrollTrigger and `@gsap/react` for coordinated movement.
- Motion for React for interface interactions; Lucide icons.
- npm scripts use webpack because Turbopack's CSS worker failed in this Windows environment.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Default local URL: `http://127.0.0.1:3000`. QA used an owned production preview on port 3001 to avoid interfering with an existing port 3000 process. The owned QA server was stopped after verification. No hosting destination or deployment has been configured.

## Routes and architecture

| Route | Purpose |
| --- | --- |
| `/` | Signature intro, studio statement, selected work, services, process, audit invitation, contact |
| `/services` | Studio services |
| `/work` | Portfolio and category filtering |
| `/work/choudhary-farm-products` | CFP packaging case study |
| `/work/avaia-mind-clinic` | AVAIA identity case study |
| `/work/more-worldwide-exim` | More Worldwide Exim identity and catalogue case study |
| `/brand-audit` | Preserved audit logic with a redesigned React interface |
| `/contact` | Enquiry form |
| `/api/enquiry` | Server-side delivery endpoint |

`/work/cfp` permanently redirects to `/work/choudhary-farm-products`; `/work/avaia` permanently redirects to `/work/avaia-mind-clinic`. Unknown project slugs return 404. The Studio Haveli and YUGMA project records were removed on 18 October 2026; their `/work/studio-haveli` and `/work/yugma` URLs now 404. Supplied artwork for them remains in `public/` and the asset manifest.

Key files:

- `src/data/projects.ts`: central portfolio records, canonical slugs and optional case-study variants.
- `src/data/assets.json`: 38 asset records, including source paths, dimensions, filenames, hashes and provenance.
- `src/data/site.ts`: shared navigation, services and supplied studio email.
- `src/app/work/[slug]/page.tsx`: shared project routing, renderer selection, metadata and legacy redirects.
- `src/components/project-card.tsx`: shared portfolio cards.
- `src/components/animation-stage.tsx`: scoped GSAP reveals and CFP parallax, with route/preference cleanup.
- `src/components/navigation.tsx`, `footer.tsx`, `ui.tsx`: shared navigation, footer and reusable links/contact ribbon.

## Homepage and signature transition

The initial viewport contains only the authentic HAVELI wordmark. There is no visible tagline, CTA, illustration or scroll instruction in the hero. Its backdrop is a flat maroon (`--burgundy`, no gradient).

One persistent visual wordmark travels from the centre of the viewport into the navigation using uniform scale and a curved GSAP trajectory. Native scrolling drives ScrollTrigger progress; there is no scroll hijacking or pinning. Navigation fades in as the mark docks. Secondary routes show the compact mark; returning Home at the top can reverse the transition.

Explicit header/menu route clicks synchronise the transition and reset the destination to the top. Next.js automatic link scrolling is disabled for these clicks to avoid competing scroll behavior. The reset is scoped to the clicked destination, preserving browser Back/Forward restoration.

Implementation:

- `src/components/signature-hero.tsx`
- `src/components/use-signature-transition.ts`
- `src/components/navigation.tsx`
- `src/data/signature.ts`
- `src/app/signature.css`
- `src/app/page.tsx`

The controller waits for fonts/image decoding, remeasures on resize, cleans up triggers/listeners/tweens, respects reduced motion and includes a no-JavaScript navigation fallback. Keep reveal transforms separate from parallax/shared-wordmark transforms.

Homepage copy now centres on attention, bold expression, belonging and excitement. The whole site uses one understated sans-serif family (`--font-sans`/`--font-display`, Helvetica Neue → Arial) with no bold weights (400/500 maximum), scoped under `.home-page` where needed. On the homepage the maroon audit invitation uses a vivid orange (including the lighter 300-weight display heading and `25` count), while the chartreuse services section uses eggshell-white text. The reusable ContactRibbon accepts optional copy props; other callers retain their defaults. The shared footer uses the same attention/belonging voice.

### Wordmark licensing

The user supplied `HAVELI Branding/HAVELI TYPEFACE.png` and `Downloads/french_croissant/French Croissant Demo.otf`. The font package explicitly permits personal use only, so the demo font is not embedded or redistributed.

The original PNG is retained unchanged. A proportional display derivative trims only transparent outer padding. The actual supplied lettering is used instead of substituting a font. `scripts/import-signature.py` reproduces the import. See `docs/SIGNATURE.md` for details and the future licensed-font integration point.

## CFP: latest revision

The displayed name is **Choudhary Farm Products**, following the latest supplied copy. The adjacent source folder is spelled `Choudhari Farm Products CFP`; preserve source paths as they exist.

The user explicitly asked to reduce content, show every image once and add parallax. The current page is therefore intentionally shorter than the original detailed brief:

1. Hero with the original product-range PNG.
2. Concise brief and three scope items.
3. Children's range: short explanation and four savoury product images.
4. Adult range: short explanation and four treat images.
5. Short outcome, Work link and actual next-project link.

The browser DOM contained **nine images with nine unique sources** and **102 words across paragraph elements**. Do not restore the removed repeated showcase, challenge/thinking essays or long intent lists without a new request.

The separate supplied basket JPG is retained on disk but omitted from the page because it repeats the opening composition. All eight individual product images appear once. The numbered filename variants mentioned in the original task are absent literally; inspected equivalents and explicitly attached adult images are mapped in `docs/cfp-asset-inventory.json`.

Parallax moves complete figures, including captions, within reserved vertical space. Desktop travel is up to +/-22 px, mobile up to +/-10 px, with alternating directions and scrubbed native scrolling. Reduced motion disables it. Artwork remains uncropped and proportional. Reveal and parallax use separate elements to avoid transform conflicts.

- Content/types: `src/data/cfp.ts`
- Renderer: `src/components/packaging-case-study.tsx`
- Layout: `src/app/packaging.css`
- Parallax: `src/components/animation-stage.tsx`
- Original import: `scripts/import-cfp.py`
- Full source mapping: `docs/CFP-CASE-STUDY.md`

Confirmed scope is packaging strategy, packaging design and product differentiation. Do not claim creation of the parent company logo or complete brand identity, production testing, or measured sales results.

## AVAIA Mind Clinic

The canonical page uses an editorial cream/brown bento layout with supplied narrative, complete phoenix artwork, visiting cards, banner, letterhead and custom lettering specimen. Content is in `src/data/projects.ts`; layout uses `src/components/editorial-case-study.tsx` and `src/app/avaia.css`.

Original PNG/PDF files are retained unchanged. Large-format artwork has a documented proportional web derivative; PDFs were rendered and visually inspected. The typography PDF is a specimen, not an installable font. No corresponding AVAIA webfont was found or claimed.

See `docs/AVAIA-CASE-STUDY.md`, `docs/avaia-asset-inventory.json` and `scripts/import-avaia.py`.

## More Worldwide Exim

The canonical page at `/work/more-worldwide-exim` reuses the editorial bento layout (`.avaia-case-study`), themed to the client's indigo through `[data-theme="mwe"]` in `src/app/avaia.css`. The heading now comes from `study.titleLines`, and optional `study.links` render external project links.

Confirmed scope: the website `moreworldwideexim.com`, four print catalogues (herbal and fruit powders, natural minerals/alum, incense sticks and rose water) and a corrected logo whose monogram now reads M, W and E. The catalogues stay downloadable on the live site; this checkout does not re-host the PDFs, which are 1-30 MB. Instead, page-one covers become one two-by-two family sheet, and supplied product photography is flattened onto white and resized.

Supplied logos are copied unchanged from `02 More World Wide/MWE Logo Files`. Nothing is redrawn, and no commercial results are claimed. See `docs/MWE-CASE-STUDY.md` and `scripts/import-mwe.py`.

## Asset rules

Keep original artwork, names and provenance. Import scripts refuse to overwrite differing originals; the base import script retains progressive manifest additions. Do not regenerate, redraw or silently substitute packaging/identity assets. Use contain sizing where packaging edges, characters, labels or callouts must remain visible. Do not treat PDFs as font files.

Source studio directories are adjacent to this checkout. Relevant sources include `HAVELI Branding`, `00 AVAIA`, `Choudhari Farm Products CFP/CFP_Website` and `02 More World Wide`. Asset imports should target this website's `public/` tree, leaving originals intact.

## Brand Audit and enquiries

Original audit files are archived under `reference/brand-audit/`. Preserve scoring/report function bodies, all 25 questions and their order/options, validation, interpretation bands, below-three gap threshold, processing interval, IndexedDB schema, admin gate, reports and CSV behavior. The client-side admin gate is not server authentication. Records are local to the browser origin; changing port/domain does not migrate them automatically.

Every enquiry is saved to SQLite (`data/enquiries.db` by default) before notifications run. The record is the source of truth, so a notification outage never loses an enquiry; the route reports success only when the record is stored or a configured channel accepted it, and returns 503 otherwise. WhatsApp notifications use CallMeBot (`WHATSAPP_CALLMEBOT_APIKEY`) or the Meta Cloud API (`WHATSAPP_ACCESS_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID`), with `WHATSAPP_TO` for the recipient. The studio number appears only inside the `wa.me` href, never as page text. `npm run enquiries` prints recent records. SQLite is a local file, so a serverless deployment needs a persistent volume or a hosted database. See `docs/ENQUIRIES.md`.

## Verification and review artifacts

Latest revision: ESLint, TypeScript, all 15 tests and the production build passed. Route checks covered the homepage, work index, services, both project pages, the 404s for the removed projects and the legacy redirects.

The 15 regression tests pass, including artwork integrity, audit equivalence across 500 mixed questionnaires, IndexedDB behavior, enquiry storage and WhatsApp/webhook notification.

Browser checks covered desktop/mobile layout, 320 px overflow, shared navigation, single-wordmark behavior, nine unique CFP images and changing parallax transforms. No browser warnings/errors were observed. Reduced-motion and no-JavaScript fallbacks were reviewed in code; the browser adapter did not expose those emulation settings. This revision verified the flat maroon hero background (computed `rgb(90,15,27)`, no background image, no decoration nodes) and the single-sans typography (computed weight 400).

Current review images:

- `artifacts/home-gradient-desktop.jpg`
- `artifacts/home-copy-desktop.jpg`
- `artifacts/cfp-concise-desktop.jpg`
- `artifacts/cfp-concise-mobile.jpg`
- `artifacts/avaia-opening-desktop.jpg`
- `artifacts/avaia-gallery-desktop.jpg`

Older screenshots may show superseded homepage colours or the longer CFP layout. See `README.md` and `docs/` for setup and deeper implementation details.

## Separate CFP storefront follow-up

A later request targets the adjacent `../Choudhari Farm Products CFP/CFP_Website/` storefront, which uses static HTML/CSS/JavaScript with an Express backend. Do not confuse it with Studio Haveli's Next.js homepage or portfolio case study.

Only storefront Hero Slide 1 was redesigned as a responsive editorial grid, with the exact supplied headline/support/Shop CTA. Slides 2-3, original carousel logic, shared styles, header, cart/login, backend and other homepage sections remain unchanged.

The user also supplied two turmeric photos. These now appear on the storefront's turmeric cards and detail pages with export-quality bulk-supply copy and Enquire for MOQ actions. Product-specific contact prefills open an email draft for the buyer to review/send; no backend delivery is claimed and no email was sent during QA. No numeric MOQ or certification was invented.

The applied changes, original backups, validation and known pre-existing mobile overflow below the hero are documented in `docs/CFP-STOREFRONT-UPDATE.md`. Review tooling is under `tools/cfp-storefront-update/`. All ten applied files and served responses were hash-verified; browser checks covered desktop/tablet/mobile and enquiry navigation. No production database/migrations were started.
