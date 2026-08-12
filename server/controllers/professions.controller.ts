import { prisma } from "../config/db";
import { Request, Response } from "express";

export async function getProfessions(req: Request, res: Response) {
    try {
        const professions = await prisma.profession.findMany();
        res.json(professions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch professions" });
    }
}