import { PrismaClient, Prisma, UserRole, UserStatus, ServiceType, MissionStatus, MissionUrgency, PostType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const locations = {
    mecs: { address: '10 rue Oberkampf, 75011 Paris', city: 'Paris', postalCode: '75011', latitude: 48.8636, longitude: 2.3746 },
    siham: { address: '25 rue de Charenton, 75012 Paris', city: 'Paris', postalCode: '75012', latitude: 48.8469, longitude: 2.3795 },
};

async function main() {
    console.log('🌱 Start Seeding...');
    // Clean DB
    await prisma.message.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.post.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.reliefMission.deleteMany();
    await prisma.service.deleteMany();
    await prisma.availabilitySlot.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.establishment.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 12);

    // 1. Admin
    await prisma.user.create({
        data: { email: 'admin@lesextras.fr', passwordHash: hashedPassword, role: UserRole.ADMIN, status: UserStatus.VERIFIED },
    });

    // 2. Client (MECS)
    const client = await prisma.user.create({
        data: {
            email: 'directeur@mecs-mimosas.fr', passwordHash: hashedPassword, role: UserRole.CLIENT, status: UserStatus.VERIFIED,
            establishment: {
                create: {
                    name: 'MECS Les Mimosas', siret: '12345678901234', type: 'MECS',
                    address: locations.mecs.address, city: locations.mecs.city, postalCode: locations.mecs.postalCode,
                    latitude: locations.mecs.latitude, longitude: locations.mecs.longitude,
                    contactName: 'Jean Dupont'
                }
            }
        }
    });

    // 3. Extra (Siham)
    const extra = await prisma.user.create({
        data: {
            email: 'siham@lesextras.fr', passwordHash: hashedPassword, role: UserRole.EXTRA, status: UserStatus.VERIFIED,
            profile: {
                create: {
                    firstName: 'Siham', lastName: 'Benali', headline: 'Expert Boxe Educative',
                    bio: 'Coach sportive et educatrice.', hourlyRate: 60,
                    address: locations.siham.address, city: locations.siham.city, postalCode: locations.siham.postalCode,
                    latitude: locations.siham.latitude, longitude: locations.siham.longitude, radiusKm: 35,
                    isVideoEnabled: true, specialties: ['boxe educative', 'sport adapte'] as Prisma.JsonArray,
                    totalMissions: 42, averageRating: 4.9
                }
            }
        }
    });

    // 4. Post Wall (Urgent)
    await prisma.post.create({
        data: {
            authorId: client.id, type: PostType.NEED, title: 'Urgent : Veilleur de nuit ce soir',
            content: 'Absence de derniere minute. 21h a 7h.', category: 'sos-renfort',
            city: locations.mecs.city, latitude: locations.mecs.latitude, longitude: locations.mecs.longitude,
            isPinned: true
        }
    });

    // 5. Mission Renfort
    await prisma.reliefMission.create({
        data: {
            clientId: client.id, title: 'Renfort veilleur de nuit', description: 'Remplacement urgent.',
            jobTitle: 'Surveillant de nuit', urgencyLevel: MissionUrgency.CRITICAL,
            startDate: new Date(), endDate: new Date(Date.now() + 8*3600*1000),
            isNightShift: true, hourlyRate: 22, status: MissionStatus.OPEN,
            city: locations.mecs.city, latitude: locations.mecs.latitude, longitude: locations.mecs.longitude
        }
    });

    console.log('✅ Seeding Done! Login: siham@lesextras.fr / password123');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });