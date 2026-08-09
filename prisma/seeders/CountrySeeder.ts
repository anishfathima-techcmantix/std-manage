import { prisma } from "../../server/config/db";

export async function seedCountries() {
    console.log("🌱 Seeding Countries...");

    const countries = [
        { name: "India", code: "IN" },
        { name: "United States", code: "US" },
        { name: "United Kingdom", code: "GB" },
        { name: "Canada", code: "CA" },
        { name: "Australia", code: "AU" },
        { name: "Germany", code: "DE" },
        { name: "United Arab Emirates", code: "AE" },
        { name: "Singapore", code: "SG" },
    ];

    for (const country of countries) {
        await prisma.country.upsert({
            where: { code: country.code },
            update: { name: country.name },
            create: {
                name: country.name,
                code: country.code,
            },
        });
    }

    console.log("🎉 Countries seeded successfully!");
}