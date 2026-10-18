export const enquiryServices = ["Brand strategy", "Brand identity", "Packaging & brand applications", "Website design & digital experiences", "Not sure yet"] as const;
export interface Enquiry {
  name: string; email: string; business: string; services: string[]; overview: string; budget: string; timeline: string; companyWebsite: string;
}
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;
export function validateEnquiry(input: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (input.name.trim().length < 2 || input.name.length > 100) errors.name = "Enter your name (2-100 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || input.email.length > 254) errors.email = "Enter a valid email address.";
  if (input.business.trim().length < 2 || input.business.length > 200) errors.business = "Enter your business or brand name.";
  if (!input.services.length || input.services.some((service) => !(enquiryServices as readonly string[]).includes(service))) errors.services = "Choose a service, or select ‘Not sure yet’.";
  if (input.overview.trim().length < 10 || input.overview.length > 5000) errors.overview = "Tell us a little about your project (10-5,000 characters).";
  if (input.budget.length > 200) errors.budget = "Keep your budget description under 200 characters.";
  if (input.timeline.length > 200) errors.timeline = "Keep your timeline description under 200 characters.";
  if (input.companyWebsite) errors.companyWebsite = "Unable to send this enquiry.";
  return errors;
}
export function parseEnquiry(input: unknown): Enquiry | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  for (const key of ["name", "email", "business", "overview", "budget", "timeline", "companyWebsite"]) if (typeof raw[key] !== "string") return null;
  if (!Array.isArray(raw.services) || raw.services.some((value) => typeof value !== "string")) return null;
  return raw as unknown as Enquiry;
}
