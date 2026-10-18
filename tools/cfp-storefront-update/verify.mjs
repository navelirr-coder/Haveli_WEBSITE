import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const stage=path.dirname(fileURLToPath(import.meta.url));
const patch=JSON.parse(await readFile(path.join(stage,'patch-manifest.json'),'utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const name of patch.files) {
  const expected=await readFile(path.join(stage,name));
  assert.equal(hash(await readFile(path.join(patch.target,name))),hash(expected),name);
  const response=await fetch('http://127.0.0.1:3012/'+name.split('/').map(encodeURIComponent).join('/'));
  assert.equal(response.status,200,name);
  assert.equal(hash(Buffer.from(await response.arrayBuffer())),hash(expected),`Served original bytes: ${name}`);
}
for(const [name,expected] of Object.entries(patch.unchanged)) assert.equal(hash(await readFile(path.join(patch.target,name))),expected,name);
for(const route of ['shop.html?category=turmeric','product-details.html?product=turmeric-fingers','product-details.html?product=turmeric-powder','contact.html?enquiry=turmeric-fingers']) assert.equal((await fetch('http://127.0.0.1:3012/'+route)).status,200,route);
console.log('Verified all 10 applied/served files byte-for-byte, four relevant routes, unchanged carousel logic/shared CSS and original slide artwork.');
