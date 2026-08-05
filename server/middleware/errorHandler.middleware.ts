import logger from "../utils/logger.ts";
import { Prisma } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
    status?: number;
    code?: string;
}

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = err.status || 500;
    let message = err?.message || "Internal Server Error";

    // Handle Prisma Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = 400; // Most known request errors are bad requests
        switch (err.code) {
            case "P2002":
                message = `Unique constraint failed on field: ${err.meta?.target} (Code: ${err.code})`;
                break;
            case "P2025":
                message = `Record not found (Code: ${err.code})`;
                break;
            case "P2003":
                message = `Foreign key constraint failed (Code: ${err.code})`;
                break;
            case "P2021":
                message = `Table does not exist (Code: ${err.code})`;
                break;
            default:
                message = `${err.message} (Code: ${err.code})`;
        }
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Database validation error: " + err.message;
    }

    logger.error({
        message: message,
        method: req.method,
        url: req.originalUrl,
        status: statusCode,
        stack: err.stack,
    });

    res.status(statusCode).json({
        success: false,
        message: message,
        code: err.code || undefined
    });
};