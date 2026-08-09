import { prisma } from "../server/config/db.js";
import { seedCountries } from "./seeders/CountrySeeder.js";
import { seedProfessions } from "./seeders/ProfessionSeeder.js";
import { seedUsers } from "./seeders/UserSeeder.js";

async function main() {
    console.log("🚀 Master Seeding Started...");

    await seedProfessions();
    await seedCountries();
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