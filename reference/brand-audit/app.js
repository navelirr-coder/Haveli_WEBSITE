/**
 * Studio Haveli Brand Diagnostic System
 * Main Logic Controller
 * Offline iPad Web App
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("System initialized: Studio Haveli Brand Diagnostic System");

    // --- DOM Elements ---
    const elements = {
        form: document.getElementById('diagnostic-form'),
        btnCalculate: document.getElementById('calculate-score'),
        
        // Inputs
        name: document.getElementById('name'),
        business: document.getElementById('business'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email'),
        website: document.getElementById('website'),
        
        // Errors
        errName: document.getElementById('name-error'),
        errBusiness: document.getElementById('business-error'),
        errPhone: document.getElementById('phone-error'),
        errEmail: document.getElementById('email-error'),
        errWebsite: document.getElementById('website-error'),
        
        // Display
        scoreDisplay: document.getElementById('score-display'),
        scoreNumber: document.getElementById('score-number'),
        scoreText: document.getElementById('score-text'),
        loadingIndicator: document.getElementById('loading-indicator'),
        
        // Admin
        btnAdmin: document.getElementById('admin-access'),
        adminPanel: document.getElementById('admin-panel'),
        btnCloseAdmin: document.getElementById('close-admin'),
        btnExport: document.getElementById('export-data'),
        clientsTableBody: document.querySelector('#clients-table tbody')
    };

    // --- Event Listeners ---
    elements.btnCalculate.addEventListener('click', runDiagnostic);
    elements.btnAdmin.addEventListener('click', verifyAdminAccess);
    elements.btnCloseAdmin.addEventListener('click', closeAdminPanel);
    
    if (elements.btnExport) {
        elements.btnExport.addEventListener('click', () => {
            try {
                if (typeof exportCSV === 'function') {
                    exportCSV();
                } else {
                    console.error("Export function not found in export.js");
                    alert("Export system offline.");
                }
            } catch (error) {
                console.error("Export failed:", error);
            }
        });
    }

    // --- Validation System ---
    function validateForm() {
        try {
            let isValid = true;
            
            // Reset errors
            elements.errName.textContent = '';
            elements.errBusiness.textContent = '';
            elements.errPhone.textContent = '';
            elements.errEmail.textContent = '';
            elements.errWebsite.textContent = '';

            const nameVal = elements.name.value.trim();
            const businessVal = elements.business.value.trim();
            const phoneVal = elements.phone.value.trim();
            const emailVal = elements.email.value.trim();
            const websiteVal = elements.website.value.trim();

            // Name validation (Min 2 chars, not purely numeric)
            if (nameVal.length < 2 || /^\d+$/.test(nameVal)) {
                elements.errName.textContent = "Please enter a valid name.";
                isValid = false;
            }

            // Business validation
            if (businessVal.length < 2) {
                elements.errBusiness.textContent = "Business name required.";
                isValid = false;
            }

            // Phone validation (Exactly 10 digits)
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phoneVal)) {
                elements.errPhone.textContent = "Enter a valid 10-digit phone number.";
                isValid = false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                elements.errEmail.textContent = "Enter a valid email address.";
                isValid = false;
            }

            // Website validation (Optional, but must be valid URL if present)
            if (websiteVal !== '') {
                try {
                    new URL(websiteVal);
                } catch (_) {
                    elements.errWebsite.textContent = "Enter a valid URL (e.g., https://site.com).";
                    isValid = false;
                }
            }

            // Check if all questions are answered
            const fieldsets = document.querySelectorAll('#questionnaire fieldset');
            let unanswered = 0;
            fieldsets.forEach(fs => {
                const checked = fs.querySelector('input[type="radio"]:checked');
                if (!checked) unanswered++;
            });

            if (unanswered > 0) {
                alert(`Please answer all questions. ${unanswered} remaining.`);
                isValid = false;
            }

            return isValid;
        } catch (error) {
            console.error("Validation error:", error);
            return false;
        }
    }

    // --- Scoring & Logic System ---
    function extractAnswers() {
        const answers = [];
        const fieldsets = document.querySelectorAll('#questionnaire fieldset');
        
        fieldsets.forEach(fs => {
            const category = fs.getAttribute('data-category');
            const question = fs.getAttribute('data-question');
            const checked = fs.querySelector('input[type="radio"]:checked');
            
            if (checked) {
                answers.push({
                    category: category,
                    question: question,
                    value: checked.value
                });
            }
        });
        
        return answers;
    }

    function calculateScore(answers) {
        try {
            let totalPoints = 0;
            
            answers.forEach(ans => {
                let points = 0;
                if (ans.value === 'yes') points = 4;
                else if (ans.value === 'no') points = 0;
                else {
                    // Scale 1-5 maps to 0-4 points
                    const scaleVal = parseInt(ans.value, 10);
                    points = scaleVal - 1; 
                }
                totalPoints += points;
            });

            // Ensure score stays strictly within 0 - 100
            totalPoints = Math.max(0, Math.min(100, totalPoints));
            
            console.log("Score calculated:", totalPoints);
            return totalPoints;
        } catch (error) {
            console.error("Score calculation error:", error);
            return 0;
        }
    }

    function generateGapSummary(answers) {
        try {
            const categories = {};
            
            // Group answers by category
            answers.forEach(ans => {
                if (!categories[ans.category]) {
                    categories[ans.category] = { totalRaw: 0, count: 0 };
                }
                
                let rawValue = 0;
                if (ans.value === 'yes') rawValue = 5;
                else if (ans.value === 'no') rawValue = 1;
                else rawValue = parseInt(ans.value, 10);
                
                categories[ans.category].totalRaw += rawValue;
                categories[ans.category].count++;
            });

            const gaps = [];
            // If average is strictly below 3, it's a gap
            for (const cat in categories) {
                const avg = categories[cat].totalRaw / categories[cat].count;
                if (avg < 3) {
                    // Capitalize category name
                    const catName = cat.charAt(0).toUpperCase() + cat.slice(1);
                    gaps.push(catName);
                }
            }

            return gaps.length > 0 ? gaps.join(', ') : 'None';
        } catch (error) {
            console.error("Gap generation error:", error);
            return 'Analysis Error';
        }
    }

    function generateDiagnosticReport(answers) {
        try {
            return answers.map(ans => ({
                question: ans.question,
                answer: ans.value.toUpperCase()
            }));
        } catch (error) {
            console.error("Report generation error:", error);
            return [];
        }
    }

    // --- Core Diagnostic Flow ---
    function runDiagnostic() {
        try {
            console.log("Diagnostic started");
            
            if (!validateForm()) {
                console.log("Diagnostic aborted: Validation failed");
                return;
            }

            // Lock UI & Show Loading
            elements.btnCalculate.disabled = true;
            elements.btnCalculate.textContent = "Analyzing...";
            elements.scoreDisplay.style.display = 'block';
            elements.scoreDisplay.removeAttribute('hidden');
            
            elements.loadingIndicator.style.display = 'block';
            elements.scoreNumber.textContent = "";
            elements.scoreText.textContent = "Checking structural integrity of your brand......";
            elements.scoreText.style.color = "var(--obsidian)";

            // 6-Second Delay Simulation
            setTimeout(() => {
                try {
                    const answers = extractAnswers();
                    const score = calculateScore(answers);
                    const gaps = generateGapSummary(answers);
                    const report = generateDiagnosticReport(answers);

                    displayScore(score);
                    saveClient(score, gaps, report);

                    // Restore UI
                    elements.loadingIndicator.style.display = 'none';
                    elements.btnCalculate.disabled = false;
                    elements.btnCalculate.textContent = "Check My Brand Strength";
                    
                    console.log("Diagnostic completed");
                } catch (innerError) {
                    console.error("Error during diagnostic processing:", innerError);
                    alert("A system error occurred. Please try again.");
                    elements.btnCalculate.disabled = false;
                    elements.btnCalculate.textContent = "Check My Brand Strength";
                }
            }, 6000);
            
        } catch (error) {
            console.error("Diagnostic execution error:", error);
        }
    }

    function displayScore(score) {
        try {
            elements.scoreNumber.textContent = `${score} / 100`;
            
            let interpretation = "";
            if (score <= 20) interpretation = "Brand structurally weak";
            else if (score <= 40) interpretation = "Brand needs major improvement";
            else if (score <= 60) interpretation = "Brand average";
            else if (score <= 80) interpretation = "Brand strong";
            else interpretation = "Brand elite";

            elements.scoreText.textContent = interpretation;
            elements.scoreText.style.color = "var(--text-muted)";
        } catch (error) {
            console.error("Score display error:", error);
        }
    }

    function saveClient(score, gaps, report) {
        try {
            const clientData = {
                name: elements.name.value.trim(),
                business: elements.business.value.trim(),
                phone: elements.phone.value.trim(),
                email: elements.email.value.trim(),
                website: elements.website.value.trim(),
                score: score,
                gaps: gaps,
                diagnosticReport: report,
                createdAt: new Date().toISOString()
            };

            if (typeof saveClientRecord === 'function') {
                saveClientRecord(clientData);
                console.log("Client saved to database");
            } else {
                console.error("Database function saveClientRecord not found in db.js");
            }
        } catch (error) {
            console.error("Save client error:", error);
        }
    }

    // --- Admin System ---
    function verifyAdminAccess() {
        try {
            const pwd = prompt("Enter Studio Haveli Admin Password:");
            if (pwd === "shhhh") {
                console.log("Admin accessed");
                elements.adminPanel.style.display = 'block';
                elements.adminPanel.removeAttribute('hidden');
                loadAdminClients();
                // Scroll to admin panel
                elements.adminPanel.scrollIntoView({ behavior: 'smooth' });
            } else if (pwd !== null) {
                alert("Access denied");
            }
        } catch (error) {
            console.error("Admin verification error:", error);
        }
    }

    function closeAdminPanel() {
        elements.adminPanel.style.display = 'none';
        elements.adminPanel.setAttribute('hidden', 'true');
    }

    async function loadAdminClients() {
        try {
            if (typeof getAllClientRecords === 'function') {
                const clients = await getAllClientRecords();
                
                elements.clientsTableBody.innerHTML = ''; // Clear table
                
                // Sort by newest first
                clients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                clients.forEach(client => {
                    const tr = document.createElement('tr');
                    
                    const dateObj = new Date(client.createdAt);
                    const formattedDate = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

                    tr.innerHTML = `
                        <td>${client.name || 'N/A'}</td>
                        <td>${client.business || 'N/A'}</td>
                        <td>${client.phone || 'N/A'}</td>
                        <td>${client.email || 'N/A'}</td>
                        <td>${client.gaps || 'None'}</td>
                        <td><strong>${client.score || 0}</strong></td>
                        <td>${formattedDate}</td>
                    `;
                    
                    tr.addEventListener('click', () => showDiagnosticModal(client));
                    elements.clientsTableBody.appendChild(tr);
                });
            } else {
                console.error("Database function getAllClientRecords not found in db.js");
                elements.clientsTableBody.innerHTML = '<tr><td colspan="7">Database connection offline.</td></tr>';
            }
        } catch (error) {
            console.error("Load admin clients error:", error);
        }
    }

    // --- Modal System for Full Diagnostic ---
    function showDiagnosticModal(client) {
        try {
            // Remove existing modal if any
            const existingModal = document.getElementById('haveli-modal');
            if (existingModal) existingModal.remove();

            const modalOverlay = document.createElement('div');
            modalOverlay.id = 'haveli-modal';
            Object.assign(modalOverlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(13, 13, 13, 0.8)',
                zIndex: '9999',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            });

            const modalContent = document.createElement('div');
            Object.assign(modalContent.style, {
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '32px',
                width: '100%',
                maxWidth: '680px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                fontFamily: 'Inter, sans-serif'
            });

            // Header Section
            let html = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E5E5E5; padding-bottom: 16px; margin-bottom: 24px;">
                    <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 24px; color: #0D0D0D; margin: 0;">Diagnostic Report</h3>
                    <button id="close-modal" style="background: transparent; border: none; font-size: 24px; cursor: pointer; color: #888888;">&times;</button>
                </div>
                
                <div style="margin-bottom: 32px; font-size: 14px; color: #333333; line-height: 1.6;">
                    <p><strong>Name:</strong> ${client.name}</p>
                    <p><strong>Business:</strong> ${client.business}</p>
                    <p><strong>Contact:</strong> ${client.phone} | ${client.email}</p>
                    <p><strong>Score:</strong> <span style="font-size: 20px; font-family: 'Space Grotesk', sans-serif; font-weight: bold;">${client.score} / 100</span></p>
                    <p><strong>Missing Areas:</strong> <span style="color: #8B0000; font-weight: 500;">${client.gaps || 'None'}</span></p>
                </div>
                
                <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Full Questionnaire</h4>
                <div style="display: flex; flex-direction: column; gap: 12px;">
            `;

            // Report Details
            if (client.diagnosticReport && client.diagnosticReport.length > 0) {
                client.diagnosticReport.forEach((item, index) => {
                    const ans = item.answer.toString();
                    let color = '#333333';
                    
                    // Color coding logic
                    if (ans === 'YES' || ans === '4' || ans === '5') {
                        color = '#8F924A'; // Chartreuse
                    } else if (ans === 'NO' || ans === '1' || ans === '2') {
                        color = '#8B0000'; // Deep Red
                    } else if (ans === '3') {
                        color = '#C0C0C0'; // Chrome Silver for Average
                    }

                    html += `
                        <div style="background: #F5F5F3; padding: 16px; border-radius: 8px; font-size: 13px;">
                            <p style="margin: 0 0 8px 0; color: #0D0D0D; font-weight: 500;">Q${index + 1}. ${item.question}</p>
                            <p style="margin: 0; font-weight: 600; font-family: 'Space Grotesk', sans-serif; color: ${color};">Answer: ${ans}</p>
                        </div>
                    `;
                });
            } else {
                html += `<p style="color: #888888; font-style: italic;">Detailed report data missing.</p>`;
            }

            html += `</div>`;
            modalContent.innerHTML = html;
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);

            // Close Modal Listener
            document.getElementById('close-modal').addEventListener('click', () => {
                modalOverlay.remove();
            });

            // Close on overlay click
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.remove();
                }
            });

        } catch (error) {
            console.error("Modal generation error:", error);
        }
    }
});