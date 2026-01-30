const express = require("express");
const prisma = require("../lib/prismaClient");

const router = express.Router();

/**
 * GET /api/farmers
 * List all farmers
 */
router.get("/", async (req, res, next) => {
    try {
        const farmers = await prisma.farmer.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(farmers);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/farmers/:id
 * Get farmer by ID with their batches
 */
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const farmer = await prisma.farmer.findUnique({
            where: { id: parseInt(id) },
            include: {
                batches: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        herb: true,
                    },
                },
            },
        });

        if (!farmer) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        res.json(farmer);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/farmers
 * Create a new farmer
 */
router.post("/", async (req, res, next) => {
    try {
        const { name, mobile, location } = req.body;

        if (!name) {
            return res.status(400).json({ error: "name is required" });
        }

        const farmer = await prisma.farmer.create({
            data: {
                name,
                mobile,
                location,
            },
        });

        res.status(201).json(farmer);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/farmers/:id
 * Update a farmer
 */
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, mobile, location } = req.body;

        const farmer = await prisma.farmer.update({
            where: { id: parseInt(id) },
            data: {
                name,
                mobile,
                location,
            },
        });

        res.json(farmer);
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Farmer not found" });
        }
        next(error);
    }
});

/**
 * DELETE /api/farmers/:id
 * Delete a farmer
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.farmer.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Farmer not found" });
        }
        next(error);
    }
});

module.exports = router;
