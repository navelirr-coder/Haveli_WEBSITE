import type { Metadata } from "next";
import { WorkIndex } from "@/components/work-index";
import { ContactRibbon } from "@/components/ui";
export const metadata: Metadata = { title: "Selected work", description: "Explore Studio Haveli’s identity, packaging and brand application work." };
export default function Work() {
  return <><section className="page-intro work-intro section-pad"><span className="eyebrow">The portfolio / A selection</span><h1><span className="hero-line">Different voices.</span><span className="hero-line"><em>Same conviction.</em></span></h1><p>Ideas with their own point of view.<br />A selection of identities and applications from the studio.</p></section><WorkIndex /><ContactRibbon /></>;
}
