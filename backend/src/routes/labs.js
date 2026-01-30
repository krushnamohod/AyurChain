const express = require("express");
const prisma = require("../lib/prismaClient");

const router = express.Router();

/**
 * GET /api/labs
 * List all labs
 */
router.get("/", async (req, res, next) => {
    try {
        const labs = await prisma.lab.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(labs);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/labs/:id
 * Get lab by ID with their reports
 */
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const lab = await prisma.lab.findUnique({
            where: { id: parseInt(id) },
            include: {
                reports: {
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

        if (!lab) {
            return res.status(404).json({ error: "Lab not found" });
        }

        res.json(lab);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/labs
 * Create a new lab
 */
router.post("/", async (req, res, next) => {
    try {
        const { name, accreditationNo, location } = req.body;

        if (!name) {
            return res.status(400).json({ error: "name is required" });
        }

        const lab = await prisma.lab.create({
            data: {
                name,
                accreditationNo,
                location,
            },
        });

        res.status(201).json(lab);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/labs/:id
 * Update a lab
 */
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, accreditationNo, location } = req.body;

        const lab = await prisma.lab.update({
            where: { id: parseInt(id) },
            data: {
                name,
                accreditationNo,
                location,
            },
        });

        res.json(lab);
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Lab not found" });
        }
        next(error);
    }
});

/**
 * DELETE /api/labs/:id
 * Delete a lab
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.lab.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Lab not found" });
        }
        next(error);
    }
});

module.exports = router;
