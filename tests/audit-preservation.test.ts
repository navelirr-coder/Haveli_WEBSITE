import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import vm from "node:vm";
import { calculateScore, generateGapSummary, generateDiagnosticReport } from "../src/lib/audit/engine.js";
import { questions, extractAnswers, interpretScore, validateContact } from "../src/lib/audit/model";
import { clientsCSV } from "../src/lib/audit/export";
import type { AuditAnswer, AnswerValue, ClientRecord } from "../src/lib/audit/types";

const source = readFileSync("reference/brand-audit/app.js", "utf8");
function originalFunction(name: string) {
  const start=source.indexOf(`function ${name}(`), open=source.indexOf("{",start);
  let end=open+1, depth=1;
  while(depth) { if(source[end] === "{") depth++; if(source[end] === "}") depth--; end++; }
  return source.slice(start,end);
}
const original = vm.runInNewContext(`(() => { ${["calculateScore","generateGapSummary","generateDiagnosticReport"].map(originalFunction).join("\n")} return { calculateScore, generateGapSummary, generateDiagnosticReport }; })()`, { console:{ log(){}, error(){} } });

test("all original audit files remain byte-identical", () => {
  const hashes=JSON.parse(readFileSync("reference/brand-audit-hashes.json","utf8").replace(/^\uFEFF/,""));
  for(const {filename,sha256} of hashes) assert.equal(createHash("sha256").update(readFileSync(`reference/brand-audit/${filename}`)).digest("hex").toUpperCase(),sha256);
});
test("all 25 question texts, categories, option values and order match the original HTML", () => {
  const html=readFileSync("reference/brand-audit/index.html","utf8");
  const expected=[...html.matchAll(/<fieldset id="(q\d+)" data-category="([^"]+)" data-question="([^"]+)">([\s\S]*?)<\/fieldset>/g)].map((m) => ({ id:m[1],category:m[2],question:m[3],options:[...m[4].matchAll(/value="([^"]+)"/g)].map((v) => v[1]) }));
  assert.equal(questions.length,25); assert.deepEqual(questions,expected);
  assert.equal(questions.filter((q) => q.options.length === 2).length,8);
});
test("original engine bodies are preserved and scores/gaps/reports match across 500 mixed questionnaires", (context) => {
  context.mock.method(console,"log",() => {});
  for(const name of ["calculateScore","generateGapSummary","generateDiagnosticReport"]) assert.ok(readFileSync("src/lib/audit/engine.js","utf8").includes(originalFunction(name)));
  let seed=8731;
  for(let sample=0;sample<500;sample++) {
    const answers: AuditAnswer[]=questions.map((question) => { seed=(seed * 1664525 + 1013904223) >>> 0; return { category:question.category,question:question.question,value:question.options[seed % question.options.length] }; });
    assert.equal(calculateScore(answers),original.calculateScore(answers));
    assert.equal(generateGapSummary(answers),original.generateGapSummary(answers));
    assert.equal(JSON.stringify(generateDiagnosticReport(answers)),JSON.stringify(original.generateDiagnosticReport(answers)));
  }
});
test("score boundaries and strictly-below-three gaps remain intact", (context) => {
  context.mock.method(console,"log",() => {});
  const answer=(value: AnswerValue): AuditAnswer => ({ category:"strategy",question:"Example",value });
  assert.equal(calculateScore(Array.from({length:25},() => answer("yes"))),100);
  assert.equal(calculateScore(Array.from({length:25},() => answer("no"))),0);
  assert.equal(calculateScore(Array.from({length:30},() => answer("5"))),100);
  assert.equal(generateGapSummary([answer("3")]),"None");
  assert.equal(generateGapSummary([answer("2")]),"Strategy");
  assert.equal(generateGapSummary([answer("yes"),answer("no")]),"None");
  for(const [value,label] of [[0,"Brand structurally weak"],[20,"Brand structurally weak"],[21,"Brand needs major improvement"],[40,"Brand needs major improvement"],[41,"Brand average"],[60,"Brand average"],[61,"Brand strong"],[80,"Brand strong"],[81,"Brand elite"],[100,"Brand elite"]] as const) assert.equal(interpretScore(value),label);
});
test("contact validation retains original rules; extraction stays in original question order", () => {
  const valid={ name:" Test Person ",business:" Test Brand ",phone:"1234567890",email:"test@example.com",website:"" };
  assert.deepEqual(validateContact(valid),{});
  assert.ok(validateContact({...valid,name:"1234"}).name);
  assert.ok(validateContact({...valid,phone:"+911234567890"}).phone);
  assert.ok(validateContact({...valid,email:"invalid"}).email);
  assert.ok(validateContact({...valid,website:"example.com"}).website);
  assert.equal(validateContact({...valid,website:"https://example.com"}).website,undefined);
  const answers=extractAnswers({q25:"5",q1:"yes"}); assert.equal(answers[0].question,questions[0].question); assert.equal(answers[1].question,questions[24].question);
});
test("CSV retains columns and diagnostic summary, quotes data and neutralizes formula cells", () => {
  const record: ClientRecord={id:1,name:'=Test',business:'A, "Brand"',phone:"1234567890",email:"test@example.com",website:"",answers:{},score:80,gaps:"None",diagnosticReport:[{question:"Question?",answer:"YES"}],createdAt:"2026-10-17T00:00:00.000Z"};
  const csv=clientsCSV([record]);
  assert.equal(csv.split("\n")[0],"ID,Name,Business,Phone,Email,Website,Score,Missing Areas,Date,Diagnostic Summary");
  assert.ok(csv.includes("'=Test")); assert.ok(csv.includes('"A, ""Brand"""')); assert.ok(csv.includes("Question?: YES"));
});
