import { prisma } from "../config/db";
import { Request, Response } from "express";

// Create chapter
export async function createChapter(req: Request, res: Response) {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        const existing = await prisma.chapter.findUnique({ where: { title: title.trim() } });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Chapter with this title already exists",
            });
        }

        const chapter = await prisma.chapter.create({
            data: { title: title.trim(), description: description?.trim() || null },
        });

        return res.status(201).json({
            success: true,
            message: "Chapter created successfully",
            data: chapter,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create chapter",
        });
    }
}

// Get all chapter
export async function getAllChapters(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || "";

        const skip = (page - 1) * limit;

        const whereCondition = search
            ? {
                OR: [
                    { title: { contains: search } },
                    { description: { contains: search } },
                ],
            }
            : {};

        const [chapters, total] = await Promise.all([
            prisma.chapter.findMany({
                where: whereCondition,
                skip,
                take: limit,
                include: {
                    contents: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            pdfUrl: true,
                            createdAt: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.chapter.count({
                where: whereCondition,
            }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            message: "Chapters fetched successfully",
            data: chapters,
            meta: {
                page,
                limit,
                total,
                totalPages,
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch chapters",
        });
    }
}

// Get single chapter by id
export async function getChapterById(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        const chapter = await prisma.chapter.findUnique({
            where: { id },
            include: {
                contents: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        pdfUrl: true,
                        createdAt: true,
                    },
                },
            }
        })

        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chapter fetched successfully",
            data: chapter,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch chapter",
        });
    }
}

// Update chapter
export async function updateChapter(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        const { title, description } = req.body;

        const existingChapter = await prisma.chapter.findUnique({
            where: { id },
        });

        if (!existingChapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found",
            });
        }

        if (title && title.trim() !== existingChapter.title) {
            const duplicate = await prisma.chapter.findUnique({
                where: { title: title.trim() },
            });

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: "Another chapter with this title already exists",
                });
            }
        }

        const updatedChapter = await prisma.chapter.update({
            where: { id },
            data: {
                ...(title !== undefined && { title: title.trim() }),
                ...(description !== undefined && { description: description?.trim() || null }),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Chapter updated successfully",
            data: updatedChapter,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update chapter",
        });
    }
}

// Delete chapter
export async function deleteChapter(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        const existingChapter = await prisma.chapter.findUnique({
            where: { id }
        })

        if (!existingChapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found",
            });
        }

        await prisma.chapter.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: "Chapter and its contents deleted successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete chapter",
        });
    }
}