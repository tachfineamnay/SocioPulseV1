import { PrismaClient, UserRole, UserStatus, ServiceType, MissionStatus, MissionUrgency, PostType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// =============================================================================
// GEOCODING HELPER (API Adresse Gouvernement)
// =============================================================================
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const encoded = encodeURIComponent(address);
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encoded}&limit=1`);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].geometry.coordinates;
            console.log(`📍 Geocoded "${address}" → [${lat.toFixed(4)}, ${lng.toFixed(4)}]`);
            return { lat, lng };
        }
        return null;
    } catch (error) {
        console.error(`❌ Geocoding failed for: ${address}`);
        return null;
    }
}

// =============================================================================
// MAIN SEED FUNCTION
// =============================================================================
async function main() {
    console.log('🌱 Starting database seeding...\n');

    // Clean existing data
    await prisma.message.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.review.deleteMany();
    await prisma.post.deleteMany();
    await prisma.missionApplication.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.reliefMission.deleteMany();
    await prisma.service.deleteMany();
    await prisma.availabilitySlot.deleteMany();
    await prisma.talentPoolMember.deleteMany();
    await prisma.talentPool.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.establishment.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Database cleaned\n');

    // =============================================================================
    // 1. ADMIN USER
    // =============================================================================
    const adminPassword = await bcrypt.hash('admin123!', 12);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@lesextras.fr',
            passwordHash: adminPassword,
            phone: '+33600000001',
            role: UserRole.ADMIN,
            status: UserStatus.VERIFIED,
            emailVerified: new Date(),
        },
    });
    console.log('👤 Admin created: admin@lesextras.fr');

    // =============================================================================
    // 2. ÉTABLISSEMENT - MECS Les Mimosas (Paris 11ème)
    // =============================================================================
    const mecsPassword = await bcrypt.hash('mecs2024!', 12);
    const mecsAddress = '10 rue Oberkampf, 75011 Paris';
    const mecsGeo = await geocodeAddress(mecsAddress);

    const mecsUser = await prisma.user.create({
        data: {
            email: 'contact@mecs-mimosas.fr',
            passwordHash: mecsPassword,
            phone: '+33145670000',
            role: UserRole.CLIENT,
            status: UserStatus.VERIFIED,
            emailVerified: new Date(),
            establishment: {
                create: {
                    name: 'MECS Les Mimosas',
                    siret: '12345678901234',
                    type: 'MECS',
                    description: 'Maison d\'Enfants à Caractère Social accueillant des adolescents en difficulté sociale et familiale. Capacité de 30 places.',
                    address: mecsAddress,
                    city: 'Paris',
                    postalCode: '75011',
                    latitude: mecsGeo?.lat,
                    longitude: mecsGeo?.lng,
                    phone: '+33145670000',
                    logoUrl: null,
                },
            },
        },
        include: { establishment: true },
    });
    console.log('🏢 Établissement created: MECS Les Mimosas (Paris 11ème)');

    // =============================================================================
    // 3. EXTRA STAR - Siham (Paris 12ème) - Experte Boxe Éducative
    // =============================================================================
    const sihamPassword = await bcrypt.hash('siham2024!', 12);
    const sihamAddress = '25 rue de Charenton, 75012 Paris';
    const sihamGeo = await geocodeAddress(sihamAddress);

    const sihamUser = await prisma.user.create({
        data: {
            email: 'siham.coaching@email.com',
            passwordHash: sihamPassword,
            phone: '+33612345678',
            role: UserRole.EXTRA,
            status: UserStatus.VERIFIED,
            emailVerified: new Date(),
            stripeOnboarded: true,
            profile: {
                create: {
                    firstName: 'Siham',
                    lastName: 'Benali',
                    avatarUrl: null,
                    bio: 'Coach sportive et éducatrice spécialisée depuis 8 ans. Je propose des ateliers de Psycho-Boxe qui permettent aux jeunes de canaliser leurs émotions à travers le sport. Méthode douce et bienveillante.',
                    headline: 'Coach Sportive - Psycho-Boxe Éducative',
                    specialties: JSON.stringify(['boxe éducative', 'psycho-boxe', 'gestion des émotions', 'sport adapté', 'adolescents']),
                    diplomas: JSON.stringify([
                        { name: 'BPJEPS Sport', year: 2016, url: null },
                        { name: 'DEES - Éducateur Spécialisé', year: 2018, url: null },
                        { name: 'Certificat Psycho-Boxe', year: 2020, url: null },
                    ]),
                    hourlyRate: 55,
                    address: sihamAddress,
                    city: 'Paris',
                    postalCode: '75012',
                    latitude: sihamGeo?.lat,
                    longitude: sihamGeo?.lng,
                    radiusKm: 30,
                    isVideoEnabled: true,
                    totalMissions: 45,
                    totalBookings: 78,
                    averageRating: 4.9,
                    totalReviews: 32,
                },
            },
        },
        include: { profile: true },
    });
    console.log('⭐ Extra Star created: Siham (Psycho-Boxe, Paris 12ème)');

    // =============================================================================
    // 4. AUTRES EXTRAS
    // =============================================================================

    // Extra 2 - Thomas (Art-thérapie, Paris 15ème)
    const thomasPassword = await bcrypt.hash('thomas2024!', 12);
    const thomasAddress = '45 rue de Vaugirard, 75015 Paris';
    const thomasGeo = await geocodeAddress(thomasAddress);

    const thomasUser = await prisma.user.create({
        data: {
            email: 'thomas.arttherapie@email.com',
            passwordHash: thomasPassword,
            phone: '+33623456789',
            role: UserRole.EXTRA,
            status: UserStatus.VERIFIED,
            emailVerified: new Date(),
            profile: {
                create: {
                    firstName: 'Thomas',
                    lastName: 'Moreau',
                    bio: 'Art-thérapeute certifié, j\'accompagne les publics fragilisés à travers l\'expression artistique. Spécialités : peinture, collage, sculpture.',
                    headline: 'Art-thérapeute Certifié',
                    specialties: JSON.stringify(['art-thérapie', 'peinture', 'sculpture', 'publics fragilisés', 'EHPAD']),
                    diplomas: JSON.stringify([
                        { name: 'DU Art-thérapie', year: 2019, url: null },
                        { name: 'License Arts Plastiques', year: 2017, url: null },
                    ]),
                    hourlyRate: 50,
                    address: thomasAddress,
                    city: 'Paris',
                    postalCode: '75015',
                    latitude: thomasGeo?.lat,
                    longitude: thomasGeo?.lng,
                    radiusKm: 25,
                    isVideoEnabled: false,
                    totalMissions: 23,
                    averageRating: 4.7,
                    totalReviews: 15,
                },
            },
        },
        include: { profile: true },
    });
    console.log('👤 Extra created: Thomas (Art-thérapie, Paris 15ème)');

    // Extra 3 - Marie (Veilleur de nuit, Montreuil)
    const mariePassword = await bcrypt.hash('marie2024!', 12);
    const marieAddress = '8 rue de Paris, 93100 Montreuil';
    const marieGeo = await geocodeAddress(marieAddress);

    const marieUser = await prisma.user.create({
        data: {
            email: 'marie.veille@email.com',
            passwordHash: mariePassword,
            phone: '+33634567890',
            role: UserRole.EXTRA,
            status: UserStatus.VERIFIED,
            emailVerified: new Date(),
            profile: {
                create: {
                    firstName: 'Marie',
                    lastName: 'Dupont',
                    bio: 'Surveillante de nuit expérimentée en établissements médico-sociaux. Calme, réactive et bienveillante. Disponible pour des remplacements en urgence.',
                    headline: 'Surveillante de Nuit - MECS/Foyers',
                    specialties: JSON.stringify(['veille de nuit', 'MECS', 'foyers', 'urgences', 'remplacements']),
                    diplomas: JSON.stringify([
                        { name: 'Formation Surveillant de Nuit', year: 2015, url: null },
                        { name: 'PSC1', year: 2022, url: null },
                    ]),
                    hourlyRate: 18,
                    address: marieAddress,
                    city: 'Montreuil',
                    postalCode: '93100',
                    latitude: marieGeo?.lat,
                    longitude: marieGeo?.lng,
                    radiusKm: 20,
                    isVideoEnabled: false,
                    totalMissions: 89,
                    averageRating: 4.8,
                    totalReviews: 45,
                },
            },
        },
        include: { profile: true },
    });
    console.log('👤 Extra created: Marie (Veilleur de nuit, Montreuil)');

    // Extra 4 - Sophie (Éducatrice spécialisée, Lyon)
    const sophiePassword = await bcrypt.hash('sophie2024!', 12);
    const sophieAddress = '15 rue de la République, 69002 Lyon';
    const sophieGeo = await geocodeAddress(sophieAddress);

    const sophieUser = await prisma.user.create({
        data: {
            email: 'sophie.educ@email.com',
            passwordHash: sophiePassword,
            phone: '+33645678901',
            role: UserRole.EXTRA,
            status: UserStatus.PENDING, // En attente de vérification
            profile: {
                create: {
                    firstName: 'Sophie',
                    lastName: 'Lambert',
                    bio: 'Éducatrice spécialisée depuis 12 ans, expertise autisme et troubles du comportement.',
                    headline: 'Éducatrice Spécialisée - Autisme',
                    specialties: JSON.stringify(['autisme', 'TSA', 'troubles du comportement', 'enfants', 'adolescents']),
                    diplomas: JSON.stringify([
                        { name: 'DEES', year: 2012, url: null },
                    ]),
                    hourlyRate: 35,
                    address: sophieAddress,
                    city: 'Lyon',
                    postalCode: '69002',
                    latitude: sophieGeo?.lat,
                    longitude: sophieGeo?.lng,
                    radiusKm: 40,
                    isVideoEnabled: true,
                    averageRating: 0,
                    totalReviews: 0,
                },
            },
        },
        include: { profile: true },
    });
    console.log('👤 Extra created: Sophie (Éducatrice, Lyon - PENDING)');

    // Extra 5 - Karim (Moniteur Éducateur, Nanterre)
    const karimPassword = await bcrypt.hash('karim2024!', 12);
    const karimAddress = '20 avenue de la République, 92000 Nanterre';
    const karimGeo = await geocodeAddress(karimAddress);

    const karimUser = await prisma.user.create({
        data: {
            email: 'karim.me@email.com',
            passwordHash: karimPassword,
            phone: '+33656789012',
            role: UserRole.EXTRA,
            status: UserStatus.VERIFIED,
            emailVerified: new Date(),
            profile: {
                create: {
                    firstName: 'Karim',
                    lastName: 'Saidi',
                    bio: 'Moniteur-éducateur passionné par le sport et l\'accompagnement des jeunes en difficulté. Propose des activités sportives adaptées.',
                    headline: 'Moniteur-Éducateur - Sport Adapté',
                    specialties: JSON.stringify(['sport adapté', 'jeunes en difficulté', 'inclusion', 'foot', 'basket']),
                    diplomas: JSON.stringify([
                        { name: 'DEME', year: 2020, url: null },
                        { name: 'BAFA', year: 2018, url: null },
                    ]),
                    hourlyRate: 28,
                    address: karimAddress,
                    city: 'Nanterre',
                    postalCode: '92000',
                    latitude: karimGeo?.lat,
                    longitude: karimGeo?.lng,
                    radiusKm: 35,
                    isVideoEnabled: false,
                    totalMissions: 34,
                    averageRating: 4.6,
                    totalReviews: 22,
                },
            },
        },
        include: { profile: true },
    });
    console.log('👤 Extra created: Karim (Moniteur-Éducateur, Nanterre)');

    // =============================================================================
    // 5. SERVICES
    // =============================================================================

    // Service 1 - Atelier Psycho-Boxe (Siham)
    const psychoBoxeService = await prisma.service.create({
        data: {
            profileId: sihamUser.profile!.id,
            name: 'Atelier Psycho-Boxe Éducative',
            description: 'Atelier collectif de 2h mêlant boxe et gestion des émotions. Les participants apprennent à canaliser leur énergie à travers des exercices de boxe adaptés, puis débriefent sur leurs ressentis. Idéal pour les groupes de jeunes en MECS ou IME.',
            type: ServiceType.WORKSHOP,
            category: 'sport',
            basePrice: 250,
            durationMinutes: 120,
            maxCapacity: 12,
            isActive: true,
            tags: JSON.stringify(['boxe', 'gestion des émotions', 'collectif', 'adolescents']),
            pricingOptions: JSON.stringify([
                { name: 'Atelier découverte', price: 250, duration: '2h', maxParticipants: 12 },
                { name: 'Cycle 4 séances', price: 900, duration: '4x2h', maxParticipants: 12 },
                { name: 'Sur-mesure', price: 0, duration: 'À définir', maxParticipants: null },
            ]),
        },
    });
    console.log('🎯 Service created: Atelier Psycho-Boxe (Siham)');

    // Service 2 - Supervision Éducative (Sophie - VIDEO)
    const supervisionService = await prisma.service.create({
        data: {
            profileId: sophieUser.profile!.id,
            name: 'Supervision Éducative en Visio',
            description: 'Séance individuelle de supervision et d\'analyse de pratique professionnelle pour les équipes éducatives. Expertise spécifique TSA et troubles du comportement.',
            type: ServiceType.COACHING_VIDEO,
            category: 'coaching',
            basePrice: 80,
            durationMinutes: 60,
            maxCapacity: 1,
            isActive: true,
            tags: JSON.stringify(['supervision', 'analyse de pratique', 'autisme', 'visio']),
            pricingOptions: JSON.stringify([
                { name: 'Séance unique', price: 80, duration: '1h' },
                { name: 'Pack 5 séances', price: 350, duration: '5x1h' },
            ]),
        },
    });
    console.log('🎯 Service created: Supervision Éducative en Visio (Sophie)');

    // =============================================================================
    // 6. MISSION SOS RENFORT
    // =============================================================================
    const tonightDate = new Date();
    tonightDate.setHours(21, 0, 0, 0);

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    tomorrowDate.setHours(6, 0, 0, 0);

    const sosVeilleur = await prisma.reliefMission.create({
        data: {
            clientId: mecsUser.id,
            title: 'URGENT - Veilleur de nuit pour ce soir',
            description: 'Suite à une absence de dernière minute, nous recherchons en urgence un(e) surveillant(e) de nuit pour ce soir. Poste de 21h à 6h. Connaissance du public adolescent appréciée.',
            jobTitle: 'Surveillant de nuit',
            hourlyRate: 20,
            startDate: tonightDate,
            endDate: tomorrowDate,
            address: mecsAddress,
            city: 'Paris',
            postalCode: '75011',
            latitude: mecsGeo?.lat,
            longitude: mecsGeo?.lng,
            radiusKm: 20,
            status: MissionStatus.OPEN,
            urgency: MissionUrgency.CRITICAL,
            requiredSkills: JSON.stringify(['veille de nuit', 'adolescents']),
            requiredDiplomas: JSON.stringify([]),
        },
    });
    console.log('🚨 SOS Mission created: Veilleur de nuit urgent (MECS Les Mimosas)');

    // =============================================================================
    // 7. POSTS POUR LE WALL
    // =============================================================================

    // 3 Besoins (établissement)
    await prisma.post.create({
        data: {
            authorId: mecsUser.id,
            type: PostType.NEED,
            title: 'Recherche intervenant boxe éducative',
            content: 'Notre MECS recherche un intervenant pour animer des ateliers de boxe éducative avec nos adolescents. Objectif : canaliser l\'énergie et travailler sur la gestion des émotions. 2h/semaine, les mercredis.',
            category: 'sport',
            city: 'Paris',
            postalCode: '75011',
            latitude: mecsGeo?.lat,
            longitude: mecsGeo?.lng,
            tags: JSON.stringify(['boxe', 'adolescents', 'MECS', 'hebdomadaire']),
            isActive: true,
        },
    });

    await prisma.post.create({
        data: {
            authorId: mecsUser.id,
            type: PostType.NEED,
            title: 'Atelier cuisine thérapeutique - Recherche animateur',
            content: 'Nous souhaitons mettre en place des ateliers cuisine avec nos jeunes. Recherche d\'un professionnel formé à l\'animation culinaire avec public en difficulté.',
            category: 'cuisine',
            city: 'Paris',
            postalCode: '75011',
            latitude: mecsGeo?.lat,
            longitude: mecsGeo?.lng,
            tags: JSON.stringify(['cuisine', 'atelier', 'jeunes']),
            isActive: true,
        },
    });

    await prisma.post.create({
        data: {
            authorId: mecsUser.id,
            type: PostType.NEED,
            title: 'Renfort équipe éducative - Vacances scolaires',
            content: 'Pour les vacances de février, nous recherchons des éducateurs/moniteurs pour renforcer notre équipe (sorties, activités). Du 17 au 28 février.',
            category: 'education',
            city: 'Paris',
            postalCode: '75011',
            latitude: mecsGeo?.lat,
            longitude: mecsGeo?.lng,
            tags: JSON.stringify(['vacances', 'renfort', 'sorties']),
            isActive: true,
        },
    });

    console.log('📝 3 Posts (NEED) created for MECS Les Mimosas');

    // 2 Offres (extras)
    await prisma.post.create({
        data: {
            authorId: sihamUser.id,
            type: PostType.OFFER,
            title: 'Ateliers Psycho-Boxe disponibles - Paris et IDF',
            content: 'Coach certifiée, je propose des ateliers de Psycho-Boxe pour les structures médico-sociales. Méthode douce et bienveillante pour aider les jeunes à gérer leurs émotions. Devis gratuit !',
            category: 'sport',
            city: 'Paris',
            postalCode: '75012',
            latitude: sihamGeo?.lat,
            longitude: sihamGeo?.lng,
            tags: JSON.stringify(['psycho-boxe', 'ateliers', 'IDF', 'devis gratuit']),
            isActive: true,
        },
    });

    await prisma.post.create({
        data: {
            authorId: thomasUser.id,
            type: PostType.OFFER,
            title: 'Art-thérapie en établissement - Disponibilités',
            content: 'Art-thérapeute certifié, je me déplace dans vos structures pour des séances individuelles ou collectives. Travail sur l\'expression, la confiance en soi, la communication non-verbale.',
            category: 'art',
            city: 'Paris',
            postalCode: '75015',
            latitude: thomasGeo?.lat,
            longitude: thomasGeo?.lng,
            tags: JSON.stringify(['art-thérapie', 'expression', 'collectif', 'individuel']),
            isActive: true,
        },
    });

    console.log('📝 2 Posts (OFFER) created for Extras');

    // =============================================================================
    // 8. TALENT POOL (Vivier de favoris)
    // =============================================================================
    const talentPool = await prisma.talentPool.create({
        data: {
            establishmentId: mecsUser.establishment!.id,
            name: 'Intervenants réguliers',
            description: 'Nos intervenants de confiance pour les ateliers et remplacements',
            members: {
                create: [
                    { profileId: sihamUser.profile!.id, notes: 'Excellente avec les ados, très demandée' },
                    { profileId: marieUser.profile!.id, notes: 'Disponible rapidement pour les nuits' },
                ],
            },
        },
    });
    console.log('⭐ Talent Pool created with 2 members');

    // =============================================================================
    // SUMMARY
    // =============================================================================
    console.log('\n✅ Seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   - 1 Admin');
    console.log('   - 1 Établissement (MECS Les Mimosas)');
    console.log('   - 5 Extras (1 star, 4 réguliers)');
    console.log('   - 2 Services (Workshop + Video Coaching)');
    console.log('   - 1 SOS Mission (CRITICAL)');
    console.log('   - 5 Wall Posts (3 needs, 2 offers)');
    console.log('   - 1 Talent Pool');
    console.log('\n🔐 Credentials:');
    console.log('   Admin: admin@lesextras.fr / admin123!');
    console.log('   MECS: contact@mecs-mimosas.fr / mecs2024!');
    console.log('   Siham: siham.coaching@email.com / siham2024!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
