/**
 * Studio Haveli Brand Diagnostic System
 * Admin Panel Controller
 * Offline iPad Web App
 */

// --- Admin Access Control ---
function verifyAdminAccess() {
    const pwd = prompt("Enter Studio Haveli Admin Password:");
    if (pwd === "shhhh") {
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            adminPanel.style.display = 'block';
            adminPanel.removeAttribute('hidden');
            adminPanel.scrollIntoView({ behavior: 'smooth' });
        }
        loadAdminClients();
    } else if (pwd !== null) {
        alert("Access denied");
    }
}

// --- Load Clients Table ---
async function loadAdminClients() {
    try {
        const tbody = document.querySelector('#clients-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#888888; padding: 24px;">Scanning database...</td></tr>';

        if (typeof getAllClientRecords !== 'function') {
            throw new Error("Database functions not available");
        }

        const clients = await getAllClientRecords();

        if (!clients || clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#888888; padding: 24px;">No records found</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        
        clients.forEach(client => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';

            const dateObj = new Date(client.createdAt);
            const dateStr = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

            tr.innerHTML = `
                <td>${client.name || '-'}</td>
                <td>${client.business || '-'}</td>
                <td>${client.phone || '-'}</td>
                <td>${client.email || '-'}</td>
                <td style="color:#8B0000; font-weight:500;">${client.gaps || 'None'}</td>
                <td><strong>${client.score || 0}</strong></td>
                <td>${dateStr}</td>
                <td style="text-align: center;">
                    <button class="delete-client-btn" style="background:transparent; border:none; color:#C0C0C0; font-family:'Space Grotesk', sans-serif; font-size:16px; cursor:pointer; padding:4px 8px; transition:color 0.2s;">&times;</button>
                </td>
            `;

            // Hover effect for delete button
            const deleteBtn = tr.querySelector('.delete-client-btn');
            deleteBtn.addEventListener('mouseenter', () => deleteBtn.style.color = '#8B0000');
            deleteBtn.addEventListener('mouseleave', () => deleteBtn.style.color = '#C0C0C0');

            // Delete action (Stop propagation to prevent modal open)
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(`Delete record for ${client.business}? This cannot be undone.`)) {
                    await deleteClientById(client.id);
                    loadAdminClients(); // Refresh table
                }
            });

            // Open Modal
            tr.addEventListener('click', () => {
                showDiagnosticModal(client);
            });

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading admin clients:", error);
        const tbody = document.querySelector('#clients-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#8B0000; padding: 24px;">Error connecting to database</td></tr>';
        }
    }
}

// --- Diagnostic Report Modal ---
function showDiagnosticModal(client) {
    // Remove old modal if exists
    const existingModal = document.getElementById('haveli-diagnostic-modal');
    if (existingModal) existingModal.remove();

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'haveli-diagnostic-modal';
    Object.assign(modalOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(13, 13, 13, 0.85)',
        zIndex: '10000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px'
    });

    const modalContent = document.createElement('div');
    Object.assign(modalContent.style, {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
        fontFamily: 'Inter, sans-serif'
    });

    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E5E5E5; padding-bottom: 20px; margin-bottom: 32px;">
            <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 24px; color: #0D0D0D; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Diagnostic Report</h3>
            <button id="close-modal-btn" style="background: transparent; border: none; font-size: 32px; cursor: pointer; color: #888888; line-height: 1;">&times;</button>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; background: #F5F5F3; padding: 24px; border-radius: 12px;">
            <div><span style="font-size:12px; color:#888888; text-transform:uppercase; letter-spacing:0.05em;">Client Name</span><br><span style="font-size:16px; font-weight:600; color:#0D0D0D;">${client.name || 'N/A'}</span></div>
            <div><span style="font-size:12px; color:#888888; text-transform:uppercase; letter-spacing:0.05em;">Business Entity</span><br><span style="font-size:16px; font-weight:600; color:#0D0D0D;">${client.business || 'N/A'}</span></div>
            <div><span style="font-size:12px; color:#888888; text-transform:uppercase; letter-spacing:0.05em;">Brand Score</span><br><span style="font-size:32px; font-family:'Space Grotesk', sans-serif; font-weight:700; color:#0D0D0D;">${client.score || 0}</span><span style="font-size:16px; color:#888888;"> / 100</span></div>
            <div><span style="font-size:12px; color:#888888; text-transform:uppercase; letter-spacing:0.05em;">Missing Areas</span><br><span style="font-size:15px; color:#8B0000; font-weight:500;">${client.gaps || 'None'}</span></div>
        </div>
        
        <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.08em; color: #0D0D0D;">Full Questionnaire Breakdown</h4>
        <div style="display: flex; flex-direction: column; gap: 0;">
    `;

    if (client.diagnosticReport && client.diagnosticReport.length > 0) {
        client.diagnosticReport.forEach((item, index) => {
            const rawAns = item.answer ? item.answer.toString().toUpperCase() : '';
            let color = '#333333'; // Default
            let formattedAns = rawAns;
            
            // Color logic for High/Yes and Low/No
            if (rawAns === 'YES' || rawAns === '4' || rawAns === '5') {
                color = '#8F924A'; // Chartreuse
            } else if (rawAns === 'NO' || rawAns === '1' || rawAns === '2') {
                color = '#8B0000'; // Deep Red
            } else if (rawAns === '3') {
                color = '#888888'; // Neutral Average
            }

            html += `
                <div style="border-bottom: 1px solid #E5E5E5; padding: 16px 0; display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;">
                    <div style="font-size: 14px; color: #333333; flex: 1; line-height: 1.5;">
                        <span style="color:#888888; font-family:'Space Grotesk', sans-serif; margin-right:8px;">${String(index + 1).padStart(2, '0')}.</span> 
                        ${item.question}
                    </div>
                    <div style="font-weight: 600; font-family: 'Space Grotesk', sans-serif; color: ${color}; font-size: 16px; white-space: nowrap;">
                        ${formattedAns}
                    </div>
                </div>
            `;
        });
    } else {
        html += `<p style="color: #888888; font-style: italic; font-size: 14px;">No detailed questionnaire data saved for this record.</p>`;
    }

    html += `</div>`;
    
    modalContent.innerHTML = html;
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Event Listeners for Modal
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        modalOverlay.remove();
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
}

// --- Initialization & Event Binding ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Bind Admin Access Button (Make sure to remove old listeners if app.js also binds it)
    const btnAdminAccess = document.getElementById('admin-access');
    if (btnAdminAccess) {
        // Cloning removes previously attached event listeners to prevent double firing
        const newBtnAdminAccess = btnAdminAccess.cloneNode(true);
        btnAdminAccess.parentNode.replaceChild(newBtnAdminAccess, btnAdminAccess);
        newBtnAdminAccess.addEventListener('click', verifyAdminAccess);
    }

    // Bind Close Admin Button
    const btnCloseAdmin = document.getElementById('close-admin');
    if (btnCloseAdmin) {
        btnCloseAdmin.addEventListener('click', () => {
            const adminPanel = document.getElementById('admin-panel');
            if (adminPanel) {
                adminPanel.style.display = 'none';
                adminPanel.setAttribute('hidden', 'true');
            }
        });
    }

    // Bind Export Button
    const btnExport = document.getElementById('export-data');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            if (typeof exportCSV === 'function') {
                exportCSV();
            } else {
                console.error("exportCSV function not found. Ensure export.js is linked properly.");
                alert("Export system is currently offline.");
            }
        });
    }
});