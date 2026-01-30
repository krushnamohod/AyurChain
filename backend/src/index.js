require("dotenv").config();
const prisma = require("./lib/prismaClient");
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
app.listen(PORT, () => {
    console.log(`🌿 AyurChain API server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Closing database connection...");
    await prisma.$disconnect();
    process.exit(0);
});
