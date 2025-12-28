const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const mockUserId = "401d5da0-d29f-446e-8d38-25ac507e07a8";

    const user = await prisma.user.upsert({
        where: { id: mockUserId },
        update: {},
        create: {
            id: mockUserId,
            email: 'demo@citizen.com',
            name: 'Demo Citizen',
            role: 'CITIZEN',
        },
    });

    console.log({ user });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
