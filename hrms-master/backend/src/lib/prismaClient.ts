import { PrismaClient } from '@prisma/client';
import { connect } from '@tidbcloud/serverless';
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    // Ensure DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL must be defined for production connectivity.");
    }
    const connection = connect({ url: process.env.DATABASE_URL });
    // @ts-ignore - Bypass stale Prisma preview types cache
    const adapter = new PrismaTiDBCloud(connection);
    // @ts-ignore
    prisma = new PrismaClient({ adapter });
} else {
    // Use a global variable to ensure only one instance is created during hot reloads in development
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;
