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

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authentication Failed: Missing Authorization Header! Please provide a Bearer Token.",
        });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication Failed: Invalid Token Format! Authorization header must be 'Bearer <token>'.",
        });
    }

    const tokenString = authHeader.split(" ")[1];

    if (!tokenString || tokenString.trim() === "") {
        return res.status(401).json({
            success: false,
            message: "Authentication Failed: Bearer Token string is empty!",
        });
    }

    try {
        const decodedUserData = verifyUserToken(tokenString);
        req.currentUser = decodedUserData;
        next();
    } catch (error: any) {
        return res.status(403).json({
            success: false,
            message: "Authentication Failed: Token is invalid or has expired! Please log in again.",
        });
    }
}

// Checks if the authenticated user has ADMIN role before granting access.
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authenticatedUser = req.currentUser;

    if (!authenticatedUser) {
        return res.status(401).json({
            success: false,
            message: "Access Denied: User authentication required before role authorization!",
        });
    }

    if (authenticatedUser.role !== Role.ADMIN) {
        return res.status(403).json({
            success: false,
            message: `Forbidden Action: Access denied! Your role is '${authenticatedUser.role}'. Only 'ADMIN' role can perform this operation.`,
        });
    }

    next();
}