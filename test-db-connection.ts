import { PrismaClient } from '@prisma/client';

const candidates = [
    "postgresql://postgres:password@localhost:5432/les_extras_v2?schema=public",
    "postgresql://postgres:postgres@localhost:5432/les_extras_v2?schema=public",
    "postgresql://postgres:password@localhost:5432/sociopulse?schema=public",
    "postgresql://postgres:postgres@localhost:5432/sociopulse?schema=public",
    "postgresql://postgres:password@localhost:5432/lesextras?schema=public",
    "postgresql://postgres:postgres@localhost:5432/lesextras?schema=public",
];

async function testConnection(url: string) {
    console.log(`Testing ${url}...`);
    const prisma = new PrismaClient({ datasources: { db: { url } } });
    try {
        await prisma.$connect();
        const count = await prisma.user.count(); // Try a simple query
        console.log(`SUCCESS: Connected to ${url}. User count: ${count}`);
        return url;
    } catch (e) {
        console.log(`FAILED: ${url}`);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    for (const url of candidates) {
        const success = await testConnection(url);
        if (success) {
            console.log(`FOUND VALID URL: ${success}`);
            process.exit(0);
        }
    }
    console.log("No valid connection found.");
    process.exit(1);
}

main();
