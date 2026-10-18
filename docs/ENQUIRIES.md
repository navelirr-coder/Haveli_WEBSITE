# Enquiries, storage and WhatsApp

## What happens when the form is submitted

1. The request is checked for a same-origin browser, a sane body size and valid fields. Spam traps are unchanged.
2. The enquiry is written to a SQLite database. This is the record of the enquiry.
3. Any configured destination is notified: an HTTPS webhook and/or WhatsApp.
4. The response reports `stored` and `notified`. The form says the enquiry was received when it was stored, or when a configured destination accepted it.

A notification failure never deletes or loses the stored enquiry. The failure is written to the record's `notification_error` column and logged on the server. If the enquiry cannot be stored and no destination accepts it, the route returns HTTP 503 and explicitly says nothing was sent.

## The database

By default the database is `data/enquiries.db` (ignored by git). Override the location with `ENQUIRY_DATABASE_PATH`. The store uses Node's built-in `node:sqlite`, so it needs Node 22.13 or newer.

`npm run enquiries` prints the 25 most recent records. The file can also be opened with any SQLite tool.

Table `enquiries`:

| Column | Meaning |
| --- | --- |
| `id` | Auto-incrementing record id |
| `created_at` | ISO timestamp from the server |
| `name`, `email`, `business` | Visitor details |
| `services` | Comma-separated selections |
| `overview`, `budget`, `timeline` | Project notes |
| `source` | `studio-haveli-website` |
| `notified_via` | `webhook`, `whatsapp`, both, or null |
| `notification_error` | Last notification failure, if any |

SQLite is a local file. It works when the site runs on this machine or on a host with a persistent disk. A serverless host with a read-only filesystem needs a mounted volume or a hosted database; otherwise the write fails and the route correctly reports that the enquiry was not received.

## WhatsApp

Configure one provider in `.env.local` (copy `.env.example`):

### CallMeBot (quickest for a personal number)

1. From the studio phone, send `I allow callmebot to send me messages` to the CallMeBot WhatsApp number shown on callmebot.com.
2. The reply contains an API key.
3. Set `WHATSAPP_CALLMEBOT_APIKEY` to that key.
4. Set `WHATSAPP_TO` if notifications should go to a different number. It defaults to the studio number.

### Meta WhatsApp Cloud API

1. Create a Meta app with the WhatsApp product and a WhatsApp Business phone number.
2. Set `WHATSAPP_ACCESS_TOKEN` to a permanent/system-user token.
3. Set `WHATSAPP_PHONE_NUMBER_ID` to the sending number's id.
4. During testing, add the recipient to the allowed test numbers.

The notification is a plain text message capped at 900 characters so it fits in a CallMeBot URL. The full enquiry is always in the database.

## Privacy and display

- Secrets stay server-side. Only `.env.example` is committed.
- The studio phone number is never rendered as text. It appears only inside the `wa.me` link behind the WhatsApp icons (footer, contact page and the floating button).
- The Brand Audit is separate: its records use the browser's IndexedDB and are not sent to this database.
