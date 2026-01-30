const express = require("express");
const prisma = require("../lib/prismaClient");

const router = express.Router();

/**
 * GET /api/herbs
 * List all herbs
 */
router.get("/", async (req, res, next) => {
    try {
        const herbs = await prisma.herb.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(herbs);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/herbs/:id
 * Get herb by ID with its batches
 */
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const herb = await prisma.herb.findUnique({
            where: { id: parseInt(id) },
            include: {
                batches: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!herb) {
            return res.status(404).json({ error: "Herb not found" });
        }

        res.json(herb);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/herbs
 * Create a new herb
 */
router.post("/", async (req, res, next) => {
    try {
        const { commonName, scientificName, specialty, region, imageUrl } = req.body;

        if (!commonName) {
            return res.status(400).json({ error: "commonName is required" });
        }

        const herb = await prisma.herb.create({
            data: {
                commonName,
                scientificName,
                specialty,
                region,
                imageUrl,
            },
        });

        res.status(201).json(herb);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/herbs/:id
 * Update a herb
 */
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { commonName, scientificName, specialty, region, imageUrl } = req.body;

        const herb = await prisma.herb.update({
            where: { id: parseInt(id) },
            data: {
                commonName,
                scientificName,
                specialty,
                region,
                imageUrl,
            },
        });

        res.json(herb);
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Herb not found" });
        }
        next(error);
    }
});

/**
 * DELETE /api/herbs/:id
 * Delete a herb
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.herb.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Herb not found" });
        }
        next(error);
    }
});

module.exports = router;
