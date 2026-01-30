/**
 * Script to update VRITI-TONER-001 with correct product data
 * and save QR code as image file
 * 
 * Run with: node scripts/updateVritilife.js
 */

const { PrismaClient } = require("@prisma/client");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
    console.log("🌿 Updating Vritilife Facial Toner data...\n");

    // 1. Update the herb to be the actual Facial Toner product
    console.log("📦 Updating product info...");

    const herb = await prisma.herb.update({
        where: { id: 4 },
        data: {
            commonName: "Facial Toner – Vritilife",
            scientificName: "Multi-ingredient Ayurvedic Formula",
            specialty: "Key Ingredients: Aloe Vera (Kanyasara), Cucumber (Tanspusam), Potash Alum (Sphatika). Natural skin toner that balances pH and tightens pores.",
            region: "Made in India",
        },
    });
    console.log(`  ✅ Updated herb: ${herb.commonName}`);

    // 2. Update Manufacturer info
    const farmer = await prisma.farmer.update({
        where: { id: 1 },
        data: {
            name: "Vritilife Ayurvedics Pvt. Ltd.",
            location: "Pune, Maharashtra, India",
            mobile: "+91-9876543210",
        },
    });
    console.log(`  ✅ Updated manufacturer: ${farmer.name}`);

    // 3. Generate and save QR code
    console.log("\n📱 Generating QR code...");

    const batchId = "VRITI-TONER-001";
    const verificationUrl = `http://localhost:5173/verify/${batchId}`;

    const qrOptions = {
        type: "png",
        width: 400,
        margin: 2,
        color: {
            dark: "#1a5f2a",  // AyurChain green
            light: "#ffffff",
        },
    };

    // Save QR as PNG file
    const qrFilePath = path.join(__dirname, "..", "qr-codes", `${batchId}.png`);
    const qrDir = path.dirname(qrFilePath);

    if (!fs.existsSync(qrDir)) {
        fs.mkdirSync(qrDir, { recursive: true });
    }

    await QRCode.toFile(qrFilePath, verificationUrl, qrOptions);
    console.log(`  ✅ QR code saved to: ${qrFilePath}`);

    // Also generate data URL for database
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, { ...qrOptions, type: "image/png" });

    // Update batch with QR code URL
    await prisma.herbBatch.update({
        where: { id: batchId },
        data: {
            qrCodeUrl: qrDataUrl,
        },
    });
    console.log(`  ✅ Updated batch with QR code data`);

    // 4. Print summary
    console.log("\n" + "=".repeat(50));
    console.log("✨ PRODUCT READY FOR VERIFICATION");
    console.log("=".repeat(50));
    console.log(`\n📦 Batch ID: ${batchId}`);
    console.log(`🌿 Product: ${herb.commonName}`);
    console.log(`🏭 Manufacturer: ${farmer.name}`);
    console.log(`📍 Location: ${farmer.location}`);
    console.log(`\n📱 Scan QR or visit: ${verificationUrl}`);
    console.log(`\n📁 QR Code file: ${qrFilePath}`);
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
