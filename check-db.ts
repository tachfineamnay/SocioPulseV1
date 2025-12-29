import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.post.count();
    const services = await prisma.service.count();
    const missions = await prisma.reliefMission.count();

    console.log(`Posts: ${posts}`);
    console.log(`Services: ${services}`);
    console.log(`Missions: ${missions}`);

    // Check active/open ones
    const activePosts = await prisma.post.count({ where: { isActive: true } });
    const activeServices = await prisma.service.count({ where: { isActive: true } });
    const openMissions = await prisma.reliefMission.count({ where: { status: 'OPEN', startDate: { gte: new Date() } } });

    console.log(`Active Posts: ${activePosts}`);
    console.log(`Active Services: ${activeServices}`);
    console.log(`Open Future Missions: ${openMissions}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
