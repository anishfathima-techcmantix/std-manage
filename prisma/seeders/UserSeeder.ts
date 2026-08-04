import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "../../server/config/db";

// Seeds or updates the default Admin account in the database.
export async function seedUsers() {
    console.log("🌱 Seeding Admin User...");

    const adminEmail = "admin@gmail.com";
    const rawAdminPassword = "123456";

    // Hash plain password
    const hashedAdminPassword = await bcrypt.hash(rawAdminPassword, 10);

    // Upsert ensures password updates if admin already exists
    const seededAdmin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedAdminPassword,
            role: Role.ADMIN,
        },
        create: {
            email: adminEmail,
            password: hashedAdminPassword,
            role: Role.ADMIN,
        },
    });

    console.log("✅ Admin Seeded/Updated Successfully:", seededAdmin.email);
}