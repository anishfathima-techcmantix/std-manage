import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { prisma } from "../config/db";
import { Request, Response } from "express";
import { AuthenticatedRequest, TokenPayload } from "../middleware/auth.middleware";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;

// 1. Register user
export async function userRegister(req: Request, res: Response) {
    try {
        const { email, password, role } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required!",
            });
        }

        // Check existing user
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "A user account with this email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const createdUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || Role.STUDENT,
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: createdUser,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "User registration failed!",
        });
    }
}

// 2. LOGIN USER
export async function userLogin(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        // Input Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required!",
            });
        }

        // Find User
        const foundUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!foundUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Verify Password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server Error: JWT_SECRET missing in environment variables!",
            });
        }

        // Generate JWT Token
        const payload: TokenPayload = {
            userId: foundUser.id,
            role: foundUser.role,
        };

        const accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRY as any,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            data: {
                accessToken,
                authenticatedUser: {
                    id: foundUser.id,
                    email: foundUser.email,
                    role: foundUser.role,
                },
            },
        });
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: error.message || "Invalid credentials!",
        });
    }
}

// 3. GET CURRENT USER (Protected Profile)
export async function getCurrentUser(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const userId = req.currentUser?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID missing from token",
            });
        }

        // Find User
        const userProfile = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found!",
            });
        }

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