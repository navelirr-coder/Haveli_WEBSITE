import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const base=process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const slugs=["choudhary-farm-products","avaia-mind-clinic","studio-haveli","yugma"];
const routes=["/","/services","/work","/contact","/brand-audit",...slugs.map((slug) => `/work/${slug}`)];
for(const route of routes) {
  const response=await fetch(base+route);
  assert.equal(response.status,200,route);
  const html=await response.text();
  for(const href of ["/","/services","/work","/brand-audit","/contact"]) assert.ok(html.includes(`href="${href}"`),`Missing nav ${href} on ${route}`);
  assert.ok(html.includes('id="main-content"'),`Main landmark on ${route}`);
  assert.ok(html.includes('href="#main-content"'),`Skip link on ${route}`);
  console.log(`200 ${route}`);
}
assert.equal((await fetch(base+"/work/nonexistent-project")).status,404);
const legacy=await fetch(base+"/work/avaia",{redirect:"manual"});
assert.equal(legacy.status,308);
assert.equal(legacy.headers.get("location"),"/work/avaia-mind-clinic");
const legacyCFP=await fetch(base+"/work/cfp",{redirect:"manual"});
assert.equal(legacyCFP.status,308);
assert.equal(legacyCFP.headers.get("location"),"/work/choudhary-farm-products");
const workHTML=await (await fetch(base+"/work")).text();
assert.ok(workHTML.includes('href="/work/avaia-mind-clinic"'));
assert.ok(workHTML.includes('href="/work/choudhary-farm-products"'));
const manifest=JSON.parse(readFileSync("src/data/assets.json","utf8").replace(/^\uFEFF/,""));
for(const asset of manifest) { assert.ok(existsSync("public"+decodeURIComponent(asset.publicPath))); assert.equal((await fetch(base+asset.publicPath)).status,200,asset.publicPath); }
const enquiry={name:"QA Test",email:"qa@example.com",business:"QA brand",services:["Brand identity"],overview:"Local verification request, with no delivery configured.",budget:"",timeline:"",companyWebsite:""};
const response=await fetch(base+"/api/enquiry",{method:"POST",headers:{"Content-Type":"application/json",Origin:base},body:JSON.stringify(enquiry)});
if(!process.env.ENQUIRY_WEBHOOK_URL) { assert.equal(response.status,503); assert.match((await response.json()).message,/not been sent/); }
console.log(`Verified ${routes.length} routes, legacy redirect, case-study 404, shared navigation/skip links, ${manifest.length} assets and honest unconfigured enquiry response.`);
