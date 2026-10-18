/**
 * Studio Haveli Brand Diagnostic System
 * Export Controller
 * Offline iPad Web App
 */

async function exportCSV() {
    try {
        if (typeof getAllClientRecords !== 'function') {
            console.error("Database functions not available. Ensure db.js is loaded.");
            return;
        }

        const clients = await getAllClientRecords();

        if (!clients || clients.length === 0) {
            alert("No records available");
            return;
        }

        const headers = [
            "ID",
            "Name",
            "Business",
            "Phone",
            "Email",
            "Website",
            "Score",
            "Missing Areas",
            "Date",
            "Diagnostic Summary"
        ];

        const escapeCSV = (str) => {
            if (str === null || str === undefined) return '""';
            const strValue = String(str);
            if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
                return `"${strValue.replace(/"/g, '""')}"`;
            }
            return strValue;
        };

        const rows = clients.map(client => {
            const summary = (client.diagnosticReport || [])
                .map(item => `${item.question}: ${item.answer}`)
                .join(' | ');

            return [
                escapeCSV(client.id),
                escapeCSV(client.name),
                escapeCSV(client.business),
                escapeCSV(client.phone),
                escapeCSV(client.email),
                escapeCSV(client.website),
                escapeCSV(client.score),
                escapeCSV(client.gaps),
                escapeCSV(client.createdAt),
                escapeCSV(summary)
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const filename = `studio_haveli_leads_${year}${month}${day}_${hours}${minutes}.csv`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Export failed:", error);
    }
}