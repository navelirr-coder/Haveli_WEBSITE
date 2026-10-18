import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navigation, studio } from "@/data/site";
import { WhatsAppLink } from "@/components/whatsapp";

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-top"><Link className="footer-invitation" href="/contact">Say hello.<ArrowUpRight aria-hidden="true" /></Link></div>
    <div className="footer-grid"><p className="studio-name"><span>STUDIO</span> HAVELI</p><nav aria-label="Footer navigation">{navigation.map(({ href, label }) => <Link href={href} key={href}>{label}</Link>)}</nav><div><span className="eyebrow">Write to the studio</span><a className="email-link" href={`mailto:${studio.email}`}>{studio.email}</a><WhatsAppLink label="Message on WhatsApp" /></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Studio Haveli</span><span>Made for real voices. Built to belong.</span><a href="#top">Back to top ↑</a></div>
  </footer>;
}
