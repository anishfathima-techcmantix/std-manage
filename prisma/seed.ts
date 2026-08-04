import { prisma } from "../server/config/db.js";
import { seedUsers } from "./seeders/UserSeeder.js";

// Master seed script triggering configured database seeders.
async function main() {
    console.log("🚀 Master Seeding Started...");

    // Execute User Seeder
    await seedUsers();

    console.log("🎉 All Seeders Executed Successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Master Seeding Failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });