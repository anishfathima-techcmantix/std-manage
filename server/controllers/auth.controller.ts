import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { registerUserAccount, loginUserAccount, getCurrentUserProfile } from "../services/auth.service.js";

// Handles HTTP request for User Registration and sends appropriate HTTP status code & JSON response.
export async function registerController(req: Request, res: Response) {
    try {
        const { email, password, role } = req.body;

        // Basic Input Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required!",
            });
        }

        // Call business logic from Service
        const createdUserData = await registerUserAccount({
            email,
            password,
            role,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: createdUserData,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "User registration failed!",
        });
    }
}

// Handles HTTP request for User Login, authenticates credentials via Service, and returns JWT token.
export async function loginController(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        // Basic Input Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required!",
            });
        }

        // Call authentication logic from Service
        const loginResult = await loginUserAccount({
            email,
            password,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            data: loginResult,
        });
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: error.message || "Invalid credentials!",
        });
    }
}

// Handles HTTP request to return current logged-in user details.
export async function getMeController(req: AuthenticatedRequest, res: Response) {
    try {
        const userId = req.currentUser?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID missing from token",
            });
        }

        const userProfile = await getCurrentUserProfile(userId);

        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully!",
            currentUser: userProfile,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to fetch profile",
        });
    }
}