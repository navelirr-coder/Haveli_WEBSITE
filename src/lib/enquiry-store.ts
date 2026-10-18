import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Enquiry } from "./enquiry";

export interface EnquiryRow {
  id: number;
  created_at: string;
  name: string;
  email: string;
  business: string;
  services: string;
  overview: string;
  budget: string;
  timeline: string;
  source: string | null;
  notified_via: string | null;
  notification_error: string | null;
}

// One connection per database file. Keyed by path so tests can point the
// store at a temporary file without reopening the studio's own database.
const connections = new Map<string, DatabaseSync>();

export function enquiryDatabasePath() {
  return resolve(process.cwd(), process.env.ENQUIRY_DATABASE_PATH || "data/enquiries.db");
}

function connection() {
  const file = enquiryDatabasePath();
  const cached = connections.get(file);
  if (cached) return cached;
  mkdirSync(dirname(file), { recursive: true });
  const database = new DatabaseSync(file);
  database.exec(`CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    business TEXT NOT NULL,
    services TEXT NOT NULL,
    overview TEXT NOT NULL,
    budget TEXT NOT NULL,
    timeline TEXT NOT NULL,
    source TEXT,
    notified_via TEXT,
    notification_error TEXT
  )`);
  connections.set(file, database);
  return database;
}

export function saveEnquiry(enquiry: Enquiry, createdAt: string, source = "studio-haveli-website") {
  const result = connection().prepare(`INSERT INTO enquiries
    (created_at, name, email, business, services, overview, budget, timeline, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    createdAt,
    enquiry.name,
    enquiry.email,
    enquiry.business,
    enquiry.services.join(", "),
    enquiry.overview,
    enquiry.budget,
    enquiry.timeline,
    source,
  );
  return Number(result.lastInsertRowid);
}

export function recordNotification(id: number, via: string | null, error: string | null) {
  connection().prepare("UPDATE enquiries SET notified_via = ?, notification_error = ? WHERE id = ?")
    .run(via, error ? error.slice(0, 500) : null, id);
}

export function listEnquiries(limit = 25) {
  return connection().prepare("SELECT * FROM enquiries ORDER BY id DESC LIMIT ?").all(limit) as unknown as EnquiryRow[];
}
