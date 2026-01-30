const express = require("express");
const prisma = require("../lib/prismaClient");
const { generateQRCodeDataUrl, generateQRCodeBuffer } = require("../services/qrService");

const router = express.Router();

/**
 * GET /api/qr/:batchId
 * Generate QR code for batch verification
 * Query params:
 *   - format: 'dataurl' (default) or 'image'
 */
router.get("/:batchId", async (req, res, next) => {
    try {
        const { batchId } = req.params;
        const { format = "dataurl" } = req.query;

        // Verify batch exists
        const batch = await prisma.herbBatch.findUnique({
            where: { id: batchId },
            select: { id: true, qrCodeUrl: true },
        });

        if (!batch) {
            return res.status(404).json({ error: "Batch not found" });
        }

        const baseUrl = process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 3000}/api`;

        if (format === "image") {
            // Return as PNG image
            const buffer = await generateQRCodeBuffer(batchId, baseUrl);
            res.setHeader("Content-Type", "image/png");
            res.setHeader("Content-Disposition", `inline; filename="qr-${batchId}.png"`);
            res.send(buffer);
        } else {
            // Return as data URL (default)
            const dataUrl = await generateQRCodeDataUrl(batchId, baseUrl);
            res.json({
                batchId,
                qrCodeDataUrl: dataUrl,
                verificationUrl: `${baseUrl}/verify/${batchId}`,
            });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/qr/:batchId/regenerate
 * Regenerate and update QR code for a batch
 */
router.post("/:batchId/regenerate", async (req, res, next) => {
    try {
        const { batchId } = req.params;

        // Verify batch exists
        const batch = await prisma.herbBatch.findUnique({
            where: { id: batchId },
        });

        if (!batch) {
            return res.status(404).json({ error: "Batch not found" });
        }

        const baseUrl = process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 3000}/api`;
        const qrCodeUrl = await generateQRCodeDataUrl(batchId, baseUrl);

        // Update batch with new QR code
        const updatedBatch = await prisma.herbBatch.update({
            where: { id: batchId },
            data: { qrCodeUrl },
            select: {
                id: true,
                qrCodeUrl: true,
            },
        });

        res.json({
            message: "QR code regenerated successfully",
            batchId: updatedBatch.id,
            qrCodeUrl: updatedBatch.qrCodeUrl,
            verificationUrl: `${baseUrl}/verify/${batchId}`,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
