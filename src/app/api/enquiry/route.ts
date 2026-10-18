import { NextResponse } from "next/server";
import { parseEnquiry, validateEnquiry } from "@/lib/enquiry";
import { recordNotification, saveEnquiry } from "@/lib/enquiry-store";
import { formatEnquiryForWhatsApp, sendWhatsApp, whatsappConfigured } from "@/lib/whatsapp";
import { studio } from "@/data/site";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next can reconstruct request.url with localhost while the visitor uses
  // 127.0.0.1, or with an internal scheme behind a trusted HTTPS host.
  const requestHost = request.headers.get("host") || new URL(request.url).host;
  if (origin) {
    try {
      const source = new URL(origin);
      if (source.host !== requestHost || !["https:","http:"].includes(source.protocol)) throw new Error("Origin mismatch");
    } catch { return NextResponse.json({ message:"This enquiry must be sent from the website." }, { status:403 }); }
  }
  let input: unknown;
  try {
    const body = await request.text();
    if (body.length > 20000) return NextResponse.json({ message:"Your enquiry is too long." }, { status:413 });
    input = JSON.parse(body);
  } catch { return NextResponse.json({ message:"Please check your enquiry and try again." }, { status:400 }); }
  const enquiry = parseEnquiry(input);
  if (!enquiry) return NextResponse.json({ message:"Please complete the enquiry form." }, { status:400 });
  const errors = validateEnquiry(enquiry);
  if (Object.keys(errors).length) return NextResponse.json({ message:"Please check the highlighted fields.", errors }, { status:422 });

  const createdAt = new Date().toISOString();

  // The database is the record of every enquiry. It is written first so a
  // notification outage can never lose a visitor's details.
  let id: number | null = null;
  try { id = saveEnquiry(enquiry, createdAt); }
  catch (error) { console.error("Enquiry could not be saved to the studio database.", error); }

  const delivered: string[] = [];
  const failures: string[] = [];

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (webhook) {
    try {
      const url = new URL(webhook);
      if (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && url.hostname === "127.0.0.1")) throw new Error("Unsupported endpoint");
      const headers: Record<string,string> = { "Content-Type":"application/json" };
      if (process.env.ENQUIRY_WEBHOOK_TOKEN) headers.Authorization = `Bearer ${process.env.ENQUIRY_WEBHOOK_TOKEN}`;
      const response = await fetch(url, { method:"POST", headers, body:JSON.stringify({ ...enquiry, companyWebsite:undefined, createdAt, source:"studio-haveli-website" }), signal:AbortSignal.timeout(10000), redirect:"error" });
      if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
      delivered.push("webhook");
    } catch (error) { failures.push(`webhook: ${String(error)}`); console.error("Enquiry webhook failed.", error); }
  }

  if (whatsappConfigured()) {
    try { await sendWhatsApp(formatEnquiryForWhatsApp(enquiry, createdAt)); delivered.push("whatsapp"); }
    catch (error) { failures.push(`whatsapp: ${String(error)}`); console.error("WhatsApp notification failed.", error); }
  }

  if (id !== null) {
    try { recordNotification(id, delivered.length ? delivered.join(",") : null, failures.length ? failures.join(" | ") : null); }
    catch (error) { console.error("Enquiry notification status could not be saved.", error); }
  }

  // Only claim the enquiry has been received when it is stored, or when a
  // configured destination has actually accepted it.
  if (id === null && !delivered.length) {
    return NextResponse.json({ message:`Your enquiry has not been sent: the studio's inbox is not connected yet. Please email ${studio.email}. Your form details have been kept.` }, { status:503 });
  }
  return NextResponse.json({ stored: id !== null, notified: delivered.length > 0 });
}
