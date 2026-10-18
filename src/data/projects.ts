import { asset, type Asset } from "@/lib/assets";
import { cfpStudy, type PackagingCaseStudy } from "./cfp";

export type ProjectCategory = "Brand identity" | "Packaging" | "Brand applications";
export type EditorialCell =
  | { kind: "image"; slot: "banner" | "primary" | "cards" | "letterhead" | "typeface" | "symbol"; asset: Asset; alt: string; caption: string; original?: Asset }
  | { kind: "text"; slot: "brief" | "challenge" | "concept" | "strategy" | "execution" | "outcome"; title: string; paragraphs: string[]; items?: string[] };
export interface EditorialCaseStudy {
  layout: "editorial-bento";
  titleLines: [string, string];
  sector: string;
  introduction: string;
  services: string[];
  links?: { label: string; href: string }[];
  cells: EditorialCell[];
  relatedSlugs: string[];
}
export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  descriptor: string;
  overview?: string;
  brief?: string;
  challenge?: string;
  strategy?: string;
  identity?: string;
  applications?: string;
  theme: "cfp" | "avaia" | "studio" | "yugma" | "mwe" | "trx" | "argi";
  cover: Asset;
  gallery: { asset: Asset; alt: string; caption?: string }[];
  credits?: { role: string; name: string }[];
  caseStudy?: EditorialCaseStudy;
  packagingStudy?: PackagingCaseStudy;
}

