import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, projectBySlug } from "@/data/projects";
import { EditorialCaseStudyPage } from "@/components/editorial-case-study";
import { PackagingCaseStudyPage } from "@/components/packaging-case-study";

export function generateStaticParams() { return [...projects.map(({ slug }) => ({ slug })), { slug: "avaia" }, { slug: "cfp" }]; }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  return { title: project?.name ?? "Project not found", description: project?.overview ?? project?.descriptor, ...(project ? { alternates: { canonical: `/work/${project.slug}` } } : {}) };
}
export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "avaia") permanentRedirect("/work/avaia-mind-clinic");
  if (slug === "cfp") permanentRedirect("/work/choudhary-farm-products");
  const project = projectBySlug(slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  if (project.packagingStudy) return <PackagingCaseStudyPage project={project} study={project.packagingStudy} next={next} />;
  if (project.caseStudy) return <EditorialCaseStudyPage project={project} study={project.caseStudy} next={next} />;
  const sections = [["Client brief", project.brief], ["The challenge", project.challenge], ["Strategic direction", project.strategy], ["Visual identity", project.identity], ["Applications", project.applications]];
  return <>
    <section className="case-intro section-pad"><Link className="back-link" href="/work"><ArrowLeft size={16} aria-hidden="true" />Back to all work</Link><h1 className="hero-line">{project.name}</h1><div className="case-meta"><span className="eyebrow">{project.category}</span>{project.overview && <p>{project.overview}</p>}</div></section>
    <figure className={`case-hero ${project.cover.width / project.cover.height > 2.5 ? "is-wide" : ""}`} data-theme={project.theme} data-image-reveal><Image src={project.cover.publicPath} alt={`${project.name}: ${project.descriptor}`} fill priority sizes="92vw" /></figure>
    {sections.filter(([, content]) => content).map(([heading, content]) => <section className="case-section section-pad" key={heading}><h2>{heading}</h2><p>{content}</p></section>)}
    {project.gallery.length > 0 && <section className="case-gallery section-pad" data-layout={project.theme === "studio" ? "wide" : "standard"} aria-label={`${project.name} project gallery`}>{project.gallery.map((image) => <figure key={image.asset.id} data-reveal><div className="gallery-image"><Image src={image.asset.publicPath} alt={image.alt} fill sizes="(max-width:700px) 90vw, 44vw" /></div>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</section>}
    {project.credits && <section className="case-section section-pad"><h2>Credits</h2><div>{project.credits.map((credit) => <p key={credit.role}>{credit.role}: {credit.name}</p>)}</div></section>}
    <Link href={`/work/${next.slug}`} className="next-project section-pad"><span className="eyebrow">Next project / {next.category}</span><h2>{next.name}<ArrowUpRight aria-hidden="true" /></h2></Link>
  </>;
}
