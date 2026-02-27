import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing Users include...');
        const user = await prisma.user.findFirst({
            include: {
                adminBranchRestrictions: true,
                adminDepartmentRestrictions: true
            }
        });
        console.log('User OK:', user ? 'Found User' : 'No User');
    } catch (e) {
        console.error('User query failed:', e);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
