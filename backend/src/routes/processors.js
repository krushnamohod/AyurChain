const express = require("express");
const prisma = require("../lib/prismaClient");

const router = express.Router();

/**
 * GET /api/processors
 * List all processors
 */
router.get("/", async (req, res, next) => {
    try {
        const processors = await prisma.processor.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(processors);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/processors/:id
 * Get processor by ID with their processing records
 */
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const processor = await prisma.processor.findUnique({
            where: { id: parseInt(id) },
            include: {
                records: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        batch: {
                            include: {
                                herb: true,
                            },
                        },
                    },
                },
            },
        });

        if (!processor) {
            return res.status(404).json({ error: "Processor not found" });
        }

        res.json(processor);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/processors
 * Create a new processor
 */
router.post("/", async (req, res, next) => {
    try {
        const { name, licenseNo, location } = req.body;

        if (!name) {
            return res.status(400).json({ error: "name is required" });
        }

        const processor = await prisma.processor.create({
            data: {
                name,
                licenseNo,
                location,
            },
        });

        res.status(201).json(processor);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/processors/:id
 * Update a processor
 */
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, licenseNo, location } = req.body;

        const processor = await prisma.processor.update({
            where: { id: parseInt(id) },
            data: {
                name,
                licenseNo,
                location,
            },
        });

        res.json(processor);
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Processor not found" });
        }
        next(error);
    }
});

/**
 * DELETE /api/processors/:id
 * Delete a processor
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.processor.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Processor not found" });
        }
        next(error);
    }
});

module.exports = router;
