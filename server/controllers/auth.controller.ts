import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { prisma } from "../config/db";
import { Request, Response } from "express";
import { AuthenticatedRequest, TokenPayload } from "../middleware/auth.middleware";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;

// Register User
export async function userRegister(req: Request, res: Response) {
    try {
        const { name, email, password, role, countryId, professionId } = req.body;

        if (!name || !email || !password || !countryId || !professionId) {
            return res.status(400).json({
                success: false,
                message: "Name, Email, Password, Country, and Profession are required!",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "A user with this email already exists!",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || Role.STUDENT,
                countryId,
                professionId,
            },
            include: {
                country: true,
                profession: true,
            },
        });

        const { password: _, ...userData } = createdUser;

        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: userData,
        });
    }
    catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "User registration failed!",
        });
    }
}

// Login User
export async function userLogin(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required!"
            })
        }

        const foundUser = await prisma.user.findUnique({
            where: { email },
            include: {
                country: true,
                profession: true
            }
        })

        if (!foundUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials!"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials!"
            })
        }

        if (!JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server Error: JWT_SECRET missing in environment variables!",
            })
        }

        const payload: TokenPayload = {
            userId: foundUser.id,
            role: foundUser.role
        }

        const accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: (JWT_EXPIRY || "1d") as any,
        });

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            data: {
                accessToken,
                authenticatedUser: {
                    id: foundUser.id,
                    name: foundUser.name,
                    email: foundUser.email,
                    role: foundUser.role,
                    country: foundUser.country,
                    profession: foundUser.profession,
                },
            }
        })
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: error.message || "Invalid credentials!",
        });
    }
}

// Get current user
export async function getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
        const userId = req.currentUser?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID missing from token",
            });
        }

        const userProfile = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                country: true,
                profession: true,
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