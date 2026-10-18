"use client";

import { useRef, useState } from "react";
import { X, Download, ArrowUpRight, Trash2 } from "lucide-react";
import { readyDatabase, getAllClientRecords, deleteClientById } from "@/lib/audit/database";
import { downloadClients } from "@/lib/audit/export";
import type { ClientRecord } from "@/lib/audit/types";

export function AuditAdmin() {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<ClientRecord | null>(null);
  const [password, setPassword] = useState("");
  const [accessError, setAccessError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ClientRecord | null>(null);
  const accessDialog = useRef<HTMLDialogElement>(null);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const reportTrigger = useRef<HTMLButtonElement | null>(null);
  async function refresh() {
    await readyDatabase();
    setClients(await getAllClientRecords());
  }
  async function access() {
    // Retains the original local-only convenience gate. Not server authentication.
    if (password === "shhhh") {
      accessDialog.current?.close(); setPassword(""); setAccessError(""); setOpen(true); setMessage("");
      try { await refresh(); } catch { setMessage("Local records couldn’t be opened. Browser storage may be unavailable."); }
    } else setAccessError("Access denied. Please check your password.");
  }
  async function remove(client: ClientRecord) {
    if (client.id === undefined) return;
    try { await deleteClientById(client.id); await refresh(); setMessage("Record deleted."); } catch { setMessage("The record couldn’t be deleted. Please try again."); }
    finally { deleteDialog.current?.close(); setPendingDelete(null); }
  }
  async function exportRecords() {
    try { await readyDatabase(); const records = await getAllClientRecords(); if (!records.length) { setMessage("No records available."); return; } downloadClients(records); setMessage("CSV export prepared."); } catch { setMessage("The export couldn’t be prepared. Please try again."); }
  }
  function closeReport() { modal.current?.close(); reportTrigger.current?.focus(); }
  return <section className="audit-admin" aria-label="Local audit records">
    {!open ? <button type="button" className="small-link" onClick={() => { setAccessError(""); accessDialog.current?.showModal(); }}>Admin access <ArrowUpRight size={13} aria-hidden="true" /></button> : <>
      <div className="admin-heading"><div><span className="eyebrow">Local records / This browser</span><h2>Admin dashboard</h2></div><button type="button" className="icon-button" aria-label="Close admin" onClick={() => setOpen(false)}><X /></button></div>
      <p className="admin-note">These records are stored on this device, in this browser. Export a CSV to keep a separate copy.</p>
      <div className="admin-actions"><button type="button" className="pill-button" onClick={exportRecords}>Export CSV<Download size={16} aria-hidden="true" /></button><button type="button" className="small-link" onClick={() => refresh().catch(() => setMessage("Records couldn’t be refreshed."))}>Refresh records</button><span>{clients.length} records</span></div>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Audit client records"><table><thead><tr>{["Name","Business","Phone","Email","Missing areas","Score","Date","Actions"].map((heading) => <th key={heading} scope="col">{heading}</th>)}</tr></thead><tbody>{clients.length ? clients.map((client) => <tr key={client.id}><td>{client.name}</td><td>{client.business}</td><td>{client.phone}</td><td>{client.email}</td><td>{client.gaps}</td><td>{client.score} / 100</td><td>{new Date(client.createdAt).toLocaleString()}</td><td><div className="record-actions"><button type="button" className="small-link" onClick={(event) => { reportTrigger.current=event.currentTarget; setSelected(client); modal.current?.showModal(); }}>View report</button><button type="button" className="icon-button" aria-label={`Delete ${client.business} record`} onClick={() => { setPendingDelete(client); deleteDialog.current?.showModal(); }}><Trash2 size={16} /></button></div></td></tr>) : <tr><td colSpan={8}>No records found.</td></tr>}</tbody></table></div>
    </>}
    {message && <p className="admin-note" role="status">{message}</p>}
    <dialog ref={accessDialog} className="report-dialog admin-access-dialog" aria-labelledby="admin-access-title"><div className="admin-heading"><h2 id="admin-access-title">Admin access</h2><button type="button" className="icon-button" aria-label="Close admin access" onClick={() => accessDialog.current?.close()}><X /></button></div><p className="admin-note">Open the audit records stored in this browser.</p><form onSubmit={(event) => { event.preventDefault(); void access(); }}><div className="field"><label htmlFor="admin-password">Admin password</label><input type="password" id="admin-password" autoComplete="current-password" autoFocus value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(accessError)} aria-describedby={accessError ? "access-error" : undefined} />{accessError && <p id="access-error" className="field-error" role="alert">{accessError}</p>}</div><button type="submit" className="pill-button primary" style={{ marginTop:25 }}>Open dashboard<ArrowRightIcon /></button></form></dialog>
    <dialog ref={deleteDialog} className="report-dialog admin-access-dialog" aria-labelledby="delete-record-title"><h2 id="delete-record-title" className="dialog-heading">Delete this record?</h2><p className="admin-note">Delete record for {pendingDelete?.business}? This cannot be undone.</p><div className="admin-actions"><button type="button" className="pill-button" autoFocus onClick={() => deleteDialog.current?.close()}>Keep record</button><button type="button" className="pill-button primary" onClick={() => { if(pendingDelete) void remove(pendingDelete); }}>Delete record<Trash2 size={16} aria-hidden="true" /></button></div></dialog>
    <dialog ref={modal} className="report-dialog" aria-labelledby="report-title" onCancel={closeReport} onClick={(event) => { if(event.target === event.currentTarget) closeReport(); }}><div className="admin-heading"><h2 id="report-title">Diagnostic report</h2><button type="button" className="icon-button" aria-label="Close report" onClick={closeReport} autoFocus><X /></button></div>{selected && <><div className="report-meta"><p><span>Name</span>{selected.name}</p><p><span>Business</span>{selected.business}</p><p><span>Contact</span>{selected.phone}<br />{selected.email}</p><p><span>Website</span>{selected.website || "Not supplied"}</p><p><span>Brand strength</span>{selected.score} / 100</p><p><span>Missing areas</span>{selected.gaps}</p></div><ol className="report-answers">{selected.diagnosticReport?.length ? selected.diagnosticReport.map((item,index) => <li key={index}><span>{item.question}</span><strong data-answer={item.answer}>{item.answer}</strong></li>) : <li>No detailed questionnaire data saved for this record.</li>}</ol></>}</dialog>
  </section>;
}

function ArrowRightIcon() { return <ArrowUpRight size={16} aria-hidden="true" />; }
