import test from "node:test";
import assert from "node:assert/strict";
import { indexedDB } from "fake-indexeddb";
import { readyDatabase, saveClientRecord, getAllClientRecords, deleteClientById, getClientCount, clearAllClients } from "../src/lib/audit/database.js";
import type { ClientRecord } from "../src/lib/audit/types";

test("existing IndexedDB schema and records survive new audit initialization; save/list/delete/count/clear work", async (context) => {
  context.mock.method(console,"log",() => {});
  Object.assign(globalThis,{ window:{indexedDB}, indexedDB });
  const legacy: ClientRecord={name:"Existing person",business:"Existing brand",phone:"1234567890",email:"test@example.com",website:"",answers:{},score:50,gaps:"None",diagnosticReport:[],createdAt:"2025-01-01T00:00:00.000Z"};
  const legacyDB=await new Promise<IDBDatabase>((resolve,reject) => { const request=indexedDB.open("studio_haveli_db",1); request.onupgradeneeded=() => request.result.createObjectStore("clients",{keyPath:"id",autoIncrement:true}); request.onerror=() => reject(request.error); request.onsuccess=() => resolve(request.result); });
  await new Promise<void>((resolve,reject) => { const transaction=legacyDB.transaction("clients","readwrite"); transaction.objectStore("clients").add(legacy); transaction.oncomplete=() => resolve(); transaction.onerror=() => reject(transaction.error); }); legacyDB.close();
  const db=await readyDatabase(); assert.equal(db.name,"studio_haveli_db"); assert.equal(db.version,1); assert.ok(db.objectStoreNames.contains("clients"));
  assert.equal(await getClientCount(),1);
  assert.equal((await getAllClientRecords())[0].business,"Existing brand");
  const id=await saveClientRecord({...legacy,name:"New person",business:"New brand",answers:{q1:"yes"},score:100,createdAt:"2026-10-17T00:00:00.000Z"});
  assert.equal(await getClientCount(),2);
  const records=await getAllClientRecords(); assert.equal(records[0].id,id); assert.equal(records[0].answers.q1,"yes"); assert.equal(records[1].business,"Existing brand");
  await deleteClientById(id); assert.equal(await getClientCount(),1);
  await clearAllClients(); assert.equal(await getClientCount(),0);
  db.close();
});
