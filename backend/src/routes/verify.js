const express = require("express");
const prisma = require("../lib/prismaClient");
const blockchain = require("../services/blockchain");

const router = express.Router();

/**
 * GET /api/verify/:batchId
 * Public verification endpoint
 * Returns full batch traceability data for consumer verification
 */
router.get("/:batchId", async (req, res, next) => {
    try {
        const { batchId } = req.params;

        const batch = await prisma.herbBatch.findUnique({
            where: { id: batchId },
            include: {
                herb: {
                    select: {
                        commonName: true,
                        scientificName: true,
                        specialty: true,
                        region: true,
                        imageUrl: true,
                    },
                },
                farmer: {
                    select: {
                        name: true,
                        location: true,
                    },
                },
                processing: {
                    include: {
                        processor: {
                            select: {
                                name: true,
                                licenseNo: true,
                                location: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "asc" },
                },
                labReports: {
                    include: {
                        lab: {
                            select: {
                                name: true,
                                accreditationNo: true,
                                location: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
        });

        if (!batch) {
            return res.status(404).json({
                verified: false,
                error: "Batch not found",
                message: "This batch ID does not exist in the AyurChain system.",
            });
        }

        // Verify blockchain transactions (optional, for additional trust)
        const blockchainVerifications = [];

        if (batch.blockchainTxId) {
            const verification = await blockchain.verifyTransaction(batch.blockchainTxId);
            blockchainVerifications.push({
                event: "Batch Creation",
                ...verification,
            });
        }

        for (const record of batch.processing) {
            if (record.blockchainTxId) {
                const verification = await blockchain.verifyTransaction(record.blockchainTxId);
                blockchainVerifications.push({
                    event: "Processing",
                    ...verification,
                });
            }
        }

        for (const report of batch.labReports) {
            if (report.blockchainTxId) {
                const verification = await blockchain.verifyTransaction(report.blockchainTxId);
                blockchainVerifications.push({
                    event: "Lab Report",
                    ...verification,
                });
            }
        }

        // Build traceability timeline
        const timeline = [];

        // Harvest event
        timeline.push({
            stage: "HARVESTED",
            date: batch.harvestDate || batch.createdAt,
            actor: batch.farmer.name,
            location: batch.farmer.location || batch.geoLocation,
            details: {
                herbName: batch.herb.commonName,
                scientificName: batch.herb.scientificName,
                quantity: batch.quantity,
                geoLocation: batch.geoLocation,
            },
            blockchainTxId: batch.blockchainTxId,
        });

        // Processing events
        for (const record of batch.processing) {
            timeline.push({
                stage: "PROCESSED",
                date: record.processDate || record.createdAt,
                actor: record.processor.name,
                location: record.processor.location,
                details: {
                    method: record.method,
                    licenseNo: record.processor.licenseNo,
                },
                blockchainTxId: record.blockchainTxId,
            });
        }

        // Lab report events
        for (const report of batch.labReports) {
            timeline.push({
                stage: "LAB_TESTED",
                date: report.testDate || report.createdAt,
                actor: report.lab.name,
                location: report.lab.location,
                details: {
                    result: report.result,
                    accreditationNo: report.lab.accreditationNo,
                    reportHash: report.reportHash,
                },
                blockchainTxId: report.blockchainTxId,
            });
        }

        // Determine final status
        const latestLabReport = batch.labReports[batch.labReports.length - 1];
        const labResult = latestLabReport ? latestLabReport.result : null;

        // Fetch ingredients for multi-ingredient products (e.g., Facial Toner)
        // Ingredient herbs are stored with IDs 10-14
        let ingredients = [];
        if (batch.id === "VRITI-TONER-001") {
            ingredients = await prisma.herb.findMany({
                where: {
                    id: { in: [10, 11, 12, 13, 14] },
                },
                select: {
                    id: true,
                    commonName: true,
                    scientificName: true,
                    specialty: true,
                    region: true,
                    imageUrl: true,
                },
            });
        }

        const response = {
            verified: true,
            batchId: batch.id,
            status: batch.status,
            labResult,
            qrCodeUrl: batch.qrCodeUrl,
            herb: batch.herb,
            ingredients, // Array of ingredient herbs for products
            origin: {
                farmer: batch.farmer.name,
                location: batch.farmer.location || batch.geoLocation,
                harvestDate: batch.harvestDate,
                quantity: batch.quantity,
            },
            timeline,
            blockchainVerifications,
            labReports: batch.labReports, // Include full lab reports
            verifiedAt: new Date().toISOString(),
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
