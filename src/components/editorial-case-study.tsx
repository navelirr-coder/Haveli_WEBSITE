import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projectBySlug, type EditorialCell, type EditorialCaseStudy, type Project } from "@/data/projects";
import { ProjectCard } from "./project-card";

function NarrativeCell({ cell }: { cell: Extract<EditorialCell, { kind: "text" }> }) {
  return <section className={`avaia-cell avaia-cell--${cell.slot} avaia-narrative`} data-reveal>
    <h2 className="eyebrow">{cell.title}</h2>
    {cell.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    {cell.items && <ul>{cell.items.map((item) => <li key={item}>{item}</li>)}</ul>}
  </section>;
}

function ArtworkCell({ cell }: { cell: Extract<EditorialCell, { kind: "image" }> }) {
  const feature = cell.slot === "banner" || cell.slot === "primary";
  return <figure className={`avaia-cell avaia-cell--${cell.slot}`} {...(feature ? { "data-image-reveal": true } : { "data-reveal": true })}>
    <div className="avaia-artwork">
      <Image
        src={cell.asset.publicPath}
        alt={cell.alt}
        width={cell.asset.width}
        height={cell.asset.height}
        sizes={cell.slot === "banner" ? "92vw" : "(max-width: 800px) 90vw, 48vw"}
        priority={cell.slot === "banner"}
      />
    </div>
    <figcaption><span>{cell.caption}</span>{cell.original && <a href={cell.original.publicPath} target="_blank" rel="noopener noreferrer" className="avaia-original-link" aria-label={`Open original ${cell.slot === "typeface" ? "typography specimen PDF" : cell.slot === "letterhead" ? "letterhead PDF" : "banner artwork"} in a new tab`}>View original<ArrowUpRight size={13} aria-hidden="true" /></a>}</figcaption>
  </figure>;
}

export function EditorialCaseStudyPage({ project, study, next }: { project: Project; study: EditorialCaseStudy; next: Project }) {
  const related = study.relatedSlugs.map(projectBySlug).filter((item): item is Project => Boolean(item));
  return <article className="avaia-case-study" data-theme={project.theme} aria-labelledby="case-title">
    <header className="avaia-opening">
      <Link className="back-link" href="/work"><ArrowLeft size={16} aria-hidden="true" />Back to all work</Link>
      <div className="avaia-intro-grid">
        <div><p className="eyebrow">Selected work / {study.sector}</p><h1 id="case-title"><span className="hero-line">{study.titleLines[0]}</span><span className="hero-line"><em>{study.titleLines[1]}</em></span></h1></div>
        <p className="avaia-introduction">{study.introduction}</p>
      </div>
      <ul className="avaia-services" aria-label="Project services">{study.services.map((service) => <li key={service}>{service}</li>)}</ul>
      {study.links && <ul className="avaia-links" aria-label="Project links">{study.links.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={13} aria-hidden="true" /></a></li>)}</ul>}
    </header>

    <div className="avaia-bento" aria-label={`${project.name} artwork and case study`}>
      {study.cells.map((cell) => cell.kind === "image" ? <ArtworkCell key={cell.slot} cell={cell} /> : <NarrativeCell key={cell.slot} cell={cell} />)}
    </div>

    {related.length > 0 && <section className="avaia-related section-pad" aria-labelledby="related-work-title"><div className="section-heading"><div><span className="eyebrow">More from the studio</span><h2 id="related-work-title">Other worlds.<br /><em>Same conviction.</em></h2></div><Link className="text-link" href="/work">All work<ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="project-grid">{related.map((item) => <ProjectCard key={item.slug} project={item} />)}</div></section>}
    <Link href={`/work/${next.slug}`} className="next-project section-pad"><span className="eyebrow">Next project / {next.category}</span><h2>{next.name}<ArrowUpRight aria-hidden="true" /></h2></Link>
  </article>;
}
