import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return <article className="project-card" data-reveal>
    <Link href={`/work/${project.slug}`} aria-label={`View ${project.name}, ${project.category}`}>
      <div className="project-image" data-theme={project.theme} data-image-reveal><Image src={project.cover.publicPath} alt={`${project.name}, supplied ${project.category.toLowerCase()} artwork`} fill sizes="(max-width: 700px) 90vw, 46vw" /><span className="project-hover" aria-hidden="true"><ArrowUpRight size={23} /></span></div>
      <div className="project-info"><div><h3>{project.name}</h3><p>{project.category}</p></div></div>
    </Link>
  </article>;
}
