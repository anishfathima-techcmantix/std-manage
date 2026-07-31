import { Request, Response, NextFunction } from "express";
import { verifyUserToken, TokenPayload } from "../utils/auth.js";
import { Role } from "@prisma/client";

// Extends Express Request object to hold logged-in user data.
export interface AuthenticatedRequest extends Request {
    currentUser?: TokenPayload;
}

// Verifies the JWT Bearer token from incoming request headers to authenticate the user.
export function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access Denied: Please log in first!",
        });
    }

    const tokenString = authHeader.split(" ")[1];

    try {
        const decodedUserData = verifyUserToken(tokenString);
        req.currentUser = decodedUserData;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token. Please log in again.",
        });
    }
}

// Checks if the authenticated user has ADMIN role before granting access.
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authenticatedUser = req.currentUser;

    if (!authenticatedUser || authenticatedUser.role !== Role.ADMIN) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Only Admins can perform this action!",
        });
    }

    next();
}