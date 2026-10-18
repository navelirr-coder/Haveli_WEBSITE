# Studio Haveli: pre-implementation audit

Inspected 17 October 2026, before creating or modifying application code.

## Starting state and source discovery

The selected `Haveli WEBSITE` directory was empty, including hidden files. There was no Git repository, Next.js application, package manifest, lockfile, route, reusable React component, test or build script. The user confirmed there is no pre-built website and requested a new build.

The existing Brand Audit was found in the adjacent `../HAVELI Branding/brand audit/` directory. `../survey.html` is an A4 print-oriented diagnostic/manifesto and is **not** the interactive audit. No files in these source directories will be changed. Preserve a byte-identical snapshot under `reference/brand-audit/` before migrating presentation.

## Existing audit file map

| File | Purpose and dependencies |
| --- | --- |
| `index.html` | Contact form; 25 fieldsets in fixed order, category/question data attributes and answer values; score/loading elements; admin table and controls. Loads db.js, app.js, export.js, admin.js in that order. |
| `app.js` | DOMContentLoaded controller. Contact and completeness validation; answer extraction; scoring, gap summary, diagnostic report; six-second processing delay; score interpretation; record construction; older duplicate admin/report rendering. |
| `db.js` | IndexedDB database `studio_haveli_db`, version 1, `clients` object store, auto-increment `id`. Initializes on script load. Implements save, list, delete, clear and count. No network persistence. |
| `admin.js` | Effective admin UI: replaces the access button to remove app.js listeners; password prompt; newest-first records; delete confirmation; detailed report modal. React migration must preserve deletion and report inspection. |
| `export.js` | CSV download of all locally stored clients, including contact data, website, score, missing areas, ISO date and per-question report. Filename `studio_haveli_leads_YYYYMMDD_HHMM.csv`. |
| `style.css` | Standalone light UI, Google font imports, mobile rules and animations. Brand palette already matches the brief. Presentation may be replaced; logic may not. |

## Questions, validation and flow

25 questions, all required. Preserve exact wording, order, category identifiers and option values. Strategy q1-q5; identity q6-q10; stationery q11-q14; packaging q15-q19; website q20-q23; trust q24-q25. Binary questions: q1, q6, q8, q11, q13, q15, q18, q20 (`yes`/`no`). All others use `1`-`5`.

Name: trimmed, at least two characters, not purely numeric; source markup max 50. Business: trimmed, at least two characters; source max 100. Phone: exactly ten digits. Email: existing simple non-whitespace address pattern. Website: optional, must pass `new URL`. All questions must be answered before calculation. Existing UI is one long form; there is no branching, multi-step state, framework store, API or integration.

DOM is the source of truth. Calculate validates, locks the button, shows loading, waits six seconds, then extracts answers, calculates the score, generates gaps/report, displays the result and writes a client record. The migration will retain the delay and order while snapshotting valid inputs to prevent edits during calculation and properly awaiting persistence.

## Business rules to preserve

- `yes` = 4 points; `no` = 0; numeric answers = value minus 1. Sum is clamped to 0-100. 25 questions × 4 = 100.
- Gap analysis maps yes/no to 5/1 and uses the raw scale value. A category is a gap only when its average is **strictly below 3**. Output is capitalized category names joined with `, ` or `None`.
- Report is an ordered array of `{ question, answer }`, answers uppercased.
- Scores 0-20: `Brand structurally weak`; 21-40: `Brand needs major improvement`; 41-60: `Brand average`; 61-80: `Brand strong`; 81-100: `Brand elite`.
- Stored fields: id, name, business, phone, email, website, answers (existing fallback `{}`), score, gaps, diagnosticReport, createdAt (ISO).
- Preserve database name/version/store/key, save/list/delete/clear/count capability, newest-first ordering, report viewing and CSV schema. Never clear existing records on mount, completion or restart.

## Conflicts and limits identified before changes

1. New Next.js App Router shell must host an audit previously built with direct DOM listeners. Separate the original calculations from React presentation. Keep reference source for comparison tests.
2. app.js and admin.js both attach export listeners; admin.js replaces the access button but not the export button. Consolidate effective behavior into one React action per control, avoiding duplicate downloads.
3. Original save promise is not awaited, so it can claim completion when storage fails. Preserve results and provide honest save status/retry without submitting duplicate records.
4. Original admin password is a client-side convenience gate, **not server authentication**. Preserve local functionality; do not create a publicly accessible shared lead database. Records remain browser-local.
5. IndexedDB is origin-scoped. Keeping the schema preserves same-origin data, but `file://`, another port or another domain cannot automatically share records. CSV remains available from the original app for exports.
6. No enquiry delivery service or credentials exist. Build validation and a server endpoint that returns an explicit unconfigured response until configured; never show false success.
7. Identity assets are adjacent to the initially empty workspace. Catalogue source paths, inspect selected artwork and copy only used assets with original basenames; preserve source bytes. Full client strategy, briefs, outcomes and credits have not been supplied; omit those sections.
8. Logo artwork is present inside paired business-card exports, and Illustrator sources exist. Until a standalone web logo is supplied, navigation uses the studio name as ordinary text, not a reconstructed logo. Do not crop/repaint card artwork into a new logo.

## Implementation sequence

1. Audit and source snapshot, inventory and asset roles (this document and asset manifest).
2. Foundation: Next.js, TypeScript, Tailwind, shared palette/type/spacing, responsive accessible navigation, footer and reduced-motion handling.
3. Home: expressive typographic hero, supplied mask artwork, manifesto, selected work, services, process, audit and enquiry paths.
4. Work: typed project source, image-led grid and optional-section case-study template. Only show verified artwork/content.
5. Services and Contact: four supplied categories, contextual work links, accessible enquiry form and honest configured/unconfigured responses.
6. Audit: extract existing engine, preserve question data and local database behavior; step-based accessible presentation, results, local admin/report/export actions.
7. Verify: engine equivalence and boundaries, validation, persistence, error feedback, primary/case-study routes, desktop/mobile navigation, keyboard and reduced motion; lint, types and production build.

Reference: https://www.elespacio.net/; inspected for presentation inspiration. No reference content or client work is copied.
