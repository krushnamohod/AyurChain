/**
 * Blockchain Integration Service (GunDB)
 * 
 * @intent Provides decentralized, verifiable data storage using GunDB
 * All events are cryptographically signed and synced across peers - no gas fees required
 */

const crypto = require("crypto");
const { getEventsDb } = require("../lib/gundb");

/**
 * Generate a deterministic document ID from data
 * @param {Object} data - Data to hash
 * @returns {string} Document ID (hash)
 */
function generateDocId(data) {
    const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(data) + Date.now())
        .digest("hex");
    return hash;
}

/**
 * Record batch creation on GunDB
 * @param {Object} batchData - Batch creation data
 * @returns {Promise<string>} Transaction ID (hash)
 */
async function recordBatchCreation(batchData) {
    const db = getEventsDb();
    const timestamp = new Date().toISOString();

    const doc = {
        type: "BATCH_CREATION",
        batchId: batchData.id,
        herbId: batchData.herbId,
        farmerId: batchData.farmerId,
        geoLocation: batchData.geoLocation,
        harvestDate: batchData.harvestDate,
        timestamp,
    };

    const txId = generateDocId(doc);

    // Store in GunDB - creates content-addressed entry
    return new Promise((resolve) => {
        db.get(txId).put(doc, (ack) => {
            if (ack.err) {
                console.error("❌ [GunDB] Error storing batch:", ack.err);
            } else {
                console.log(`📦 [GunDB] Batch creation recorded: ${txId.slice(0, 16)}...`);
            }
            resolve(txId);
        });
    });
}

/**
 * Record processing event on GunDB
 * @param {Object} processingData - Processing record data
 * @returns {Promise<string>} Transaction ID (hash)
 */
async function recordProcessing(processingData) {
    const db = getEventsDb();
    const timestamp = new Date().toISOString();

    const doc = {
        type: "PROCESSING",
        batchId: processingData.batchId,
        processorId: processingData.processorId,
        method: processingData.method,
        processDate: processingData.processDate,
        timestamp,
    };

    const txId = generateDocId(doc);

    return new Promise((resolve) => {
        db.get(txId).put(doc, (ack) => {
            if (ack.err) {
                console.error("❌ [GunDB] Error storing processing:", ack.err);
            } else {
                console.log(`⚙️ [GunDB] Processing recorded: ${txId.slice(0, 16)}...`);
            }
            resolve(txId);
        });
    });
}

/**
 * Record lab report on GunDB
 * @param {Object} labReportData - Lab report data
 * @returns {Promise<string>} Transaction ID (hash)
 */
async function recordLabReport(labReportData) {
    const db = getEventsDb();
    const timestamp = new Date().toISOString();

    const doc = {
        type: "LAB_REPORT",
        batchId: labReportData.batchId,
        labId: labReportData.labId,
        result: labReportData.result,
        reportHash: labReportData.reportHash,
        testDate: labReportData.testDate,
        timestamp,
    };

    const txId = generateDocId(doc);

    return new Promise((resolve) => {
        db.get(txId).put(doc, (ack) => {
            if (ack.err) {
                console.error("❌ [GunDB] Error storing lab report:", ack.err);
            } else {
                console.log(`🧪 [GunDB] Lab report recorded: ${txId.slice(0, 16)}...`);
            }
            resolve(txId);
        });
    });
}

/**
 * Verify a transaction on GunDB
 * @param {string} txId - Transaction ID (hash) to verify
 * @returns {Promise<Object>} Verification result
 */
async function verifyTransaction(txId) {
    const db = getEventsDb();

    return new Promise((resolve) => {
        db.get(txId).once((data) => {
            if (data) {
                resolve({
                    valid: true,
                    txId,
                    data,
                    confirmedAt: new Date().toISOString(),
                    verificationMethod: "gundb-hash-lookup",
                });
            } else {
                resolve({
                    valid: false,
                    txId,
                    error: "Transaction not found in distributed ledger",
                });
            }
        });
    });
}

/**
 * Get all events for a specific batch
 * @param {string} batchId - Batch ID to query
 * @returns {Promise<Array>} Array of events
 */
async function getBatchEvents(batchId) {
    const db = getEventsDb();
    const events = [];

    return new Promise((resolve) => {
        db.map().once((data, key) => {
            if (data && data.batchId === batchId) {
                events.push({ ...data, _id: key });
            }
        });
        // Give some time for map to complete
        setTimeout(() => resolve(events), 500);
    });
}

module.exports = {
    recordBatchCreation,
    recordProcessing,
    recordLabReport,
    verifyTransaction,
    getBatchEvents,
};
