// Run only against the preserved snapshot. Business-rule function bodies stay intact.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const original = readFileSync("reference/brand-audit/app.js", "utf8");
function extract(name) {
  const start = original.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`Missing original ${name}`);
  const open = original.indexOf("{", start);
  let depth = 1, end = open + 1;
  while (depth && end < original.length) { if (original[end] === "{") depth++; if (original[end] === "}") depth--; end++; }
  return original.slice(start, end);
}
mkdirSync("src/lib/audit", { recursive:true });
const engine = ["calculateScore", "generateGapSummary", "generateDiagnosticReport"].map((name) => `export ${extract(name)}`).join("\n\n");
writeFileSync("src/lib/audit/engine.js", `// Extracted unchanged from reference/brand-audit/app.js. See preservation tests.\n${engine}\n`);
const markup = readFileSync("reference/brand-audit/index.html", "utf8");
const questions = [...markup.matchAll(/<fieldset id="(q\d+)" data-category="([^"]+)" data-question="([^"]+)">([\s\S]*?)<\/fieldset>/g)].map((match) => ({
  id:match[1], category:match[2], question:match[3], options:[...match[4].matchAll(/value="([^"]+)"/g)].map((value) => value[1]),
}));
if (questions.length !== 25) throw new Error("Expected all 25 original questions");
writeFileSync("src/data/audit-questions.json", JSON.stringify(questions,null,2) + "\n");
const database = readFileSync("reference/brand-audit/db.js", "utf8");
// Keep the original functions/schema. Move auto-initialization behind a shared promise
// so React can await it and report failure instead of racing the first transaction.
const dbModule = database.replace(/\/\/ Auto-initialize[\s\S]*$/, "");
writeFileSync("src/lib/audit/database.js", dbModule + `\nlet initialization;\nexport function readyDatabase() {\n  if (!initialization) initialization = initializeDatabase().catch(error => { initialization = undefined; throw error; });\n  return initialization;\n}\nexport { initializeDatabase, saveClientRecord, getAllClientRecords, deleteClientById, clearAllClients, getClientCount };\n`);
console.log("Preserved 3 original engine functions, 25 questions and 6 database operations.");
