/**
 * Admin Routes for maintenance tasks
 * 
 * @intent Provides admin endpoints for system maintenance like GunDB migration
 */

const express = require("express");
const prisma = require("../lib/prismaClient");
const crypto = require("crypto");
const { getEventsDb } = require("../lib/gundb");

const router = express.Router();

/**
 * Generate a deterministic document ID from data
 */
function generateDocId(data) {
    const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(data) + Date.now())
        .digest("hex");
    return hash;
}

/**
 * Store in GunDB and return hash
 */
async function storeInGunDB(doc) {
    const db = getEventsDb();
    const txId = generateDocId(doc);

    return new Promise((resolve) => {
        db.get(txId).put(doc, (ack) => {
            if (ack.err) {
                console.error("❌ Error storing:", ack.err);
            }
            resolve(txId);
        });
    });
}

/**
 * POST /api/admin/migrate-gundb
 * Migrate all existing entries to GunDB with new hashes
 */
router.post("/migrate-gundb", async (req, res, next) => {
    try {
        console.log("🚀 Starting GunDB migration via API...");

        const results = {
            batches: [],
            processing: [],
            labReports: [],
        };

        // Migrate batches
        const batches = await prisma.herbBatch.findMany({
            include: { herb: true, farmer: true }
        });

        for (const batch of batches) {
            const doc = {
                type: "BATCH_CREATION",
                batchId: batch.id,
                herbId: batch.herbId,
                farmerId: batch.farmerId,
                geoLocation: batch.geoLocation,
                harvestDate: batch.harvestDate?.toISOString(),
                timestamp: batch.createdAt.toISOString(),
            };

            const txId = await storeInGunDB(doc);

            await prisma.herbBatch.update({
                where: { id: batch.id },
                data: { blockchainTxId: txId }
            });

            results.batches.push({ id: batch.id, txId: txId.slice(0, 16) + "..." });
            console.log(`  ✅ Batch ${batch.id}: ${txId.slice(0, 16)}...`);
        }

        // Migrate processing records
        const records = await prisma.processingRecord.findMany({
            include: { processor: true }
        });

        for (const record of records) {
            const doc = {
                type: "PROCESSING",
                batchId: record.batchId,
                processorId: record.processorId,
                method: record.method,
                processDate: record.processDate?.toISOString(),
                timestamp: record.createdAt.toISOString(),
            };

            const txId = await storeInGunDB(doc);

            await prisma.processingRecord.update({
                where: { id: record.id },
                data: { blockchainTxId: txId }
            });

            results.processing.push({ id: record.id, txId: txId.slice(0, 16) + "..." });
            console.log(`  ✅ Processing ${record.id}: ${txId.slice(0, 16)}...`);
        }

        // Migrate lab reports
        const reports = await prisma.labReport.findMany({
            include: { lab: true }
        });

        for (const report of reports) {
            const doc = {
                type: "LAB_REPORT",
                batchId: report.batchId,
                labId: report.labId,
                result: report.result,
                reportHash: report.reportHash,
                testDate: report.testDate?.toISOString(),
                timestamp: report.createdAt.toISOString(),
            };

            const txId = await storeInGunDB(doc);

            await prisma.labReport.update({
                where: { id: report.id },
                data: { blockchainTxId: txId }
            });

            results.labReports.push({ id: report.id, txId: txId.slice(0, 16) + "..." });
            console.log(`  ✅ Lab Report ${report.id}: ${txId.slice(0, 16)}...`);
        }

        console.log("✅ Migration complete!");

        res.json({
            success: true,
            message: "Migration completed successfully",
            results,
            summary: {
                batches: results.batches.length,
                processing: results.processing.length,
                labReports: results.labReports.length,
            }
        });
    } catch (error) {
        console.error("❌ Migration failed:", error);
        next(error);
    }
});

module.exports = router;
