import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { WhatsAppLink } from "@/components/whatsapp";
import { studio } from "@/data/site";
export const metadata: Metadata = { title: "Start a conversation", description: "Have a project in mind? Tell Studio Haveli about your brand, your idea and what comes next." };
export default function Contact() {
  return <><section className="page-intro contact-intro section-pad"><span className="eyebrow">Open a conversation / Start something</span><h1><span className="hero-line">An idea?</span><span className="hero-line"><em>We’re all ears.</em></span></h1><p>A new beginning. A different direction.<br />A question you haven’t quite found the words for. Tell us about it.</p></section><section className="contact-layout section-pad"><aside className="contact-aside"><span className="eyebrow">Pull up a chair</span><h2>Let’s find<br /><em>your next move.</em></h2><p>Tell us a little about your business and what you have in mind. A rough idea is a perfectly good place to start.</p><a className="email-link underline" href={`mailto:${studio.email}`}>{studio.email}</a><WhatsAppLink label="Message on WhatsApp" /></aside><EnquiryForm /></section></>;
}
