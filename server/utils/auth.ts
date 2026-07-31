import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET;

// User details structure inside the JWT token
export interface TokenPayload {
    userId: string;
    role: Role;
}

// Hashes user plain-text password using bcrypt before storing it in the database.
export async function createHashedPassword(plainUserPassword: string): Promise<string> {
    const encryptionComplexity = 10;
    const secureHashedPassword = await bcrypt.hash(plainUserPassword, encryptionComplexity);

    return secureHashedPassword;
}

// Compares user login input password with stored hashed password from the database.
export async function verifyUserPassword(inputPassword: string, storedHashedPassword: string): Promise<boolean> {
    const isPasswordMatch = await bcrypt.compare(inputPassword, storedHashedPassword);

    return isPasswordMatch;
}

// Generates a signed JWT access token for authenticated users using secret and expiry time.
export function generateUserToken(payloadData: TokenPayload): string {
    const expiresIn = process.env.JWT_EXPIRY;

    if (!JWT_SECRET || !expiresIn) {
        throw new Error("JWT_SECRET or JWT_EXPIRY not configured in env");
    }

    const generatedToken = jwt.sign(payloadData, JWT_SECRET, { expiresIn: expiresIn as any });

    return generatedToken;
}

// Decodes and verifies the incoming JWT token string from client headers to return user payload.
export function verifyUserToken(tokenString: string): TokenPayload {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET not configured in env");
    }

    const decodedUserData = jwt.verify(tokenString, JWT_SECRET) as TokenPayload;

    return decodedUserData;
}