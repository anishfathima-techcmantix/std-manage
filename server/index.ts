import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { checkDbConnection } from "./config/db.ts";
import { errorHandler } from "./middleware/errorHandler.middleware.ts";
import studentRouter from "./routes/student.route.ts";
import authRoutes from "./routes/auth.route.ts";
import logger from "./utils/logger.ts";

dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
})

export async function createServer() {
    await checkDbConnection();

    const app = express();
    app.use(cors());

    app.use((req, _res, next) => {
        logger.info({ method: req.method, url: req.originalUrl, ip: req.ip });
        next();
    });

    app.use(express.json({
        verify: (req: any, _res, buf) => {
            req.rawBody = buf;
        }
    }));
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/health', (_req, res) => {
        res.status(200).json({ message: 'API working fine...!' });
    });

    // Routes
    app.use('/api/auth', authRoutes);
    app.use("/api/students", studentRouter);

    app.use("/api/*path", (req, res) => {
        logger.warn({ message: "API route not found", method: req.method, url: req.originalUrl });
        res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.originalUrl}` });
    });

    app.use(errorHandler);

    return app;
}