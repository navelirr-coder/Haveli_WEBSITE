import type { ClientRecord } from "./types";

// Original columns, report formatting and filename. Escape formula-leading cells too.
export function clientsCSV(clients: ClientRecord[]) {
  const headers = ["ID","Name","Business","Phone","Email","Website","Score","Missing Areas","Date","Diagnostic Summary"];
  const escape = (value: unknown) => {
    if (value === null || value === undefined) return '""';
    let text = String(value);
    if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
    return /[,"\n\r]/.test(text) ? `"${text.replace(/"/g,'""')}"` : text;
  };
  return [headers.join(","), ...clients.map((client) => [client.id,client.name,client.business,client.phone,client.email,client.website,client.score,client.gaps,client.createdAt,(client.diagnosticReport || []).map((item) => `${item.question}: ${item.answer}`).join(" | ")].map(escape).join(","))].join("\n");
}
export function downloadClients(clients: ClientRecord[]) {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2,"0");
  const filename = `studio_haveli_leads_${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}.csv`;
  const url = URL.createObjectURL(new Blob([clientsCSV(clients)], { type:"text/csv;charset=utf-8;" }));
  const link = document.createElement("a"); link.href=url; link.download=filename; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}
