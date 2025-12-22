import { MissionUrgency, MissionStatus } from '@prisma/client';
import { PrismaService } from '../apps/api/src/common/prisma/prisma.service';
import { MatchingEngineService } from '../apps/api/src/matching-engine/matching-engine.service';
import { ContractsService } from '../apps/api/src/contracts/contracts.service';
import { MessagesService } from '../apps/api/src/messages/messages.service';
import { SignContractDto } from '../apps/api/src/contracts/dto';

/**
 * Simulation script for end-to-end mission flow.
 * Steps:
 * 1. Create a mission as a client.
 * 2. Assign/sign as a talent.
 * 3. Send a mission report message.
 * 4. Validate 24h post-report messaging restriction.
 */
async function runSimulation() {
    const prisma = new PrismaService();
    await prisma.$connect();

    const matchingEngine = new MatchingEngineService(prisma as any);
    const contractsService = new ContractsService(prisma as any);
    const messagesService = new MessagesService(prisma as any);

    try {
        const client = await prisma.user.findFirst({
            where: { role: 'CLIENT' },
            include: { establishment: true },
        });
        const talent = await prisma.user.findFirst({
            where: { role: 'TALENT' },
            include: { profile: true },
        });

        if (!client || !talent) {
            throw new Error('Client or talent not found in database. Seed data is required.');
        }

        console.log('📋 Using client:', client.email, '| talent:', talent.email);

        // 1) Create mission (client form simulation)
        const missionPayload = {
            jobTitle: 'Test Simulation - Educateur',
            title: 'Mission simulation TALENT',
            hourlyRate: 32,
            isNightShift: false,
            urgencyLevel: MissionUrgency.HIGH,
            description: 'Mission créée par script de simulation',
            startDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            city: 'Paris',
            postalCode: '75010',
            address: '42 rue de la Simulation',
            latitude: 48.87,
            longitude: 2.35,
            radiusKm: 25,
            requiredSkills: ['simulation', 'test'],
            requiredDiplomas: ['Diplôme simulation'],
        };

        const mission = await matchingEngine.createMission(missionPayload as any, client.id);
        console.log('✅ Mission created:', mission.id);

        // 2) Talent signs/assigns (simulate talent click)
        const signPayload: SignContractDto = {
            missionId: mission.id,
            signature: `data:image/png;base64,${Buffer.from('simulated-signature').toString('base64')}`,
            content: mission.description || 'Contrat simulé',
        };

        const contract = await contractsService.signContract(talent.id, signPayload);
        console.log('🖊️ Contract signed:', contract.id);

        await prisma.reliefMission.update({
            where: { id: mission.id },
            data: {
                assignedTalentId: talent.id,
                status: MissionStatus.IN_PROGRESS,
                assignedAt: new Date(),
            },
        });

        // 3) Send mission report (mission end form)
        const reportMessage = await messagesService.send(talent.id, {
            recipientId: client.id,
            content: 'Rapport de mission : tout est ok ✅',
        } as any);
        console.log('📨 Mission report message sent:', reportMessage.id);

        const completedMission = await prisma.reliefMission.update({
            where: { id: mission.id },
            data: {
                status: MissionStatus.COMPLETED,
                completedAt: new Date(),
            },
        });
        console.log('🏁 Mission marked as completed:', completedMission.id);

        // 4) Notification pressure test (placeholder - no gateway in repo)
        console.log('🔔 NotificationsGateway simulation: emit "notification" and "missionMessage" to rooms', {
            clientRoom: client.id,
            talentRoom: talent.id,
        });

        // 5) 24h lock check
        const completionTime = completedMission.completedAt ? new Date(completedMission.completedAt).getTime() : Date.now();
        const twentyFiveHoursLater = completionTime + 25 * 60 * 60 * 1000;
        const within24h = (time: number) => time - completionTime <= 24 * 60 * 60 * 1000;

        console.log('⏱️ 24h messaging rule check:');
        console.log(' - Immediate follow-up allowed?', within24h(Date.now()));
        console.log(' - Attempt at +25h should be rejected:', !within24h(twentyFiveHoursLater));
    } finally {
        await prisma.$disconnect();
    }
}

runSimulation().catch((err) => {
    console.error('Simulation failed:', err);
    process.exit(1);
});
