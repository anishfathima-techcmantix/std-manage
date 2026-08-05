import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.ts";
import { createStudentProfile, getAllStudentProfiles, getStudentProfileById, updateStudentProfile, deleteStudentProfile } from "../services/student.service.ts";

// Handles HTTP request to create a new student profile for an existing user account.
export async function createStudentProfileController(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId, name, rollNum, phone } = req.body;

        // Basic Input Validation
        if (!userId || !name || !rollNum) {
            return res.status(400).json({
                success: false,
                message: "User ID, Name, and Roll Number are required!",
            });
        }

        const createdProfile = await createStudentProfile({
            userId,
            name,
            rollNum,
            phone,
        });

        return res.status(201).json({
            success: true,
            message: "Student profile created successfully!",
            data: createdProfile,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to create student profile",
        });
    }
}

// Handles HTTP request to fetch all student profiles for Admin dashboard.
export async function getAllStudentProfilesController(_req: AuthenticatedRequest, res: Response) {
    try {
        const studentList = await getAllStudentProfiles();

        return res.status(200).json({
            success: true,
            message: "Student profiles retrieved successfully!",
            data: studentList,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch student profiles",
        });
    }
}

// Handles HTTP request to fetch a specific student profile by ID.
export async function getStudentProfileByIdController(req: AuthenticatedRequest, res: Response) {
    try {
        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid Student Profile ID format",
            });
        }

        const studentProfile = await getStudentProfileById(id);

        return res.status(200).json({
            success: true,
            message: "Student profile retrieved successfully!",
            data: studentProfile,
        });
    } catch (error: any) {
        return res.status(404).json({
            success: false,
            message: error.message || "Student profile not found",
        });
    }
}

// Handles HTTP request to update student profile details.
export async function updateStudentProfileController(req: AuthenticatedRequest, res: Response) {
    try {
        const { id } = req.params;
        const { name, phone } = req.body;

        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid Student Profile ID format",
            });
        }

        const updatedProfile = await updateStudentProfile(id, { name, phone });

        return res.status(200).json({
            success: true,
            message: "Student profile updated successfully!",
            data: updatedProfile,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update student profile",
        });
    }
}

// Handles HTTP request to delete a student profile record by ID.
export async function deleteStudentProfileController(req: AuthenticatedRequest, res: Response) {
    try {
        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid Student Profile ID format",
            });
        }

        const deletedProfile = await deleteStudentProfile(id);

        return res.status(200).json({
            success: true,
            message: "Student profile deleted successfully!",
            data: deletedProfile,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to delete student profile",
        });
    }
}