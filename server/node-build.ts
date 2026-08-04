import path from "path";
import express from "express";
import { createServer } from "./index.ts";
import { prisma } from "./config/db.ts";

const port = process.env.PORT;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../client");

(async () => {
    const app = await createServer();

    // Serve static frontend files
    app.use(express.static(distPath));

    // Handle React Router - serve index.html for all non-API routes
    app.get("/{*path}", (req, res) => {
        if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
            return res.status(404).json({ error: "API endpoint not found" });
        }
        res.sendFile(path.join(distPath, "index.html"));
    });

    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });

    // Graceful shutdown
    ["SIGTERM", "SIGINT"].forEach(signal => {
        process.on(signal, async() => {
            console.log(`🛑 Received ${signal}, shutting down gracefully`);
            await prisma.$disconnect();
            process.exit(0);
        });
    });
})();
