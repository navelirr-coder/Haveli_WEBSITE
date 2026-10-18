export const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/brand-audit", label: "Brand Audit" },
  { href: "/contact", label: "Contact" },
] as const;

// Supplied in the inspected F p card@2x.png artwork; no guessed handles.
export const studio = { name: "Studio Haveli", email: "studiohavelidesigns@gmail.com", whatsapp: "917387416789" };

export const services = [
  { id: "strategy", number: "01", title: "Brand strategy", phrase: "A point of view. Before a point of sale.", description: "Find the idea at the heart of your business. We help give your brand a clear position, a distinct personality and a reason for people to care.", prompt: "For a new direction, a new beginning or a brand that has outgrown its story.", projectSlug: undefined, projectLabel: undefined },
  { id: "identity", number: "02", title: "Brand identity", phrase: "Make your character unmistakable.", description: "Translate what you stand for into how you look and speak. A considered visual identity brings typography, colour and personality into the same conversation.", prompt: "For a brand ready to look as considered as the thinking behind it.", projectSlug: "avaia-mind-clinic", projectLabel: "AVAIA Mind Clinic" },
  { id: "packaging", number: "03", title: "Packaging & brand applications", phrase: "An idea you can hold in your hands.", description: "Give your identity a life beyond the logo. From packaging to print, we consider the details that make every encounter feel like the same brand.", prompt: "For products, printed matter and the moments where a brand becomes tangible.", projectSlug: "choudhary-farm-products", projectLabel: "Choudhary Farm Products" },
  { id: "digital", number: "04", title: "Website design & digital experiences", phrase: "Your world. Open to everyone.", description: "Bring your brand into a digital space with its own rhythm and character. Clear journeys, expressive design and purposeful interactions help people find their way.", prompt: "For a digital presence that feels connected to the rest of your brand.", projectSlug: undefined, projectLabel: undefined },
] as const;
