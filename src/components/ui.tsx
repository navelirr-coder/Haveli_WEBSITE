import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function TextLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return <Link href={href} className={`text-link ${light ? "is-light" : ""}`}><span>{children}</span><ArrowUpRight size={20} aria-hidden="true" /></Link>;
}
export function ContactRibbon({eyebrow="The next chapter",heading=<>Have something<br /><em>in mind?</em></>,cta="Let’s make it happen"}: {eyebrow?:string;heading?:React.ReactNode;cta?:string}) {
  return <section className="contact-ribbon section-pad"><span className="eyebrow">{eyebrow}</span><h2 data-reveal>{heading}</h2><TextLink href="/contact">{cta}</TextLink></section>;
}
