import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
})

import express from "express";
import cors from "cors";
import { checkDbConnection } from "./config/db.ts";
import { errorHandler } from "./middleware/errorHandler.middleware.ts";
export async function createServer() {
    await checkDbConnection();

    const app = express();
    app.use(cors());
    app.use(express.json({
        verify: (req: any, res, buf) => {
            req.rawBody = buf;
        }
    }));
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/health', (req, res) => {
        res.status(200).json({ message: 'API working fine...!' });
    });
    
    app.use(errorHandler);

    return app;
}