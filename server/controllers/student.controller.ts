import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { prisma } from "../config/db";

// Student profile creation
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

    // Check if roll number already exists
    const existingRollNum = await prisma.studentProfile.findUnique({
      where: { rollNum },
    });

    if (existingRollNum) {
      return res.status(400).json({
        success: false,
        message: "A student with this Roll Number already exists!",
      });
    }

    // Create Student Profile in Database
    const createdProfile = await prisma.studentProfile.create({
      data: {
        userId,
        name,
        rollNum,
        phone,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
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

// Get all student profiles
export async function getAllStudentProfilesController(_req: AuthenticatedRequest, res: Response) {
  try {
    const studentList = await prisma.studentProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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

// PURPOSE: Handles HTTP request to fetch a specific student profile by ID.
export async function getStudentProfileByIdController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid Student Profile ID format",
      });
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found!",
      });
    }

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

// PURPOSE: Handles HTTP request to update student profile details (name, phone).
export async function updateStudentProfileController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid Student Profile ID format",
      });
    }

    const existingProfile = await prisma.studentProfile.findUnique({
      where: { id },
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found!",
      });
    }

    const updatedProfile = await prisma.studentProfile.update({
      where: { id },
      data: { name, phone },
    });

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

// PURPOSE: Handles HTTP request to delete a student profile record by ID.
export async function deleteStudentProfileController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid Student Profile ID format",
      });
    }

    const existingProfile = await prisma.studentProfile.findUnique({
      where: { id },
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found!",
      });
    }

    const deletedProfile = await prisma.studentProfile.delete({
      where: { id },
    });

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