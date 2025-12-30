
import { PrismaClient } from '@prisma/client';
import { WallFeedService } from './apps/api/src/wall-feed/wall-feed.service';
import { PrismaService } from './apps/api/src/common/prisma/prisma.service';

// Mock ConfigService and other deps if needed, but here we just need Prisma + Service logic
// Actually, it's easier to just query Prisma directly to see if data exists and matches the WHERE clause of the service.

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Debugging Wall Feed Data...');

    // 1. Check raw counts
    const postCount = await prisma.post.count();
    const serviceCount = await prisma.service.count();
    const missionCount = await prisma.reliefMission.count();
    console.log(`📊 Total Counts: Posts=${postCount}, Services=${serviceCount}, Missions=${missionCount}`);

    // 2. Check "Active" status
    // We suspect isActive might be false or missing
    const activePosts = await prisma.post.count({ where: { isActive: true } });
    const inactivePosts = await prisma.post.count({ where: { isActive: false } });
    console.log(`📝 Posts Status: Active=${activePosts}, Inactive=${inactivePosts}`);

    const activeServices = await prisma.service.count({ where: { isActive: true } });
    console.log(`🛍️ Services Active: ${activeServices}`);

    // 3. Simulate Feed Query (simplified from WallFeedService)
    // The service uses: isActive: true, AND [validUntil >= now OR validUntil is null]
    const feedItems = await prisma.post.findMany({
        where: {
            isActive: true, // key filter
            OR: [
                { validUntil: null },
                { validUntil: { gte: new Date() } }
            ]
        },
        take: 5,
        select: { id: true, title: true, isActive: true, validUntil: true }
    });

    console.log('👀 Visible Feed Items (Post):', feedItems);

    if (feedItems.length === 0 && postCount > 0) {
        console.error('❌ PROBLEM FOUND: Posts exist but are not visible!');
        if (inactivePosts === postCount) {
            console.error('   -> All posts are INACTIVE (isActive=false). Fix seed!');
        }
    } else {
        console.log('✅ Data seems visible query-wise.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
