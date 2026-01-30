/**
 * GunDB Migration Script
 * 
 * @intent Migrates existing database entries to GunDB
 * Generates hashes for all batches, processing records, and lab reports
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Use the shared prisma client that works with the server
const prisma = require("../src/lib/prismaClient");
const crypto = require("crypto");
const Gun = require("gun");
require("gun/sea");

// Initialize GunDB
const gun = Gun({
    peers: [
        "https://gun-manhattan.herokuapp.com/gun",
        "https://gun-us.herokuapp.com/gun",
    ],
    localStorage: false,
    radisk: true,
    file: "ayurchain-gun-data",
});

const eventsDb = gun.get("ayurchain-events");

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
    const txId = generateDocId(doc);

    return new Promise((resolve) => {
        eventsDb.get(txId).put(doc, (ack) => {
            if (ack.err) {
                console.error("❌ Error storing:", ack.err);
            }
            resolve(txId);
        });
    });
}

async function migrateBatches() {
    console.log("\n📦 Migrating batches...");

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

        console.log(`  ✅ Batch ${batch.id}: ${txId.slice(0, 16)}...`);
    }
}

async function migrateProcessingRecords() {
    console.log("\n⚙️ Migrating processing records...");

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

        console.log(`  ✅ Processing ${record.id}: ${txId.slice(0, 16)}...`);
    }
}

async function migrateLabReports() {
    console.log("\n🧪 Migrating lab reports...");

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

        console.log(`  ✅ Lab Report ${report.id}: ${txId.slice(0, 16)}...`);
    }
}

async function main() {
    console.log("🚀 Starting GunDB migration...\n");
    console.log("=".repeat(50));

    try {
        await migrateBatches();
        await migrateProcessingRecords();
        await migrateLabReports();

        console.log("\n" + "=".repeat(50));
        console.log("✅ Migration complete!");

        // Give GunDB time to sync
        console.log("\n⏳ Waiting for GunDB sync...");
        await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

main();
