import { prisma } from "../../server/config/db";

export async function seedProfessions() {
    console.log("🌱 Seeding Professions...");

    const professions = [
        "Software Engineer",
        "Student",
        "Data Analyst",
        "UI/UX Designer",
        "Product Manager",
        "DevOps Engineer",
        "Other",
    ];

    for (const title of professions) {
        await prisma.profession.upsert({
            where: { title },
            update: {},
            create: { title },
        });
    }

    console.log("🎉 Professions seeded successfully!");
}