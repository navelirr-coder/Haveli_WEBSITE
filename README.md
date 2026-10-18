# Studio Haveli

An original Next.js App Router website using React, TypeScript, Tailwind CSS, custom CSS, GSAP/ScrollTrigger, @gsap/react, Motion and Lucide.

## Run locally

Node 20.9+ and npm are required.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. For production: `npm run build`, then `npm start`.

The scripts use webpack because this Windows environment's Turbopack CSS worker failed to connect even outside the sandbox. This changes the bundler, not the requested Next.js stack.

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

## Routes and content

`/`, `/services`, `/work`, `/work/[slug]`, `/contact`, `/brand-audit`.

Projects live in `src/data/projects.ts`. Optional case-study fields include overview, brief, challenge, strategy, identity, applications, gallery and credits. Unsupplied sections are omitted. Asset metadata and original filenames live in `src/data/assets.json`; see `docs/ASSETS.md` for the progressive upload workflow. Navigation is shared in `src/data/site.ts`.

AVAIA Mind Clinic now has an editorial bento case study at `/work/avaia-mind-clinic`; `/work/avaia` redirects there. Its supplied narrative, assets and typography-specimen handling are documented in `docs/AVAIA-CASE-STUDY.md`.

The homepage uses one authentic HAVELI artwork element that travels into the global navigation as the visitor scrolls. See `docs/SIGNATURE.md` for the controller, fallbacks and font-license status. The supplied French Croissant demo font is personal-use-only and is not embedded.

The selected artwork is from the user's adjacent studio folders, copied without changes. All six source audit files are preserved under `reference/brand-audit/`, with hashes. See `docs/REPOSITORY-AUDIT.md` for the audit completed before implementation.

More Worldwide Exim now has an editorial bento case study at `/work/more-worldwide-exim`, covering the corrected logo, four export catalogues and the live website. See `docs/MWE-CASE-STUDY.md`.

## Brand Audit preservation

The three original scoring/report function bodies and all 25 question definitions were extracted from the snapshot using `scripts/extract-audit.mjs`. The original IndexedDB functions/schema are retained in `src/lib/audit/database.js`, with initialization exposed as an awaitable shared promise. The React UI is independent of these modules.

Preserved behavior: exact validation rules, question order/options/categories, score mapping and interpretation bands, below-three gap threshold, six-second processing interval, local records, admin password gate, newest-first list, deletion, full report and CSV columns/filename. The new UI also exposes category score breakdowns and save failures/retry. It keeps answers while moving between steps and during a failed operation.

The admin gate is the original client-side convenience gate, not server authentication. Lead records remain local to the current browser origin. Moving from `file://`, another domain or another port cannot carry IndexedDB across origins automatically. Export original records in the old app if needed; no records are silently imported or erased. Standalone offline installation/service-worker caching was not present in the source, and is not added here.

## Enquiries and WhatsApp

Every enquiry is written to a SQLite database before any notification is sent. The database lives at `data/enquiries.db` by default (change it with `ENQUIRY_DATABASE_PATH`). Read the latest records with `npm run enquiries`, or open the file with any SQLite tool.

Storage and notification are separate. A failed notification never loses the enquiry, and the database write is what lets the form report that the enquiry was received. If neither the database nor a notification channel is available, `/api/enquiry` returns HTTP 503 and explicitly says nothing was sent.

WhatsApp notifications use one of two server-side providers (see `.env.example`):

- **CallMeBot**: message the CallMeBot number once from the studio phone to receive a key, then set `WHATSAPP_CALLMEBOT_APIKEY`.
- **Meta WhatsApp Cloud API**: set `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`.

`WHATSAPP_TO` sets the recipient and defaults to the studio number. The number is never printed on the site; it appears only inside the `wa.me` link behind the WhatsApp icons. The `ENQUIRY_WEBHOOK_URL` / `ENQUIRY_WEBHOOK_TOKEN` pair still works alongside these.

SQLite is a local file. On a host with a read-only filesystem, point `ENQUIRY_DATABASE_PATH` at a persistent volume or replace the store with a hosted database. See [docs/ENQUIRIES.md](docs/ENQUIRIES.md).

No hosting account or domain was supplied. This checkout is a local implementation, ready for deployment to a Next.js-compatible host when a destination is selected.

CFP packaging case study: [implementation and source mapping](docs/CFP-CASE-STUDY.md).
