# CFP storefront: Slide 1 and turmeric export enquiries

Target: `../Choudhari Farm Products CFP/CFP_Website/` — the separate HTML/CSS/JavaScript CFP storefront, not the Studio Haveli portfolio homepage.

## Files applied

- `index.html`: only Slide 1's article is redesigned, plus references to its two scoped support files.
- `hero-slide-one.css`: seven-panel desktop editorial grid, four-panel mobile composition, live oversized display text, reduced-motion-aware entrance and focus/hover styles. The first-slide height override applies only while the original first indicator is active; other slides retain their original dimensions.
- `hero-slide-one.js`: observes the existing first-slide indicator to trigger entry motion and prevent the offscreen first-slide CTA from receiving focus. Original carousel code and timing remain intact.
- `shop.html`: only the two turmeric product cards are replaced, plus their scoped stylesheet reference. Snack product cards are byte-identical to the inspected originals.
- `product-details.html`: references the turmeric-only presentation stylesheet/script. Other product routes retain their existing presentation.
- `contact.html`: adds a form anchor and the turmeric enquiry helper. Ordinary contact visits retain their existing behavior.
- `turmeric-export.css`, `turmeric-export.js`: supplied turmeric photography, export presentation, correct breadcrumbs/title, and prefilled MOQ enquiries for the two known turmeric product keys.
- `assets/images/turmeric/Turmeric.jpg`: supplied whole turmeric fingers photograph, unchanged.
- `assets/images/turmeric/Turmeric (1).jpg`: supplied turmeric powder photograph, unchanged.

Four existing HTML files, four new support files and two supplied image files were applied. Original HTML backups and the typography refinement backup are in `tools/cfp-storefront-update/backups/` in the Haveli workspace. Copy guards prevent overwriting source files changed since inspection.

## Hero content and sources

The live headline is “Seriously good” / “Snacking.” Supporting copy is exactly “With the goodness of millets for every snacking.” The CTA reads “SHOP THE GOODNESS →” and links to the existing `shop.html` route.

Reused existing assets: `CFP_Slide1.png`, `CFP_Slide2.png`, `ingredient-seeds.jpg`, `ingredient-nuts-seeds.jpg`, and `Jowar Chips Product image.png`. CSS crops only suitable food areas of the campaign images; their baked lettering is outside the displayed crops. The product pouch uses contain sizing with its complete packaging visible. No photography or packaging was generated, redrawn or overwritten. No additional assets are required for this implementation.

Slides 2 and 3, the carousel controls, five-second auto-advance logic, original `script.js`, shared `style.css`, header, cart/login code, backend and catalogue prices/data remain unchanged. The later turmeric request explicitly expands the original hero-only scope to turmeric product presentation.

## Export enquiry behavior

Both turmeric cards and detail routes identify export-quality bulk supply and use “Enquire for MOQ.” No numeric MOQ, quotation, certification or laboratory specification is invented. Existing snack prices and purchase flows remain unchanged; the turmeric presentation uses enquiry actions instead of retail Add to Cart buttons.

Each MOQ link opens the existing contact page with the product-specific subject/message filled in. Export enquiry submission opens an email draft addressed to the business email already present on the site. The buyer reviews and sends it in their email app. No email was sent during verification.

The original generic contact form only displayed an alert. For these two export enquiries, the new helper replaces that handler with an explicitly labelled “Open email enquiry” action. This does not introduce or claim a working backend email service. Normal contact-page behavior is otherwise preserved.

## Verification

- JavaScript syntax checks passed for both new browser scripts.
- All ten applied files match the reviewed files and their local HTTP responses byte-for-byte.
- Shop, both turmeric detail routes and the enquiry route returned HTTP 200.
- Scope comparison confirmed that Slides 2–3, the header, carousel controls, remaining homepage markup and all eight existing snack cards are unchanged.
- Original carousel JavaScript, shared stylesheet and all three campaign PNGs retain their recorded SHA-256 hashes.
- Browser checks covered 1440 px desktop, 820 px tablet and 390 px mobile; the mobile hero prioritises headline/CTA and food photography. All new/reused hero and turmeric assets loaded.
- Shop CTA, Slide 2/3 controls, both turmeric detail pages, correct breadcrumbs and product-specific MOQ prefills were verified. No new browser console errors/warnings were observed.
- Reduced-motion behavior was reviewed in CSS; the browser adapter does not expose preference emulation.

The original mobile homepage already has a document width of 488 px at a 375 px client width due to content below the hero. The redesigned hero stays within the viewport. That unrelated page-width issue is preserved because the task restricts changes to Slide 1 and turmeric presentation.

QA served the actual frontend files through a read-only local preview. The production backend, migrations, payment services and backend mutation tests were not started or changed.

Screenshots:

- `artifacts/cfp-storefront-hero-desktop.jpg`
- `artifacts/cfp-storefront-hero-mobile.jpg`
- `artifacts/cfp-turmeric-export-desktop.jpg`
