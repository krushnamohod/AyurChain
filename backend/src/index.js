require("dotenv").config();
const prisma = require("./lib/prismaClient");
const { initGunDB } = require("./lib/gundb");
const express = require("express");
const cors = require("cors");

// Import routes
const herbsRouter = require("./routes/herbs");
const farmersRouter = require("./routes/farmers");
const processorsRouter = require("./routes/processors");
const labsRouter = require("./routes/labs");
const batchesRouter = require("./routes/batches");
const verifyRouter = require("./routes/verify");
const qrRouter = require("./routes/qr");
const adminRouter = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount routes
app.use("/api/herbs", herbsRouter);
app.use("/api/farmers", farmersRouter);
app.use("/api/processors", processorsRouter);
app.use("/api/labs", labsRouter);
app.use("/api/batches", batchesRouter);
app.use("/api/verify", verifyRouter);
app.use("/api/qr", qrRouter);
app.use("/api/admin", adminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});

// Start server
(async () => {
    try {
        initGunDB();
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🌿 AyurChain API server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
})();

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Closing connections...");
    await prisma.$disconnect();
    process.exit(0);
});
