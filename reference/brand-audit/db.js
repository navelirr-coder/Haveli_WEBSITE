/**
 * Studio Haveli Brand Diagnostic System
 * IndexedDB Database Engine
 * Offline iPad Web App
 */

let db;
const DB_NAME = 'studio_haveli_db';
const DB_VERSION = 1;
const STORE_NAME = 'clients';

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            console.error("IndexedDB is not supported in this browser.");
            reject(new Error("IndexedDB not supported"));
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                console.log(`Object store '${STORE_NAME}' created.`);
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("Database initialized: " + DB_NAME);
            resolve(db);
        };

        request.onerror = (event) => {
            console.error("Database initialization error:", event.target.error);
            reject(event.target.error);
        };
    });
}

function saveClientRecord(clientData) {
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error("Database not initialized. Cannot save record.");
            reject(new Error("Database not initialized"));
            return;
        }

        try {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // Create a clean record object with safe fallbacks
            const cleanRecord = {
                name: clientData?.name || "Unknown",
                business: clientData?.business || "Unknown",
                phone: clientData?.phone || "",
                email: clientData?.email || "",
                website: clientData?.website || "",
                answers: clientData?.answers || {},
                score: typeof clientData?.score === 'number' ? clientData.score : 0,
                gaps: clientData?.gaps || "None",
                diagnosticReport: Array.isArray(clientData?.diagnosticReport) ? clientData.diagnosticReport : [],
                createdAt: clientData?.createdAt || new Date().toISOString()
            };

            const request = store.add(cleanRecord);

            request.onsuccess = (event) => {
                resolve(event.target.result); // Returns the new auto-incremented ID
            };

            request.onerror = (event) => {
                console.error("Error saving client record:", event.target.error);
                reject(event.target.error);
            };
        } catch (error) {
            console.error("Transaction error in saveClientRecord:", error);
            reject(error);
        }
    });
}

function getAllClientRecords() {
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error("Database not initialized. Cannot fetch records.");
            resolve([]); // Return empty safe array to prevent crashes
            return;
        }

        try {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = (event) => {
                const records = event.target.result || [];
                // Sort by createdAt descending (newest first)
                records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                resolve(records);
            };

            request.onerror = (event) => {
                console.error("Error fetching client records:", event.target.error);
                resolve([]); // Safe fallback
            };
        } catch (error) {
            console.error("Transaction error in getAllClientRecords:", error);
            resolve([]); // Safe fallback
        }
    });
}

function deleteClientById(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error("Database not initialized.");
            reject(new Error("Database not initialized"));
            return;
        }

        try {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = (event) => {
                console.error(`Error deleting client with id ${id}:`, event.target.error);
                reject(event.target.error);
            };
        } catch (error) {
            console.error("Transaction error in deleteClientById:", error);
            reject(error);
        }
    });
}

function clearAllClients() {
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error("Database not initialized.");
            reject(new Error("Database not initialized"));
            return;
        }

        try {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = (event) => {
                console.error("Error clearing database:", event.target.error);
                reject(event.target.error);
            };
        } catch (error) {
            console.error("Transaction error in clearAllClients:", error);
            reject(error);
        }
    });
}

function getClientCount() {
    return new Promise((resolve, reject) => {
        if (!db) {
            resolve(0); // Safe fallback
            return;
        }

        try {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.count();

            request.onsuccess = (event) => {
                resolve(event.target.result || 0);
            };

            request.onerror = (event) => {
                console.error("Error counting clients:", event.target.error);
                resolve(0); // Safe fallback
            };
        } catch (error) {
            console.error("Transaction error in getClientCount:", error);
            resolve(0); // Safe fallback
        }
    });
}

// Auto-initialize the database when the script loads
initializeDatabase().catch(error => console.error("Failed to automatically initialize database:", error));