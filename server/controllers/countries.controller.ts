import { prisma } from "../config/db";
import { Request, Response } from "express";

export async function getCountries(req: Request, res: Response) {
    try {
        const countries = await prisma.country.findMany();
        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch countries" });
    }
}