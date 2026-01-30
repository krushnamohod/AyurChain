const express = require("express");
const prisma = require("../lib/prismaClient");
const blockchain = require("../services/blockchain");
const { generateQRCodeDataUrl } = require("../services/qrService");

const router = express.Router();

/**
 * GET /api/batches
 * List all batches with basic info
 */
router.get("/", async (req, res, next) => {
    try {
        const batches = await prisma.herbBatch.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                herb: true,
                farmer: true,
            },
        });
        res.json(batches);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/batches/:id
 * Get batch by ID with full lifecycle data
 */
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const batch = await prisma.herbBatch.findUnique({
            where: { id },
            include: {
                herb: true,
                farmer: true,
                processing: {
                    include: {
                        processor: true,
                    },
                    orderBy: { createdAt: "asc" },
                },
                labReports: {
                    include: {
                        lab: true,
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
        });

        if (!batch) {
            return res.status(404).json({ error: "Batch not found" });
        }

        res.json(batch);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/batches
 * Create a new batch (Farmer creates at harvest)
 * Triggers blockchain event for batch creation
 */
router.post("/", async (req, res, next) => {
    try {
        const { id, herbId, farmerId, geoLocation, harvestDate, quantity } = req.body;

        // Validation
        if (!id) {
            return res.status(400).json({ error: "Batch ID is required" });
        }
        if (!herbId) {
            return res.status(400).json({ error: "herbId is required" });
        }
        if (!farmerId) {
            return res.status(400).json({ error: "farmerId is required" });
        }

        // Check if batch already exists
        const existingBatch = await prisma.herbBatch.findUnique({ where: { id } });
        if (existingBatch) {
            return res.status(409).json({ error: "Batch with this ID already exists" });
        }

        // Verify herb and farmer exist
        const herb = await prisma.herb.findUnique({ where: { id: parseInt(herbId) } });
        if (!herb) {
            return res.status(400).json({ error: "Herb not found" });
        }

        const farmer = await prisma.farmer.findUnique({ where: { id: parseInt(farmerId) } });
        if (!farmer) {
            return res.status(400).json({ error: "Farmer not found" });
        }

        // Record on blockchain
        const txId = await blockchain.recordBatchCreation({
            id,
            herbId,
            farmerId,
            geoLocation,
            harvestDate: harvestDate || new Date().toISOString(),
        });

        // Generate QR code URL
        const baseUrl = process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 3000}/api`;
        const qrCodeUrl = await generateQRCodeDataUrl(id, baseUrl);

        // Create batch in database
        const batch = await prisma.herbBatch.create({
            data: {
                id,
                herbId: parseInt(herbId),
                farmerId: parseInt(farmerId),
                geoLocation,
                harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
                quantity,
                status: "HARVESTED",
                blockchainTxId: txId,
                qrCodeUrl,
            },
            include: {
                herb: true,
                farmer: true,
            },
        });

        res.status(201).json(batch);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/batches/:id/process
 * Add processing record to a batch
 * Triggers blockchain event for processing
 */
router.post("/:id/process", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { processorId, method, processDate } = req.body;

        // Validation
        if (!processorId) {
            return res.status(400).json({ error: "processorId is required" });
        }

        // Check batch exists
        const batch = await prisma.herbBatch.findUnique({ where: { id } });
        if (!batch) {
            return res.status(404).json({ error: "Batch not found" });
        }

        // Verify processor exists
        const processor = await prisma.processor.findUnique({ where: { id: parseInt(processorId) } });
        if (!processor) {
            return res.status(400).json({ error: "Processor not found" });
        }

        // Record on blockchain
        const txId = await blockchain.recordProcessing({
            batchId: id,
            processorId,
            method,
            processDate: processDate || new Date().toISOString(),
        });

        // Create processing record
        const processingRecord = await prisma.processingRecord.create({
            data: {
                batchId: id,
                processorId: parseInt(processorId),
                method,
                processDate: processDate ? new Date(processDate) : new Date(),
                blockchainTxId: txId,
            },
            include: {
                processor: true,
                batch: true,
            },
        });

        // Update batch status to PROCESSED
        await prisma.herbBatch.update({
            where: { id },
            data: { status: "PROCESSED" },
        });

        res.status(201).json(processingRecord);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/batches/:id/lab-report
 * Add lab report to a batch
 * Triggers blockchain event for lab verification
 */
router.post("/:id/lab-report", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { labId, testDate, result, reportHash } = req.body;

        // Validation
        if (!labId) {
            return res.status(400).json({ error: "labId is required" });
        }
        if (!result || !["PASS", "FAIL"].includes(result)) {
            return res.status(400).json({ error: "result must be 'PASS' or 'FAIL'" });
        }

        // Check batch exists
        const batch = await prisma.herbBatch.findUnique({ where: { id } });
        if (!batch) {
            return res.status(404).json({ error: "Batch not found" });
        }

        // Verify lab exists
        const lab = await prisma.lab.findUnique({ where: { id: parseInt(labId) } });
        if (!lab) {
            return res.status(400).json({ error: "Lab not found" });
        }

        // Record on blockchain
        const txId = await blockchain.recordLabReport({
            batchId: id,
            labId,
            result,
            reportHash,
            testDate: testDate || new Date().toISOString(),
        });

        // Create lab report
        const labReport = await prisma.labReport.create({
            data: {
                batchId: id,
                labId: parseInt(labId),
                testDate: testDate ? new Date(testDate) : new Date(),
                result,
                reportHash,
                blockchainTxId: txId,
            },
            include: {
                lab: true,
                batch: true,
            },
        });

        // Update batch status to LAB_TESTED
        await prisma.herbBatch.update({
            where: { id },
            data: { status: "LAB_TESTED" },
        });

        res.status(201).json(labReport);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/batches/:id
 * Delete a batch (admin only in production)
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        // Delete related records first
        await prisma.labReport.deleteMany({ where: { batchId: id } });
        await prisma.processingRecord.deleteMany({ where: { batchId: id } });
        await prisma.herbBatch.delete({ where: { id } });

        res.status(204).send();
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Batch not found" });
        }
        next(error);
    }
});

module.exports = router;
