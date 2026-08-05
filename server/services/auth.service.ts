import { prisma } from "../config/db";
import { Role } from "@prisma/client";
import { createHashedPassword, verifyUserPassword, generateUserToken } from "../utils/auth.ts";

// Input data structure required for User Registration.
export interface RegisterUserInput {
    email: string;
    password: string;
    role?: Role;
}

// Input data structure required for User Login.
export interface LoginUserInput {
    email: string;
    password: string;
}

// Registers a new user account in the database after checking duplicates and hashing the password.
export async function registerUserAccount(userInput: RegisterUserInput) {
    const { email, password, role } = userInput;

    // Check if a user with the same email already exists
    const existingUserAccount = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingUserAccount) {
        throw new Error("A user account with this email already exists");
    }

    // Encrypt plain text password
    const encryptedPassword = await createHashedPassword(password);

    // Default to STUDENT role if no role is specified
    const assignedRole = role || Role.STUDENT;

    // Create new User record in Database
    const createdUser = await prisma.user.create({
        data: {
            email: email,
            password: encryptedPassword,
            role: assignedRole,
        },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    return createdUser;
}

// Authenticates a user login request and generates a JWT access token upon successful credentials match.
export async function loginUserAccount(userInput: LoginUserInput) {
    const { email, password } = userInput;

    // Find user record by email
    const foundUser = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!foundUser) {
        throw new Error("Invalid email or password");
    }

    // Verify typed password against stored hashed password
    const isPasswordValid = await verifyUserPassword(password, foundUser.password);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT Token containing userId and role
    const accessToken = generateUserToken({
        userId: foundUser.id,
        role: foundUser.role,
    });

    return {
        accessToken,
        authenticatedUser: {
            id: foundUser.id,
            email: foundUser.email,
            role: foundUser.role,
        },
    };
}

// Fetches the logged-in user profile from database using userId.
export async function getCurrentUserProfile(userId: string) {
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
        throw new Error("User profile not found!");
    }

    return userProfile;
}