// Keep this source factual. No unsupplied dates, strategy, outcomes or credits.
export const projects: Project[] = [
  {
    slug: "titanreach-exim", name: "TitanReach Exim", category: "Brand identity", descriptor: "A three-headed elephant for an export house: strength in unity, navigating the deep blue.", theme: "trx",
    overview: "A complete identity for an export and import house trading dehydrated foods: strategy, a three-headed elephant mark, corporate stationery, industrial branding, branded tape, a website and product packaging.",
    cover: asset("trx-container"), gallery: [],
    caseStudy: {
      layout: "editorial-bento",
      titleLines: ["TITANREACH", "EXIM"],
      sector: "Export, import and dehydrated food products",
      introduction: "A distinctive identity for an export house, built on the elephant as a symbol of strength, wisdom and quiet authority rather than the usual ships, containers and globes.",
      services: ["Brand Strategy", "Visual Identity", "Corporate Stationery", "Website Design", "Packaging Design"],
      cells: [
        { kind: "image", slot: "banner", asset: asset("trx-container"), alt: "TitanReach Exim shipping container, in navy with the white three-headed elephant mark and TITAN REACH wordmark, lifted by a crane at port", caption: "01 / Industrial branding: A brand built to carry weight" },
        { kind: "text", slot: "brief", title: "The brief", paragraphs: ["The founders came with a blank page and a name: TitanReach Exim. The challenge was to build a distinctive identity in export and import, an industry where ships, containers and globes are used as visual shorthand.", "The brand needed to communicate strength, reliability, unity, ambition and reassurance without looking interchangeable with its competitors."] },
        { kind: "image", slot: "primary", asset: asset("trx-website"), alt: "The TitanReach Exim website shown open on a laptop on a studio desk, with the navy header, ivory body and the Why Choose Us grid", caption: "02 / The digital presence: titanreachexim.com" },
        { kind: "text", slot: "challenge", title: "The challenge", paragraphs: ["How do you create an identity that stands apart in an industry where so many brands speak the same visual language?", "The founders wanted a brand that could stand firm against challenges, navigate changing tides and reassure its customers through a strong, united presence."] },
        { kind: "text", slot: "concept", title: "The concept: a different kind of titan", paragraphs: ["The name Titan evokes grandeur and formidable strength. Rather than relying on conventional logistics imagery, the identity draws on the elephant as a symbol of power, wisdom, stability and quiet authority.", "The three-headed elephant represents strength in unity: a united front capable of facing challenges, adapting to uncertainty and moving forward with confidence."] },
        { kind: "text", slot: "strategy", title: "The visual language: navigating the deep blue", paragraphs: ["Deep navy blue establishes the identity's foundation, referencing the depth of the sea and the steadiness needed to navigate international trade.", "The elephant's raised trunks hold a globe and a compass. The globe represents international reach and connection across borders, while the compass represents direction, navigation and purpose."] },
        { kind: "image", slot: "cards", asset: asset("trx-stationery"), alt: "TitanReach Exim visiting cards and letterhead in navy and ivory, with the three-headed elephant mark, the TITANREACH EXIM wordmark and contact details", caption: "03 / Corporate stationery: Visiting cards and letterhead" },
        { kind: "text", slot: "execution", title: "The execution", paragraphs: [], items: ["Brand strategy", "Visual identity and mark", "Three-headed elephant symbol", "Visiting cards and letterhead", "Industrial branding (container)", "Branded packaging tape", "Website design", "Dehydrated food packaging"] },
        { kind: "image", slot: "letterhead", asset: asset("trx-mealkit"), alt: "More Eatzz dehydrated meal-kit pouch in olive green with vegetable line art, the More Eatzz wordmark and a Karela Sabji meal kit product shot", caption: "04 / Dehydrated food packaging: More Eatzz meal kits" },
        { kind: "image", slot: "typeface", asset: asset("trx-packaging"), alt: "Roll of navy TitanReach Exim branded tape above a kraft export carton sealed with repeated TITANREACH EXIM wordmarks and the elephant mark", caption: "05 / Branded packaging tape: Sealed and signed" },
        { kind: "image", slot: "symbol", asset: asset("trx-mark"), alt: "TitanReach Exim identity mark: a white line-drawn three-headed elephant with raised trunks holding a globe and a compass", caption: "06 / Strength in unity: The three-headed elephant" },
        { kind: "text", slot: "outcome", title: "The outcome", paragraphs: ["TitanReach Exim began with a name and an open brief. The resulting identity translates unity, resilience, direction and international ambition into a recognisable visual system that extends across corporate, industrial, digital and product applications.", "Not another brand built around moving cargo. A brand built around the strength to move forward."] },
      ],
      relatedSlugs: ["avaia-mind-clinic"],
    },
  },
  {
    slug: "aaradhyaa-global-impex", name: "Aaradhyaa Global Impex", category: "Brand identity", descriptor: "A gold A held inside a purple onion, for a dehydrated onion and garlic exporter.", theme: "argi",
    overview: "An identity for Aaradhyaa Global Impex, a merchant exporter of dehydrated onion and garlic from Jalgaon, Maharashtra: an emblem drawn from the product itself, a wordmark set in two serifs, and deep purple and gold throughout.",
    cover: asset("argi-vertical-stack"), gallery: [],
    caseStudy: {
      layout: "editorial-bento",
      titleLines: ["AARADHYAA", "GLOBAL IMPEX"],
      sector: "Dehydrated onion and garlic exports",
      introduction: "An identity for a merchant exporter of dehydrated onion and garlic, built around a mark drawn from the product itself and carried in deep purple and gold.",
      services: ["Brand identity", "Logo design", "Emblem and wordmark", "Typography", "Colour system"],
      cells: [
        { kind: "image", slot: "banner", asset: asset("argi-primary-logo"), alt: "The Aaradhyaa Global Impex primary horizontal lockup: a purple onion emblem holding a gold letter A with a flame at its centre, beside the Aaradhyaa wordmark and Global Impex beneath it", caption: "The primary lockup: onion emblem and wordmark" },
        { kind: "text", slot: "brief", title: "The company", paragraphs: ["Aaradhyaa Global Impex is a merchant exporter of dehydrated onion and garlic based in Jalgaon, Maharashtra, one of India's prominent agricultural regions.", "The range covers dehydrated onion flakes, chopped onion, onion powder, garlic flakes, chopped garlic and garlic powder, supplied to buyers across the globe."] },
        { kind: "image", slot: "primary", asset: asset("argi-vertical-stack"), alt: "The Aaradhyaa Global Impex stacked lockup, with the onion emblem centred above the Aaradhyaa wordmark and Global Impex", caption: "The stacked lockup, for square and narrow formats" },
        { kind: "text", slot: "challenge", title: "The mark", paragraphs: ["The emblem is drawn from the product itself: a gold letter A held inside a purple onion, with a flame at its centre.", "The mark also stands alone, so the identity reads without the wordmark beside it."] },
        { kind: "text", slot: "concept", title: "The colour", paragraphs: ["Deep purple carries the emblem and both wordmark lines. Gold is held back for the flame at the centre of the mark and for accent detail."] },
        { kind: "text", slot: "strategy", title: "The typography", paragraphs: ["Aaradhyaa is set in a display serif with full, rounded forms and a firm baseline.", "Global Impex is set beneath it in a lighter companion serif of higher contrast, so the two lines read as one lockup."] },
        { kind: "image", slot: "cards", asset: asset("argi-wordmark"), alt: "The Aaradhyaa Global Impex wordmark on its own, with Aaradhyaa above Global Impex in deep purple lettering", caption: "The wordmark: Aaradhyaa over Global Impex" },
        { kind: "text", slot: "execution", title: "The system", paragraphs: [], items: ["Primary horizontal lockup", "Vertical stacked lockup", "Wordmark", "Emblem on its own", "All-gold variation", "Purple, black and white icons", "Display and companion serifs"] },
        { kind: "image", slot: "letterhead", asset: asset("argi-icon-colour"), alt: "The Aaradhyaa Global Impex emblem alone: a gold letter A held within a deep purple onion, with a flame at the centre", caption: "The emblem: a gold A inside a purple onion" },
        { kind: "image", slot: "typeface", asset: asset("argi-typeface-display"), alt: "Specimen of the display serif used for the Aaradhyaa wordmark, showing the full alphabet from A to Z", caption: "The display serif, A to Z" },
        { kind: "image", slot: "symbol", asset: asset("argi-icon-gold"), alt: "The Aaradhyaa Global Impex emblem in the all-gold variation", caption: "The all-gold variation of the emblem" },
        { kind: "text", slot: "outcome", title: "The identity", paragraphs: ["One system across the emblem, the wordmark and the two serifs, in deep purple and gold."] },
      ],
      relatedSlugs: ["more-worldwide-exim"],
    },
  },
  {
    slug: "choudhary-farm-products", name: "Choudhary Farm Products", category: "Packaging", descriptor: cfpStudy.introduction, theme: "cfp",
    overview: "Packaging strategy, audience segmentation and product differentiation for a millet snack range spanning children’s savoury pouches and adult-oriented treats.",
    cover: asset("cfp-range"), gallery: [], packagingStudy: cfpStudy,
  },
  {
    slug: "avaia-mind-clinic", name: "AVAIA Mind Clinic", category: "Brand identity", descriptor: "An identity shaped by introspection, resilience and rebuilding.", theme: "avaia",
    overview: "A connected brand system for a psychology practice: naming, strategy, visual identity, custom typography, stationery and social media. Built around the phoenix as a metaphor for growth through the work of rebuilding oneself.",
    cover: asset("avaia-primary-phoenix"), gallery: [],
    caseStudy: {
      layout: "editorial-bento",
      titleLines: ["AVAIA", "MIND CLINIC"],
      sector: "Psychology practice",
      introduction: "A cohesive identity built around the idea that therapy is an active process of self-discovery, not a shortcut to happiness.",
      services: ["Brand Strategy", "Naming", "Visual Identity", "Custom Typography", "Stationery", "Social Media"],
      cells: [
        { kind: "image", slot: "banner", asset: asset("avaia-banner-web"), original: asset("avaia-banner-original"), alt: "AVAIA Mind Clinic large-format banner with the original phoenix symbol, custom wordmark, tagline and contact strip", caption: "01 / The identity in the world: Large-format banner" },
        { kind: "text", slot: "brief", title: "The brief", paragraphs: ["Build a distinctive identity for a psychology practice that communicates a thoughtful, grounded understanding of therapy."] },
        { kind: "image", slot: "primary", asset: asset("avaia-primary-phoenix"), alt: "AVAIA’s original tall phoenix artwork in muted brown on warm cream, with fine lines, dotted details and an extended tail", caption: "02 / A symbol of rebuilding: The phoenix" },
        { kind: "text", slot: "challenge", title: "The challenge", paragraphs: ["The brand needed to communicate that therapy is meaningful work rather than an effortless transformation. The identity had to feel refined and reassuring without relying on generic mental-health imagery or suggesting instant happiness."] },
        { kind: "text", slot: "concept", title: "The concept", paragraphs: ["The phoenix became the central metaphor: growth emerges through the work of rebuilding oneself.", "Its symbolism represents introspection, resilience and the possibility of rising from one’s own ashes."] },
        { kind: "text", slot: "strategy", title: "The strategy", paragraphs: ["The naming, positioning and visual identity were developed as a connected brand system. The identity was intended to express depth and transformation while retaining a sophisticated and composed visual language."] },
        { kind: "image", slot: "cards", asset: asset("avaia-visiting-cards"), alt: "Original AVAIA Mind Clinic visiting-card pair, showing the phoenix and AVAIA lettering on the front and clinic details on the reverse", caption: "03 / A considered introduction: Visiting cards" },
        { kind: "text", slot: "execution", title: "The execution", paragraphs: [], items: ["Brand naming", "Brand strategy", "Logo and visual identity", "Custom typography", "Visiting card", "Letterhead", "Large-format banner", "Social media setup"] },
        { kind: "image", slot: "letterhead", asset: asset("avaia-letterhead-preview"), original: asset("avaia-letterhead-pdf"), alt: "The complete AVAIA letterhead, rendered from the supplied PDF, with the phoenix and wordmark above a spacious writing area and the contact footer below", caption: "04 / Space for a conversation: Letterhead" },
        { kind: "image", slot: "typeface", asset: asset("avaia-typeface-preview"), original: asset("avaia-typeface-pdf"), alt: "Supplied custom AVAIA letterform specimen, with fine strokes and offset shadow details, rendered from the typography PDF", caption: "05 / A voice of its own: Custom letterforms" },
        { kind: "image", slot: "symbol", asset: asset("avaia-phoenix-detail"), alt: "Original transparent AVAIA phoenix symbol with its complete fine-line and dotted tail", caption: "06 / Line, rhythm, resilience: Symbol detail" },
        { kind: "text", slot: "outcome", title: "The outcome", paragraphs: ["A cohesive identity built around the idea that therapy is an active process of self-discovery, not a shortcut to happiness."] },
      ],
      relatedSlugs: ["choudhary-farm-products"],
    },
  },
  {
    slug: "more-worldwide-exim", name: "More Worldwide Exim", category: "Brand identity", descriptor: "An export identity for Indian wellness goods, from a corrected logo to four catalogues and a website.", theme: "mwe",
    overview: "A corrected monogram and wordmark, a modular system of four export catalogues and a new website for an Indian exporter of moringa and beet powders, rose water, incense and natural minerals.",
    cover: asset("mwe-lockup"), gallery: [],
    caseStudy: {
      layout: "editorial-bento",
      titleLines: ["MORE", "WORLDWIDE EXIM"],
      sector: "Export & import, wellness goods",
      introduction: "A professional export identity for Indian wellness goods (herbal powders, minerals, incense and rose water) carried through corrected logo lettering, a family of product catalogues and a new website.",
      services: ["Logo correction", "Visual identity", "Catalogue design", "Art direction", "Website design"],
      links: [
        { label: "moreworldwideexim.com", href: "https://moreworldwideexim.com" },
        { label: "View the catalogues", href: "https://moreworldwideexim.com/catalogue.html" },
      ],
      cells: [
        { kind: "image", slot: "banner", asset: asset("mwe-catalogues"), alt: "Four More Worldwide Exim export catalogue covers (herbal powders, natural minerals, incense sticks and rose water) shown together", caption: "01 / One system, four ranges: Export catalogues" },
        { kind: "text", slot: "brief", title: "The brief", paragraphs: ["More Worldwide Exim exports Indian wellness goods to buyers overseas: moringa and beet powders, rose water, incense sticks and natural minerals. The brand needed to present that range with export-grade polish while keeping its Indian character."] },
        { kind: "image", slot: "primary", asset: asset("mwe-moringa"), alt: "Moringa powder pack photographed on a warm neutral surface", caption: "02 / Indian wellness, export-ready: Moringa powder" },
        { kind: "text", slot: "challenge", title: "The challenge", paragraphs: ["The earlier logo did not resolve into the letters M, W and E, so the mark could not carry the name. Alongside it, a growing product range had no consistent way to reach international buyers."] },
        { kind: "text", slot: "concept", title: "The concept", paragraphs: ["The monogram was redrawn so the letterforms read clearly as MWE, then paired with a restrained wordmark.", "A calm indigo and neutral paper palette keeps the product photography and the specification pages in focus."] },
        { kind: "text", slot: "strategy", title: "The strategy", paragraphs: ["The four catalogues were built as one modular system: a shared cover treatment, consistent product photography and matching technical pages, so new products can be added without redesigning the set."] },
        { kind: "image", slot: "cards", asset: asset("mwe-lockup"), alt: "More Worldwide Exim full colour lockup with the corrected MWE monogram above the wordmark", caption: "03 / The corrected mark: Monogram and wordmark" },
        { kind: "text", slot: "execution", title: "The execution", paragraphs: [], items: ["Logo correction", "Monogram and wordmark", "Catalogue design (four titles)", "Product photography direction", "Export specification pages", "Website design and build"] },
        { kind: "image", slot: "letterhead", asset: asset("mwe-range"), alt: "Beet powder, rose water, incense sticks and mineral crystal photographed for the wellness range", caption: "04 / The wellness range: Beet, rose, incense, minerals" },
        { kind: "image", slot: "typeface", asset: asset("mwe-wordmark"), alt: "More Worldwide Exim colour wordmark", caption: "05 / A wordmark that reads: More Worldwide Exim" },
        { kind: "image", slot: "symbol", asset: asset("mwe-icon"), alt: "Corrected MWE monogram in the brand's blue gradient", caption: "06 / MWE, letter by letter: Monogram" },
        { kind: "text", slot: "outcome", title: "The outcome", paragraphs: ["A coherent export identity: a mark that reads correctly, a catalogue system that presents the range with authority, and a website that carries both, live at moreworldwideexim.com."] },
      ],
      relatedSlugs: ["avaia-mind-clinic"],
    },
  },
];
export function projectBySlug(slug: string) { return projects.find((project) => project.slug === slug); }
