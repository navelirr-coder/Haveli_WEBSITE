import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { services } from "@/data/site";
import { ProjectCard } from "@/components/project-card";
import { ContactRibbon, TextLink } from "@/components/ui";
import { SignatureHero } from "@/components/signature-hero";

export default function Home() {
  return <div className="home-page">
    <SignatureHero />

    <section id="manifesto" className="manifesto section-pad"><span className="eyebrow">A space of your own</span><div><h2 data-reveal>For people who dare<br /><em>to be specific.</em></h2><div className="manifesto-copy"><p>Studio Haveli is a branding practice for people with a voice of their own. We help you shape the words, the look and the space that carry it, so what you build sounds like you. For everyday life, not just the highlight reel. Not louder. Just truer.</p><TextLink href="/services">Build something that sounds like you</TextLink></div></div></section>

    <section className="work-section section-pad"><div className="section-heading"><div><span className="eyebrow">Out in the world</span><h2 data-reveal>Work with<br /><em>a voice of its own.</em></h2></div><TextLink href="/work">See the work</TextLink></div><div className="project-grid">{projects.slice(0, 3).map((project) => <ProjectCard key={project.slug} project={project} />)}</div></section>

    <section className="services-overview section-pad"><div className="section-heading"><div><span className="eyebrow">A place to stand</span><h2 data-reveal>Every detail.<br /><em>Your own voice.</em></h2></div><p>A clear point of view. An identity that could only be yours. Packaging and digital spaces that carry the same voice into everything people touch.</p></div><div>{services.map((service) => <Link className="service-row" key={service.id} href={`/services#${service.id}`}><span className="service-title">{service.title}</span><ArrowUpRight aria-hidden="true" /></Link>)}</div></section>

    <section className="process section-pad"><div><span className="eyebrow">From voice to belonging</span><h2 data-reveal>Listen.<br />Give it form.<br /><em>Let it live.</em></h2></div><ol className="process-list">{[
      ["Find what matters", "Get to the heart of your business and the people you want to reach. Find the belief that gives them a reason to care."],
      ["Give it a voice", "Turn that belief into an identity with a language, a look and a presence that sound like the people behind it."],
      ["Make it a place", "Carry the brand into products, spaces and experiences that feel continuous with who you are, so people know where they are and why it matters."],
    ].map(([title, copy]) => <li key={title} data-reveal><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

    <section className="audit-invitation section-pad"><div><span className="eyebrow">A clearer view</span><h2 data-reveal>Does your brand<br /><em>sound like you?</em></h2></div><div><div className="audit-mark">25<small>questions. Find what is missing.</small></div><p>Find the gaps in your strategy, identity and customer experience. Get a clearer view of what is working, what is not, and what to do next.</p><TextLink href="/brand-audit" light>Find your brand’s gaps</TextLink></div></section>
    <ContactRibbon eyebrow="Your voice is already there" heading={<>Give it a place<br /><em>to be heard.</em></>} cta="Start a conversation" />
  </div>;
}
