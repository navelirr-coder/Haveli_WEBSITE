# Verification: 17 October 2026

## Automated checks

- `npm test`: 13 tests passed. Includes 500 mixed-questionnaire comparisons against the original source engine, exact preservation of all 25 questions/options/order, score boundaries, strict gap threshold, original validation, legacy IndexedDB record compatibility, save/list/delete/count/clear operations, CSV schema/escaping, honest enquiry delivery behavior and supplied-artwork hashes.
- `npm run lint`: passed with no warnings or errors. Preserved database Promise signatures have a narrowly scoped unused-argument exemption.
- `npm run typecheck`: passed. The final production build also completed its TypeScript check.
- `npm run build`: passed with Next.js 16.4.2 using webpack. All five primary routes and four statically generated case studies were produced. Turbopack was replaced after its CSS worker failed on this Windows host; the Next.js stack is unchanged.
- `node scripts/check-routes.mjs`: nine page routes returned 200; unknown case study returned 404; all pages contain shared navigation, main landmark and skip link; ten original asset URLs returned 200; unconfigured enquiry returned 503 with an explicit not-sent response.

## Browser verification

Tested against the production server in the in-app browser.

- Desktop home, selected work, portfolio filtering, case-study navigation and original artwork loading checked at 1440 × 1000.
- All nine page URLs checked at 320 × 740: document width equalled available viewport width on every route, with no horizontal overflow. Headline wrapping and the selected-work link were corrected based on these checks.
- Home and audit inspected at 390 × 844. Mobile navigation opens with Enter, traps focus in its native dialog, closes with Escape and restores focus to its trigger.
- Audit: blank contact form prevented continuation and focused the first invalid field. Valid contact details led to the original strategy questions. Unanswered questions blocked continuation. Going backward and forward retained contact values and selected answers.
- All 25 questions completed using yes/5 responses. The original six-second processing state appeared; result was exactly 100/100, `Brand elite`, gaps `None`, with the expected category subtotals and all 25 report answers.
- Local save succeeded. After page reload, the original client-side admin gate rejected an incorrect password and accepted the existing password. The saved QA record and complete report remained available.
- CSV downloaded successfully with the original filename pattern and original ten-column header. Deletion confirmation was opened and cancelled, keeping the record intact. Actual deletion/clear operations were verified in isolated fake IndexedDB tests, without deleting browser data.
- Contact: invalid entries produced field errors; a valid enquiry with delivery unconfigured reported that it was not sent and retained the entered values. No real submission service was contacted.
- The original `window.prompt` admin entry was replaced with an accessible password dialog after the embedded browser reported that native prompts are unsupported. The same gate and local-record features are preserved.
- Reduced-motion handling is present in GSAP matchMedia, MotionConfig and CSS; an OS reduced-motion preference was not changed/emulated during testing.

## Artifacts and remaining configuration

Screenshots: `artifacts/home-desktop.jpg` and `artifacts/home-mobile.jpg`.

The browser contains one clearly named synthetic record, `QA Test Brand`, used for completion/persistence verification. No pre-existing records were deleted or changed. A test CSV was downloaded to the browser's normal download location.

No deployment was performed. Run `npm run dev` to preview locally. Enquiry delivery requires a real `ENQUIRY_WEBHOOK_URL`, with optional server-side token, as described in README.md. A standalone web logo and final webfonts can be integrated progressively; existing logo artwork was not reconstructed.
