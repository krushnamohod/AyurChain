const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkBatch() {
    const batch = await prisma.herbBatch.findUnique({
        where: { id: "VRITI-TONER-001" },
        include: {
            herb: true,
            farmer: true,
            processing: { include: { processor: true } },
            labReports: { include: { lab: true } },
        },
    });
    console.log(JSON.stringify(batch, null, 2));
    await prisma.$disconnect();
}

checkBatch();
