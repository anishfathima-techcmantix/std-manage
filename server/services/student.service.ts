import { prisma } from "../config/db";

// Input data structure required to create a new Student Profile.
export interface CreateStudentProfileInput {
    userId: string;
    name: string;
    rollNum: string;
    phone?: string;
}

// Input data structure required to update an existing Student Profile.
export interface UpdateStudentProfileInput {
    name?: string;
    phone?: string;
}

export async function createStudentProfile(inputData: CreateStudentProfileInput) {
    const { userId, name, rollNum, phone } = inputData;

    // Check if roll number already exists
    const existingRollNum = await prisma.studentProfile.findUnique({
        where: { rollNum }
    });

    if (existingRollNum) {
        throw new Error("A student with this Roll Number already exists!");
    }

    const newStudentProfile = await prisma.studentProfile.create({
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

    return newStudentProfile;
}

// Fetches all student profiles from the database along with associated user details.
export async function getAllStudentProfiles() {
    const studentProfilesList = await prisma.studentProfile.findMany({
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

    return studentProfilesList;
}

// Fetches a single student profile by its unique profile ID.
export async function getStudentProfileById(profileId: string) {
    const studentProfile = await prisma.studentProfile.findUnique({
        where: { id: profileId },
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
        throw new Error("Student profile not found!");
    }

    return studentProfile;
}

// Updates existing student profile details (name, phone) in the database.
export async function updateStudentProfile(profileId: string, updateData: UpdateStudentProfileInput) {
    // Check if profile exists
    const existingProfile = await prisma.studentProfile.findUnique({
        where: { id: profileId },
    });

    if (!existingProfile) {
        throw new Error("Student profile not found!");
    }

    // Perform update
    const updatedProfile = await prisma.studentProfile.update({
        where: { id: profileId },
        data: updateData,
    });

    return updatedProfile;
}

// Deletes a student profile record by ID from the database.
export async function deleteStudentProfile(profileId: string) {
    const existingProfile = await prisma.studentProfile.findUnique({
        where: { id: profileId },
    });

    if (!existingProfile) {
        throw new Error("Student profile not found!");
    }

    // Delete profile record
    const deletedProfile = await prisma.studentProfile.delete({
        where: { id: profileId },
    });

    return deletedProfile;
}