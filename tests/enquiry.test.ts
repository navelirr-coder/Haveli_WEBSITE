import test, { after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateEnquiry, parseEnquiry } from "../src/lib/enquiry";
import { listEnquiries } from "../src/lib/enquiry-store";
import { POST } from "../src/app/api/enquiry/route";

const valid={ name:"Test Person",email:"test@example.com",business:"Test Brand",services:["Brand identity"],overview:"A test project overview.",budget:"",timeline:"",companyWebsite:"" };
const workdir = mkdtempSync(join(tmpdir(), "haveli-enquiry-"));
process.env.ENQUIRY_DATABASE_PATH = join(workdir, "enquiries.db");
after(() => { try { rmSync(workdir, { recursive: true, force: true }); } catch { /* Windows can keep the database file open. */ } });

function request(value: unknown, origin?: string) { return new Request("http://localhost:3000/api/enquiry", { method:"POST",headers:{"Content-Type":"application/json",...(origin ? {Origin:origin} : {})},body:JSON.stringify(value) }); }
function clearNotifications() { delete process.env.ENQUIRY_WEBHOOK_URL; delete process.env.WHATSAPP_CALLMEBOT_APIKEY; }

test("enquiry validates malformed and incomplete inputs", () => {
  assert.equal(parseEnquiry(null),null); assert.equal(parseEnquiry({...valid,services:"identity"}),null);
  assert.deepEqual(validateEnquiry(valid),{});
  assert.ok(validateEnquiry({...valid,email:"bad",services:[],overview:"short"}).overview);
});

test("an enquiry is stored even when no notification channel is connected", async () => {
  const previousWebhook=process.env.ENQUIRY_WEBHOOK_URL; const previousKey=process.env.WHATSAPP_CALLMEBOT_APIKEY;
  clearNotifications();
  try {
    const response=await POST(request({...valid,name:"Stored Person"}));
    assert.equal(response.status,200);
    assert.deepEqual(await response.json(),{ stored:true, notified:false });
    assert.equal(listEnquiries(1)[0].name,"Stored Person");
  } finally {
    if(previousWebhook) process.env.ENQUIRY_WEBHOOK_URL=previousWebhook;
    if(previousKey) process.env.WHATSAPP_CALLMEBOT_APIKEY=previousKey;
  }
});

test("a configured webhook is called once and its acceptance is recorded", async (context) => {
  const previous=process.env.ENQUIRY_WEBHOOK_URL;
  process.env.ENQUIRY_WEBHOOK_URL="https://example.test/enquiries";
  try {
    const mock=context.mock.method(globalThis,"fetch",async () => new Response("",{status:200}));
    const accepted=await POST(request(valid));
    assert.equal(accepted.status,200);
    assert.deepEqual(await accepted.json(),{ stored:true, notified:true });
    assert.equal(mock.mock.callCount(),1);
    mock.mock.mockImplementation(async () => new Response("",{status:500}));
    const rejected=await POST(request(valid));
    assert.equal(rejected.status,200);
    assert.deepEqual(await rejected.json(),{ stored:true, notified:false });
  } finally { if(previous) process.env.ENQUIRY_WEBHOOK_URL=previous; else delete process.env.ENQUIRY_WEBHOOK_URL; }
});

test("a configured WhatsApp key sends one notification with the enquiry", async (context) => {
  const previousWebhook=process.env.ENQUIRY_WEBHOOK_URL; const previousKey=process.env.WHATSAPP_CALLMEBOT_APIKEY;
  delete process.env.ENQUIRY_WEBHOOK_URL; process.env.WHATSAPP_CALLMEBOT_APIKEY="test-key";
  try {
    const mock=context.mock.method(globalThis,"fetch",async () => new Response("",{status:200}));
    const response=await POST(request({...valid,name:"WhatsApp Person"}));
    assert.equal(response.status,200);
    assert.deepEqual(await response.json(),{ stored:true, notified:true });
    assert.equal(mock.mock.callCount(),1);
    const called=new URL(String(mock.mock.calls[0].arguments[0]));
    assert.equal(called.hostname,"api.callmebot.com");
    assert.equal(called.searchParams.get("apikey"),"test-key");
    assert.match(called.searchParams.get("text") ?? "",/WhatsApp Person/);
  } finally {
    if(previousWebhook) process.env.ENQUIRY_WEBHOOK_URL=previousWebhook;
    if(previousKey) process.env.WHATSAPP_CALLMEBOT_APIKEY=previousKey; else delete process.env.WHATSAPP_CALLMEBOT_APIKEY;
  }
});

test("an enquiry that cannot be stored and has no channel is not claimed as received", async () => {
  const previousWebhook=process.env.ENQUIRY_WEBHOOK_URL; const previousKey=process.env.WHATSAPP_CALLMEBOT_APIKEY; const previousPath=process.env.ENQUIRY_DATABASE_PATH;
  clearNotifications();
  process.env.ENQUIRY_DATABASE_PATH=workdir; // A directory cannot be opened as a database.
  try {
    const response=await POST(request(valid));
    assert.equal(response.status,503);
    assert.match((await response.json()).message,/has not been sent/);
  } finally {
    if(previousWebhook) process.env.ENQUIRY_WEBHOOK_URL=previousWebhook;
    if(previousKey) process.env.WHATSAPP_CALLMEBOT_APIKEY=previousKey;
    if(previousPath) process.env.ENQUIRY_DATABASE_PATH=previousPath; else delete process.env.ENQUIRY_DATABASE_PATH;
  }
});

test("invalid submissions and cross-origin requests do not reach delivery", async () => {
  assert.equal((await POST(request({...valid,email:"bad"}))).status,422);
  assert.equal((await POST(request(valid,"https://other.example"))).status,403);
});

test("origin validation uses the incoming host when Next reconstructs an internal URL", async () => {
  const previous=process.env.ENQUIRY_DATABASE_PATH;
  process.env.ENQUIRY_DATABASE_PATH=join(workdir,"enquiries.db");
  try {
    const response=await POST(new Request("http://localhost:3000/api/enquiry",{method:"POST",headers:{"Content-Type":"application/json",Host:"127.0.0.1:3000",Origin:"http://127.0.0.1:3000"},body:JSON.stringify(valid)}));
    assert.equal(response.status,200);
  } finally { if(previous) process.env.ENQUIRY_DATABASE_PATH=previous; }
});
