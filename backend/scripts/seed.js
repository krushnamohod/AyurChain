/**
 * Seed Script for AyurChain
 * 
 * @intent Populates database with sample herbs, farmers, and batches for testing
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...\n");

    // Create Herbs
    console.log("🌿 Creating herbs...");
    const herbs = await Promise.all([
        prisma.herb.create({
            data: {
                commonName: "Ashwagandha",
                scientificName: "Withania somnifera",
                specialty: "Adaptogen, Stress Relief",
                region: "Rajasthan, India",
            },
        }),
        prisma.herb.create({
            data: {
                commonName: "Tulsi",
                scientificName: "Ocimum sanctum",
                specialty: "Immunity, Respiratory Health",
                region: "Maharashtra, India",
            },
        }),
        prisma.herb.create({
            data: {
                commonName: "Brahmi",
                scientificName: "Bacopa monnieri",
                specialty: "Memory, Cognitive Function",
                region: "Kerala, India",
            },
        }),
        prisma.herb.create({
            data: {
                commonName: "Turmeric",
                scientificName: "Curcuma longa",
                specialty: "Anti-inflammatory, Antioxidant",
                region: "Tamil Nadu, India",
            },
        }),
        prisma.herb.create({
            data: {
                commonName: "Neem",
                scientificName: "Azadirachta indica",
                specialty: "Skin Health, Blood Purifier",
                region: "Uttar Pradesh, India",
            },
        }),
    ]);
    console.log(`  ✅ Created ${herbs.length} herbs`);

    // Create Farmers
    console.log("\n👨‍🌾 Creating farmers...");
    const farmers = await Promise.all([
        prisma.farmer.create({
            data: {
                name: "Ramesh Patel",
                mobile: "+91 9876543210",
                location: "Jaipur, Rajasthan",
            },
        }),
        prisma.farmer.create({
            data: {
                name: "Suresh Kumar",
                mobile: "+91 9876543211",
                location: "Pune, Maharashtra",
            },
        }),
        prisma.farmer.create({
            data: {
                name: "Lakshmi Devi",
                mobile: "+91 9876543212",
                location: "Kochi, Kerala",
            },
        }),
    ]);
    console.log(`  ✅ Created ${farmers.length} farmers`);

    // Create Processors
    console.log("\n🏭 Creating processors...");
    const processors = await Promise.all([
        prisma.processor.create({
            data: {
                name: "AyurProcess Ltd",
                licenseNo: "AP-2024-001",
                location: "Bangalore, Karnataka",
            },
        }),
        prisma.processor.create({
            data: {
                name: "Vedic Herbs Processing",
                licenseNo: "VHP-2024-002",
                location: "Mumbai, Maharashtra",
            },
        }),
    ]);
    console.log(`  ✅ Created ${processors.length} processors`);

    // Create Labs
    console.log("\n🧪 Creating labs...");
    const labs = await Promise.all([
        prisma.lab.create({
            data: {
                name: "NABL Certified Labs",
                accreditationNo: "NABL-TC-1234",
                location: "Delhi, India",
            },
        }),
        prisma.lab.create({
            data: {
                name: "AyurQuality Testing",
                accreditationNo: "AQT-2024-567",
                location: "Chennai, India",
            },
        }),
    ]);
    console.log(`  ✅ Created ${labs.length} labs`);

    // Create Batches with full supply chain
    console.log("\n📦 Creating batches...");

    // Batch 1: Ashwagandha - Full journey
    const batch1 = await prisma.herbBatch.create({
        data: {
            id: "BATCH001",
            herbId: herbs[0].id,
            farmerId: farmers[0].id,
            geoLocation: "26.9124° N, 75.7873° E",
            harvestDate: new Date("2024-01-15"),
            quantity: "500 kg",
            status: "LAB_TESTED",
        },
    });

    await prisma.processingRecord.create({
        data: {
            batchId: batch1.id,
            processorId: processors[0].id,
            method: "Sun-dried, Ground to powder",
            processDate: new Date("2024-01-20"),
        },
    });

    await prisma.labReport.create({
        data: {
            batchId: batch1.id,
            labId: labs[0].id,
            testDate: new Date("2024-01-25"),
            result: "PASS",
            reportHash: "QmXyZ123...",
        },
    });

    // Batch 2: Tulsi - Processed
    const batch2 = await prisma.herbBatch.create({
        data: {
            id: "BATCH002",
            herbId: herbs[1].id,
            farmerId: farmers[1].id,
            geoLocation: "18.5204° N, 73.8567° E",
            harvestDate: new Date("2024-02-01"),
            quantity: "300 kg",
            status: "PROCESSED",
        },
    });

    await prisma.processingRecord.create({
        data: {
            batchId: batch2.id,
            processorId: processors[1].id,
            method: "Cold extraction",
            processDate: new Date("2024-02-05"),
        },
    });

    // Batch 3: Brahmi - Just harvested
    await prisma.herbBatch.create({
        data: {
            id: "BATCH003",
            herbId: herbs[2].id,
            farmerId: farmers[2].id,
            geoLocation: "9.9312° N, 76.2673° E",
            harvestDate: new Date("2024-02-10"),
            quantity: "200 kg",
            status: "HARVESTED",
        },
    });

    console.log("  ✅ Created 3 batches with supply chain data");

    console.log("\n" + "=".repeat(50));
    console.log("✅ Seeding complete!");
    console.log("\nSummary:");
    console.log(`  🌿 Herbs: ${herbs.length}`);
    console.log(`  👨‍🌾 Farmers: ${farmers.length}`);
    console.log(`  🏭 Processors: ${processors.length}`);
    console.log(`  🧪 Labs: ${labs.length}`);
    console.log("  📦 Batches: 3");
    console.log("\nNext: Run migration to add GunDB hashes:");
    console.log("  curl -X POST http://localhost:3000/api/admin/migrate-gundb");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
