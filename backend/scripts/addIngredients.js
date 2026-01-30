/**
 * Script to add ingredient herbs for Vritilife Facial Toner
 * 
 * Run with: node scripts/addIngredients.js
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("🌿 Adding ingredient herbs for Facial Toner...\n");

    // Create/Update individual ingredient herbs
    const ingredients = [
        {
            id: 10,
            commonName: "Aloe Vera",
            scientificName: "Aloe barbadensis",
            specialty: "Soothing & hydrating. Known as Kanyasara in Ayurveda. Used for skin healing and moisturization.",
            region: "India, Africa",
        },
        {
            id: 11,
            commonName: "Cucumber",
            scientificName: "Cucumis sativus",
            specialty: "Cooling & refreshing. Known as Tanspusam in Ayurveda. Rich in antioxidants, reduces puffiness.",
            region: "India, Mediterranean",
        },
        {
            id: 12,
            commonName: "Potash Alum",
            scientificName: "Potassium Aluminum Sulfate",
            specialty: "Natural astringent mineral. Known as Sphatika in Ayurveda. Tightens pores and purifies skin.",
            region: "Mineral",
        },
        {
            id: 13,
            commonName: "Phenoxyethanol",
            scientificName: "Phenoxyethanol",
            specialty: "Natural preservative derived from green tea. Ensures product shelf life and safety.",
            region: "Synthetic/Natural",
        },
        {
            id: 14,
            commonName: "Excipients Base",
            scientificName: "Purified Water & Emulsifiers",
            specialty: "Natural base ingredients that ensure proper formulation and application.",
            region: "Pharmaceutical Grade",
        },
    ];

    for (const ing of ingredients) {
        const herb = await prisma.herb.upsert({
            where: { id: ing.id },
            update: ing,
            create: ing,
        });
        console.log(`  ✅ Added: ${herb.commonName}`);
    }

    console.log("\n✨ All ingredients added!");
    console.log("\nIngredient IDs for VRITI-TONER-001: 10, 11, 12, 13, 14");
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
