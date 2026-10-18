import { DatabaseSync } from "node:sqlite";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const file = resolve(process.cwd(), process.env.ENQUIRY_DATABASE_PATH || "data/enquiries.db");
if (!existsSync(file)) {
  console.log(`No enquiry database yet. Nothing has been saved to ${file}.`);
  process.exit(0);
}

const database = new DatabaseSync(file);
let rows;
try {
  rows = database.prepare("SELECT * FROM enquiries ORDER BY id DESC LIMIT 25").all();
} catch {
  console.log(`No enquiries table found in ${file}.`);
  process.exit(0);
}

if (!rows.length) {
  console.log("No enquiries yet.");
  process.exit(0);
}

console.log(`${rows.length} recent ${rows.length === 1 ? "enquiry" : "enquiries"} in ${file}\n`);
for (const row of rows) {
  console.log(`#${row.id}  ${row.created_at}  ${row.notified_via ? `notified via ${row.notified_via}` : "not notified"}`);
  console.log(`${row.name} <${row.email}> - ${row.business}`);
  console.log(`Services: ${row.services}`);
  console.log(`Budget: ${row.budget || "not given"} | Timeline: ${row.timeline || "not given"}`);
  if (row.notification_error) console.log(`Notification error: ${row.notification_error}`);
  console.log(`\n${row.overview}\n${"-".repeat(60)}`);
}
