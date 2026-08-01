import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

const logger = winston.createLogger({
    level: "info",
    format: logFormat,
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, "../logs/error.log"),
            level: "error",
        }),

        new winston.transports.File({
            filename: path.join(__dirname, "../logs/app.log"),
        }),
    ],
});

export default logger;