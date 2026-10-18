# HAVELI signature intro and navigation

## Artwork and font status

The user supplied `HAVELI Branding/HAVELI TYPEFACE.png` (12,427 × 5,598 px, RGBA) and `Downloads/french_croissant/French Croissant Demo.otf`. The font package's `Read me!.txt` explicitly says: **“This font is for PERSONAL USE. No commercial use allowed!”**

Consequently the demo font is not embedded, redistributed or represented as licensed for the studio website. The animation uses the user's authentic HAVELI artwork itself. It neither substitutes an unrelated font nor reconstructs the lettering.

The original PNG is copied unchanged to `public/assets/studio/HAVELI TYPEFACE.png`. `HAVELI TYPEFACE.web.png` is a documented display derivative: only fully transparent outer padding is trimmed, with eight source pixels retained around the ink, then the image is proportionally resampled to 2,400 × 680 px. The original letterforms, magenta colour and transparency are preserved. Source hash, dimensions, role and transformation are in `src/data/assets.json`. `scripts/import-signature.py` reproduces the import and refuses to overwrite differing originals.

If a suitable licensed font and web-embedding rights are provided, add it under `public/fonts/haveli/`, configure `next/font/local` or `@font-face`, and replace only the content of `.signature-wordmark`. Keep the shared anchor, intrinsic aspect ratio and transition hook. The current artwork is authentic, not a placeholder font.

## Files and behavior

- `src/components/signature-hero.tsx`: full-viewport homepage section with a semantic HAVELI heading; no visible copy, illustration, CTA or scroll instruction.
- `src/components/navigation.tsx`: one persistent visual wordmark anchor in the global header, shared across every route. Home has no second visual logo in its hero. Navigation retains its five routes, native dialog menu and keyboard access.
- `src/components/use-signature-transition.ts`: GSAP/@gsap/react and ScrollTrigger controller. Measures the compact slot after fonts and the image settle; derives the full-size position; interpolates a gentle curved trajectory and a uniform scale. Native scrolling drives progress without pinning or hijacking.
- `src/data/signature.ts`: artwork ID and tuning values. Intro width is 84% of the viewport, capped at 1,360 px; navigation completion takes at most 0.46 seconds and less when partly docked.
- `src/app/signature.css`: centered server-rendered fallback, fixed transparent home header, compact sticky secondary-page header, navigation reveal and responsive sizing.
- `src/app/page.tsx`: the old text/masks/CTA hero is replaced by the signature intro. The manifesto, work, services, process, audit and contact sections are retained.

ScrollTrigger drives a single progress state. Rapid clicks update one pending destination instead of launching competing wordmark transitions. Keyboard focus or activation of the wordmark can bring the navigation into view. A route click completes the current travel before client-side navigation; secondary-route navigation does not wait for an intro.

Returning to Home at the top can reverse from the compact wordmark into the centered intro. An initial load at an existing scroll position uses the corresponding scroll progress. ResizeObserver and viewport resize recalculate the compact slot/trajectory without continuously animating layout properties. Match-media cleanup removes ScrollTriggers, observers, listeners and tweens on route/unmount/preference changes.

Explicit header/menu route clicks reset to the top after the destination commits. The reset is scoped to the recorded clicked destination, so browser Back/Forward restoration is preserved.

Reduced motion uses an immediate simplified docking transition. Without JavaScript, CSS renders the authentic wordmark and a noscript navigation fallback keeps all five destinations available; the large wordmark scrolls away with the intro instead of covering the page.

## Verification

Production build, TypeScript, ESLint and all 13 regression tests passed. Final combined local production HTTP checks passed for nine routes, permanent AVAIA and CFP redirects, unknown-project 404, all 32 manifest assets and the unconfigured enquiry response.

Browser checks covered the initial desktop/mobile intro, intermediate and completed travel, reverse scrolling, returning Home, compact secondary routes, keyboard activation, rapid route clicks, mobile dialog Escape/focus restoration and resizing between 320, 390 and 1440 px. One visual wordmark remained present and no horizontal overflow or browser errors were observed. Reduced-motion and no-JavaScript fallbacks were reviewed in code; the available browser tooling did not expose preference or JavaScript emulation. Screenshots are saved under `artifacts/`.

## Homepage brand direction

The intro background now blends white, chartreuse green and subtle yellow using native CSS gradients, while keeping only the authentic HAVELI artwork visible. The homepage narrative, process, audit invitation and contact CTA focus on attention, bolder brand expression, community and the excitement of experiencing a brand. Heading weights and supporting text are strengthened within the homepage scope. The shared footer uses the same attention/belonging voice. The logo transition itself remains unchanged.
