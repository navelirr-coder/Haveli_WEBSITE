"""Prepare a reviewable, narrowly scoped patch for the sibling CFP storefront."""
from pathlib import Path
from hashlib import sha256
import re
import json
import shutil

stage = Path(__file__).resolve().parent
source = stage.parents[1].parent / "Choudhari Farm Products CFP/CFP_Website"
originals = {}

def load(name):
    content = (source / name).read_bytes()
    originals[name] = sha256(content).hexdigest()
    return content.decode("utf-8")

def save(name, content):
    (stage / name).write_bytes(content.encode("utf-8"))

index = load("index.html")
hero = '''        <article class="hero-slide hero-slide-full-screen cfp-campaign-slide" aria-labelledby="cfp-campaign-headline">
          <div class="cfp-campaign-grid">
            <figure class="cfp-campaign-panel cfp-campaign-texture"><img src="CFP_Slide1.png" alt="Crunchy millet snacks with visible seasoning and crumbs" width="1672" height="941" fetchpriority="high"></figure>
            <div class="cfp-campaign-panel cfp-campaign-support"><p>With the goodness of millets for every snacking.</p></div>
            <figure class="cfp-campaign-panel cfp-campaign-bowl"><img src="CFP_Slide2.png" alt="A hand reaching into a bowl of mixed millet snacks outdoors" width="1672" height="941" fetchpriority="high"></figure>
            <figure class="cfp-campaign-panel cfp-campaign-grain"><img src="ingredient-seeds.jpg" alt="Pumpkin and sunflower seeds in a wooden scoop" width="600" height="600"></figure>
            <div class="cfp-campaign-panel cfp-campaign-main">
              <p class="cfp-campaign-label">INDIAN MILLETS. EVERYDAY CRUNCH.</p>
              <h1 class="cfp-campaign-headline" id="cfp-campaign-headline"><span>Seriously good</span><span>Snacking.</span></h1>
              <a class="cfp-campaign-shop" href="shop.html">SHOP THE GOODNESS →</a>
            </div>
            <figure class="cfp-campaign-panel cfp-campaign-nuts"><img src="ingredient-nuts-seeds.jpg" alt="Nuts, seeds and grains in close-up" width="700" height="700"></figure>
            <figure class="cfp-campaign-panel cfp-campaign-product"><img src="Jowar%20Chips%20Product%20image.png" alt="Original CFP Jowar Chips pouch with its green label and illustrated character" width="1379" height="1141"></figure>
          </div>
        </article>'''
match = re.search(r'        <article class="hero-slide hero-slide-full-screen" style="position: relative;">.*?</article>', index, re.S)
assert match, "Original Slide 1 changed; inspect before preparing again"
if "\r\n" in index:
    hero = hero.replace("\n", "\r\n")
updated_index = index[:match.start()] + hero + index[match.end():]
updated_index = updated_index.replace('  <link rel="stylesheet" href="style.css">', '  <link rel="stylesheet" href="style.css">\n  <link rel="stylesheet" href="hero-slide-one.css">')
updated_index = updated_index.replace('  <script src="script.js"></script>', '  <script src="script.js"></script>\n  <script src="hero-slide-one.js"></script>')
save("index.html", updated_index)

shop = load("shop.html")
for key, title, filename, dimensions, description in [
    ("turmeric-fingers", "Turmeric Fingers", "Turmeric.jpg", (736,736), "Export-quality whole dried turmeric fingers for international buyers and bulk sourcing."),
    ("turmeric-powder", "Turmeric Powder", "Turmeric%20(1).jpg", (590,881), "Export-quality turmeric powder for international buyers and bulk sourcing."),
]:
    replacement = f'''        <article class="product-item-card" data-category="turmeric" data-product="{key}" style="display: none;">
          <a class="product-image-container" href="product-details.html?product={key}" aria-label="View {title} export details"><img class="turmeric-export-photo" src="assets/images/turmeric/{filename}" alt="{'Whole dried golden turmeric fingers' if key == 'turmeric-fingers' else 'Golden turmeric powder in close-up'}" width="{dimensions[0]}" height="{dimensions[1]}" loading="lazy"></a>
          <div class="product-card-body"><p class="turmeric-export-kicker">Export quality · Bulk supply</p>
            <a href="product-details.html?product={key}" class="product-title-link">{title}</a>
            <p class="product-short-desc">{description}</p>
            <div class="product-card-bottom"><a class="turmeric-export-cta" href="contact.html?enquiry={key}#contactForm">Enquire for MOQ →</a></div>
            <p class="turmeric-export-note">Contact us for minimum order quantity, packing and a quotation.</p>
          </div>
        </article>'''
    pattern = rf'        <article class="product-item-card" data-category="turmeric" data-product="{key}".*?</article>'
    shop, count = re.subn(pattern, lambda _:replacement, shop, flags=re.S)
    assert count == 1
shop = shop.replace('  <link rel="stylesheet" href="style.css">','  <link rel="stylesheet" href="style.css">\n  <link rel="stylesheet" href="turmeric-export.css">')
save("shop.html",shop)

details=load("product-details.html")
details=details.replace('  <link rel="stylesheet" href="style.css">','  <link rel="stylesheet" href="style.css">\n  <link rel="stylesheet" href="turmeric-export.css">')
details=details.replace('  <script src="script.js"></script>','  <script src="script.js"></script>\n  <script src="turmeric-export.js"></script>')
save("product-details.html",details)

contact=load("contact.html")
contact=contact.replace('<form onsubmit=', '<form id="contactForm" onsubmit=',1)
contact=contact.replace('  <script src="script.js"></script>','  <script src="script.js"></script>\n  <script src="turmeric-export.js"></script>')
save("contact.html",contact)

image_dir=stage/'assets/images/turmeric'
image_dir.mkdir(parents=True,exist_ok=True)
for filename in ["Turmeric.jpg","Turmeric (1).jpg"]:
    shutil.copy2(Path.home()/'Downloads'/filename,image_dir/filename)

# Guard unrelated carousel behavior and all existing catalogue/backend data.
unchanged={name:sha256((source/name).read_bytes()).hexdigest() for name in ['script.js','style.css','CFP_Slide1.png','CFP_Slide2.png','CFP_Slide3.png']}
files=['index.html','shop.html','product-details.html','contact.html','hero-slide-one.css','hero-slide-one.js','turmeric-export.css','turmeric-export.js','assets/images/turmeric/Turmeric.jpg','assets/images/turmeric/Turmeric (1).jpg']
manifest={'target':str(source),'originals':originals,'unchanged':unchanged,'files':files}
(stage/'patch-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print('Prepared four narrowly edited HTML files, four scoped support files and two unchanged supplied images.')
