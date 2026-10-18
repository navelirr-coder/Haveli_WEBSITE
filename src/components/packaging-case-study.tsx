import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import type { PackagingArtwork, PackagingAudience, PackagingCaseStudy } from "@/data/cfp";

function ArtworkPanel({image,className="",priority=false}: {image:PackagingArtwork;className?:string;priority?:boolean}) {
  return <div className={`packaging-art ${className}`} data-composition={image.composition} {...(priority ? {"data-image-reveal":true} : {"data-reveal":true})}>
    <figure className="packaging-parallax" data-packaging-parallax>
      <div className="packaging-art-frame"><Image src={image.asset.publicPath} width={image.asset.width} height={image.asset.height} alt={image.alt} priority={priority} sizes={priority ? "(max-width:900px) 90vw, 62vw" : "(max-width:700px) 90vw, (max-width:1000px) 44vw, 46vw"} /></div>
      <figcaption>{image.caption}</figcaption>
    </figure>
  </div>;
}
function AudiencePanel({audience}:{audience:PackagingAudience}) {
  return <section className={`packaging-audience packaging-audience--${audience.id}`} aria-labelledby={`audience-${audience.id}`}>
    <div className="packaging-audience-copy" data-reveal><p className="eyebrow">{audience.label}</p><h3 id={`audience-${audience.id}`}>{audience.title}</h3><p>{audience.copy}</p></div>
    <div className="packaging-audience-art" aria-label={`${audience.id === "kids" ? "Children’s savoury" : "Adult-oriented"} packaging`}>{audience.artwork.map((image,index)=><ArtworkPanel image={image} key={image.asset.id} className={`audience-image-${index+1}`} />)}</div>
  </section>;
}
export function PackagingCaseStudyPage({project,study,next}:{project:Project;study:PackagingCaseStudy;next:Project}) {
  return <article className="packaging-study" aria-labelledby="packaging-title" data-project={project.slug}>
    <header className="packaging-opening section-pad">
      <Link href="/work" className="back-link"><ArrowLeft size={16} aria-hidden="true" />Back to all work</Link>
      <div className="packaging-opening-grid"><div className="packaging-heading"><p className="eyebrow">Packaging strategy / Packaging design</p><h1 id="packaging-title" className="hero-line">Choudhary<br /><em>Farm Products.</em></h1><p className="packaging-descriptor">{study.introduction}</p></div><ArtworkPanel image={study.overview} priority /></div>
    </header>

    <section className="packaging-overview section-pad" aria-labelledby="packaging-brief"><div data-reveal><span className="eyebrow">The brief</span><h2 id="packaging-brief">Traditional grains.<br /><em>New appetites.</em></h2><p>{study.brief}</p></div><aside data-reveal><h3 className="eyebrow">Project scope</h3><ul>{study.scope.map(item=><li key={item}>{item}</li>)}</ul></aside></section>
    <section className="packaging-strategy section-pad" aria-labelledby="packaging-strategy"><div className="packaging-strategy-intro"><div><p className="eyebrow">The approach</p><h2 id="packaging-strategy">Two audiences.<br /><em>Two approaches.</em></h2></div></div>{study.audiences.map(audience=><AudiencePanel audience={audience} key={audience.id} />)}</section>

    <section className="packaging-outcome section-pad" aria-labelledby="packaging-outcome"><h2 id="packaging-outcome">Nourishment<br /><em>meets enjoyment.</em></h2><div><p>{study.outcome}</p><Link href="/work" className="text-link">Back to all work<ArrowUpRight size={18} aria-hidden="true" /></Link></div></section>
    <Link href={`/work/${next.slug}`} className="next-project section-pad"><span className="eyebrow">Next project / {next.category}</span><h2>{next.name}<ArrowUpRight aria-hidden="true" /></h2></Link>
  </article>;
}
