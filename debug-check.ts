
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 SERVER-SIDE DEBUG: Checking Database Content...');

    try {
        const postCount = await prisma.post.count();
        const serviceCount = await prisma.service.count();
        const missionCount = await prisma.reliefMission.count();

        console.log(`📊 Total Counts: Posts=${postCount}, Services=${serviceCount}, Missions=${missionCount}`);

        if (postCount === 0 && serviceCount === 0) {
            console.log('❌ DATABASE IS EMPTY! Seed did not run or failed silently.');
            return;
        }

        const visiblePosts = await prisma.post.findMany({
            where: { isActive: true },
            take: 3,
            select: { id: true, title: true, isActive: true, validUntil: true }
        });
        console.log('👀 Visible Posts (Sample):', JSON.stringify(visiblePosts, null, 2));

        const visibleServices = await prisma.service.findMany({
            where: { isActive: true },
            take: 3,
            select: { id: true, name: true, isActive: true }
        });
        console.log('👀 Visible Services (Sample):', JSON.stringify(visibleServices, null, 2));

    } catch (e) {
        console.error('❌ Connection/Query Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
