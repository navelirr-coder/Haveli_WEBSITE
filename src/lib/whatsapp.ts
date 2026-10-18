import type { Enquiry } from "./enquiry";

// A WhatsApp text message is capped at 4096 characters, and CallMeBot carries
// the text in a URL, so notifications stay short. The full enquiry is stored
// in the studio database.
const MAX_MESSAGE = 900;
const DEFAULT_RECIPIENT = "+917387416789";

export function whatsappRecipient() {
  return (process.env.WHATSAPP_TO || DEFAULT_RECIPIENT).replace(/[^\d+]/g, "");
}

export function whatsappConfigured() {
  return Boolean(
    process.env.WHATSAPP_CALLMEBOT_APIKEY ||
    (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
  );
}

export function formatEnquiryForWhatsApp(enquiry: Enquiry, createdAt: string) {
  const text = [
    "New website enquiry",
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Business: ${enquiry.business}`,
    `Services: ${enquiry.services.join(", ")}`,
    `Budget: ${enquiry.budget || "Not given"}`,
    `Timeline: ${enquiry.timeline || "Not given"}`,
    "",
    enquiry.overview,
    "",
    `Received: ${createdAt}`,
  ].join("\n");
  return text.length > MAX_MESSAGE ? `${text.slice(0, MAX_MESSAGE - 1)}…` : text;
}

/**
 * Sends the notification through whichever provider is configured.
 * Returns the provider name, or null when no provider is set up.
 */
export async function sendWhatsApp(text: string): Promise<string | null> {
  const key = process.env.WHATSAPP_CALLMEBOT_APIKEY;
  if (key) {
    const url = new URL("https://api.callmebot.com/whatsapp.php");
    url.searchParams.set("phone", whatsappRecipient());
    url.searchParams.set("text", text);
    url.searchParams.set("apikey", key);
    const response = await fetch(url, { signal: AbortSignal.timeout(10000), redirect: "error" });
    if (!response.ok) throw new Error(`CallMeBot responded ${response.status}`);
    return "callmebot";
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (token && phoneNumberId) {
    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: whatsappRecipient().replace(/^\+/, ""),
        type: "text",
        text: { body: text },
      }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!response.ok) throw new Error(`WhatsApp Cloud API responded ${response.status}`);
    return "cloud";
  }

  return null;
}
