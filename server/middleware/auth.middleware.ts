import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET;

export interface TokenPayload {
    userId: string;
    role: Role;
}

export interface AuthenticatedRequest extends Request {
    currentUser?: TokenPayload;
}

// Protect middleware
export function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access. No token provided."
        });
    }

    const token = authHeader.split(" ")[1];

    if (!JWT_SECRET) {
        return res.status(500).json({
            success: false,
            message: "Server Error: JWT_SECRET is not configured in .env",
        });
    }

    try {
        req.currentUser = jwt.verify(token, JWT_SECRET) as TokenPayload;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access. Invalid token or expired."
        });
    }
}

// Permit middleware
export function permit(...allowedRoles: Role[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.currentUser) {
            return res.status(403).json({
                success: false,
                message: "Forbidden access. User not authenticated."
            });
        }

        if (!allowedRoles.includes(req.currentUser.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden access. User does not have the required role."
            });
        }

        next();
    };
}