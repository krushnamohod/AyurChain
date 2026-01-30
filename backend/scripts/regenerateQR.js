/**
 * Script to regenerate QR code with IP address for mobile access
 * 
 * Run with: node scripts/regenerateQR.js
 */

const { PrismaClient } = require("@prisma/client");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// Your local IP address - update this if it changes
const LOCAL_IP = "10.79.32.50";
const FRONTEND_PORT = 8080;

async function main() {
    console.log("📱 Regenerating QR code with IP address...\n");

    const batchId = "VRITI-TONER-001";

    // Use IP address instead of localhost
    const verificationUrl = `http://${LOCAL_IP}:${FRONTEND_PORT}/verify/${batchId}`;

    console.log(`🔗 Verification URL: ${verificationUrl}\n`);

    const qrOptions = {
        type: "png",
        width: 400,
        margin: 2,
        color: {
            dark: "#1a5f2a",
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
    console.log(`✅ QR code saved to: ${qrFilePath}`);

    // Also generate data URL for database
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, { ...qrOptions, type: "image/png" });

    // Update batch with new QR code URL
    await prisma.herbBatch.update({
        where: { id: batchId },
        data: {
            qrCodeUrl: qrDataUrl,
        },
    });
    console.log(`✅ Updated batch with new QR code\n`);

    console.log("=".repeat(50));
    console.log("📱 SCAN THIS QR CODE WITH YOUR PHONE");
    console.log("=".repeat(50));
    console.log(`\n📁 QR Code file: ${qrFilePath}`);
    console.log(`\n🔗 Or visit: ${verificationUrl}`);
    console.log(`\n⚠️  Make sure your phone is on the SAME WiFi network!`);
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
