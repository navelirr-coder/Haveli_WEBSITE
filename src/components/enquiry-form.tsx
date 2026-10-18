"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { enquiryServices, validateEnquiry, type Enquiry, type EnquiryErrors } from "@/lib/enquiry";

const empty: Enquiry = { name:"", email:"", business:"", services:[], overview:"", budget:"", timeline:"", companyWebsite:"" };
export function EnquiryForm() {
  const [values, setValues] = useState<Enquiry>(empty);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);
  const form = useRef<HTMLFormElement>(null);
  function update(key: keyof Enquiry, value: string | string[]) { setValues((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;
    const nextErrors = validateEnquiry(values);
    setErrors(nextErrors); setFeedback(null);
    if (Object.keys(nextErrors).length) { requestAnimationFrame(() => form.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus()); return; }
    setSending(true);
    try {
      const response = await fetch("/api/enquiry", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(values), signal:AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok) { setFeedback({ success:false, message:result.message || "Your enquiry was not sent. Please try again or email the studio." }); if (result.errors) setErrors(result.errors); }
      else { setFeedback({ success:true, message:"Your enquiry has been received. Thank you for telling us about your project." }); setValues(empty); }
    } catch { setFeedback({ success:false, message:"We couldn’t confirm delivery. Your details are still here. Please try again or email the studio." }); }
    finally { setSending(false); }
  }
  function field(key: "name" | "email" | "business" | "budget" | "timeline", label: string, placeholder: string, type = "text") {
    return <div className={`field ${key === "business" ? "field-full" : ""}`}><label htmlFor={`enquiry-${key}`}>{label}</label><input id={`enquiry-${key}`} name={key} type={type} value={values[key]} placeholder={placeholder} onChange={(event) => update(key, event.target.value)} required={!["budget","timeline"].includes(key)} maxLength={key === "email" ? 254 : key === "name" ? 100 : 200} autoComplete={key === "name" ? "name" : key === "email" ? "email" : key === "business" ? "organization" : "off"} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `enquiry-error-${key}` : undefined} />{errors[key] && <span id={`enquiry-error-${key}`} className="field-error">{errors[key]}</span>}</div>;
  }
  return <form ref={form} onSubmit={submit} noValidate aria-label="Project enquiry" aria-busy={sending}>
    <fieldset disabled={sending} className="form-fieldset" style={{ margin:0 }}><legend className="sr-only">Your project enquiry</legend>
      <div className="form-grid">{field("name","Your name *","A name to put to the idea")}{field("email","Email address *","you@yourbrand.com","email")}{field("business","Business or brand name *","What’s your brand called?")}</div>
      <fieldset className="form-fieldset"><legend className="field-label">What can we help with? *</legend><div className="service-options">{enquiryServices.map((service) => <label className="choice-chip" key={service}><input type="checkbox" name="services" value={service} checked={values.services.includes(service)} aria-invalid={Boolean(errors.services)} aria-describedby={errors.services ? "enquiry-error-services" : undefined} onChange={(event) => update("services", event.target.checked ? [...values.services, service] : values.services.filter((item) => item !== service))} />{service}</label>)}</div>{errors.services && <span className="field-error" id="enquiry-error-services">{errors.services}</span>}</fieldset>
      <div className="form-grid"><div className="field field-full"><label htmlFor="enquiry-overview">A little about your project *</label><textarea id="enquiry-overview" name="overview" required maxLength={5000} value={values.overview} onChange={(event) => update("overview",event.target.value)} placeholder="The idea, the challenge, the ambition. We’re listening." aria-invalid={Boolean(errors.overview)} aria-describedby={errors.overview ? "enquiry-error-overview" : undefined} />{errors.overview && <span className="field-error" id="enquiry-error-overview">{errors.overview}</span>}</div>{field("budget","Budget (optional)","A rough idea, if you have one")}{field("timeline","Timeline (optional)","When are you hoping to begin?")}</div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="enquiry-companyWebsite">Leave this field empty</label><input id="enquiry-companyWebsite" name="companyWebsite" value={values.companyWebsite} tabIndex={-1} autoComplete="off" onChange={(event) => update("companyWebsite",event.target.value)} /></div>
      <p className="form-footnote">Your details are used only to respond to this enquiry.</p>
      <button className="pill-button primary" type="submit" disabled={sending}>{sending ? "Sending enquiry…" : "Send enquiry"}{sending ? <LoaderCircle className="loading-icon" size={18} /> : <ArrowUpRight size={18} aria-hidden="true" />}</button>
    </fieldset>
    {feedback && <p className={`form-notice ${feedback.success ? "success" : ""}`} role="status">{feedback.message}</p>}
  </form>;
}
