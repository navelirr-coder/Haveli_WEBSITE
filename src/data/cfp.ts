import { asset, type Asset } from "@/lib/assets";

export interface PackagingArtwork { asset: Asset; alt: string; caption: string; composition: "range" | "packshot" | "editorial" }
export interface PackagingAudience {
  id: "kids" | "adults"; label: string; title: string; copy: string; artwork: PackagingArtwork[];
}
export interface PackagingCaseStudy {
  introduction: string; brief: string; scope: string[];
  audiences: PackagingAudience[];
  overview: PackagingArtwork; outcome: string;
}
const artwork = (id: string, caption: string, alt: string, composition: PackagingArtwork["composition"]): PackagingArtwork => ({asset:asset(id),caption,alt,composition});

export const cfpStudy: PackagingCaseStudy = {
  introduction: "A differentiated packaging system for modern millet snacking.",
  brief: "Make traditional Indian millets relevant to modern snacking, with distinct packaging for children and adults.",
  scope: ["Packaging strategy", "Packaging design", "Product differentiation"],
  overview: artwork("cfp-range", "The product family / A range of reasons to choose.", "Choudhary Farm Products range arranged in a basket: four character-led savoury pouches behind millet cookies, ragi and millet ladoos and a nutri bar", "range"),
  audiences: [
    {id:"kids",label:"01 / The kids’ range",title:"Making millet approachable.",copy:"Illustrated characters make millet snacks approachable for children. Colour and ingredient cues give each savoury pouch a recognisable personality.",artwork:[
      artwork("cfp-kids-bajra","Bajra Chivda","Bajra Chivda zip-lock pouch with an illustrated yellow food character, orange product label and original nutritional callouts","packshot"),
      artwork("cfp-kids-chips","Jowar Chips","Jowar Chips zip-lock pouch with a green label, sunglasses-wearing illustrated character and bilingual product lettering","packshot"),
      artwork("cfp-kids-chivda","Jowar Chivda","Jowar Chivda zip-lock pouch with a red label, illustrated snack character and bilingual product lettering","packshot"),
      artwork("cfp-kids-ragi","Ragi Sticks","Ragi Sticks zip-lock pouch with an ochre label, illustrated stick characters and original nutritional callouts","packshot"),
    ]},
    {id:"adults",label:"02 / The adult range",title:"Reframing nourishment.",copy:"Large typography and expressive colours reframe cookies, ladoos and a nutri bar for younger adults, while keeping their Indian food associations.",artwork:[
      artwork("cfp-adult-cookies","Millet Cookies","Millet Cookies tray packaging with pink and burgundy rays, blue stars, expressive lettering and photographed cookies","editorial"),
      artwork("cfp-adult-millet","Millet Ladoo","Millet Ladoo tray packaging with burgundy stripes, a pink ornamental motif, heavy pink lettering and photographed ladoos","editorial"),
      artwork("cfp-adult-ragi","Ragi Ladoo","Ragi Ladoo tray packaging with red and burgundy stripes, ornamental illustration, cream lettering and photographed ragi ladoos","editorial"),
      artwork("cfp-adult-nutri","Nutri Bar","CFP Nutri Millet Bar in its original silver wrapper and lavender label, with a photographed bar, nuts and grains on a lavender background","editorial"),
    ]},
  ],
  outcome:"One millet-based family, two distinct experiences: approachable savoury snacks for children and expressive treats for adults. Product-specific cues keep every pack recognisable.",
};
