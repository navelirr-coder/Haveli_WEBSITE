import type { Metadata } from "next";
import { services } from "@/data/site";
import { ContactRibbon, TextLink } from "@/components/ui";
export const metadata: Metadata = { title: "Services", description: "Brand strategy, identity, packaging and digital experiences. Explore how Studio Haveli can help your brand." };
export default function Services() {
  return <><section className="page-intro services-intro section-pad"><span className="eyebrow">The repertoire / What we do</span><h1><span className="hero-line">Good thinking.</span><span className="hero-line"><em>Great character.</em></span></h1><p>A brand is a whole world. We help you find its centre and bring every part of it into focus.</p></section>
    <div className="services-list">{services.map((service) => <section key={service.id} id={service.id} className="service-detail" data-reveal>
      <div className="service-detail-head"><span className="eyebrow">The repertoire</span><h2>{service.title}</h2></div>
      <div className="service-detail-body"><div>
        <h3>{service.phrase}</h3>
        <p>{service.description}</p>
        <p className="service-prompt">{service.prompt}</p>
        {service.projectSlug ? <TextLink href={`/work/${service.projectSlug}`}>View {service.projectLabel}</TextLink> : <TextLink href="/contact">Start a conversation</TextLink>}
      </div></div>
    </section>)}</div>
    <section className="audit-invitation section-pad"><div><span className="eyebrow">Not sure where to begin?</span><h2>Start with<br /><em>a closer look.</em></h2></div><div><p>Our Brand Audit can help you identify the areas that need work before you decide what comes next.</p><TextLink href="/brand-audit" light>Explore the Brand Audit</TextLink></div></section><ContactRibbon /></>;
}
