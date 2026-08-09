import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "../../server/config/db";

export async function seedUsers() {
    console.log("🌱 Seeding Users using Prisma connect...");

    const password = await bcrypt.hash("123456", 10);

    const users = [
        {
            name: "Admin",
            email: "admin@gmail.com",
            role: Role.ADMIN,
            countryCode: "IN",
            professionTitle: "Software Engineer",
        },
        {
            name: "Test",
            email: "test@gmail.com",
            role: Role.ADMIN,
            countryCode: "IN",
            professionTitle: "Software Engineer",
        },
        {
            name: "Demo",
            email: "demo@gmail.com",
            role: Role.STUDENT,
            countryCode: "IN",
            professionTitle: "Student",
        },
    ];

    for (const user of users) {
        const seededUser = await prisma.user.upsert({
            where: {
                email: user.email,
            },
            update: {
                password,
                role: user.role,
                country: { connect: { code: user.countryCode } },
                profession: { connect: { title: user.professionTitle } },
            },
            create: {
                name: user.name,
                email: user.email,
                password,
                role: user.role,
                country: { connect: { code: user.countryCode } },
                profession: { connect: { title: user.professionTitle } },
            },
        });

        console.log(`✅ ${seededUser.email} seeded/updated`);
    }

    console.log("🎉 Users seeded successfully!");
}