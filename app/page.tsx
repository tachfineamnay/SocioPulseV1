import { Metadata } from 'next';
import { WallFeedClient, FeedItem, TalentPoolItem, ActivityItem } from '@/components/wall/WallFeedClient';

// SEO Metadata - Server-side rendered
export const metadata: Metadata = {
    title: 'Les Extras - Le Wall | Offres & Besoins Médico-Social',
    description: 'La plateforme de mise en relation médico-sociale. Trouvez votre prochaine mission ou prestataire en temps réel.',
    openGraph: {
        title: 'Les Extras - Le Wall',
        description: 'Plateforme de mise en relation médico-sociale B2B2C',
        type: 'website',
    },
};

// Server-side data fetching
// In production, this would call the API or Prisma directly
async function getFeedData(): Promise<{
    feed: FeedItem[];
    talentPool: TalentPoolItem[];
    activity: ActivityItem[];
}> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/feed`, {
    //     next: { revalidate: 60 } // ISR: revalidate every 60 seconds
    // });
    // const data = await response.json();

    // Mock data for now - will be replaced by real API
    const feed: FeedItem[] = [
        {
            id: '1',
            type: 'NEED',
            title: 'Éducateur(trice) spécialisé(e) pour weekend',
            establishment: 'EHPAD Les Jardins',
            city: 'Lyon 3e',
            description: 'Recherche éducateur(trice) expérimenté(e) pour accompagnement de résidents le weekend. Expérience EHPAD requise.',
            urgencyLevel: 'CRITICAL',
            hourlyRate: 25,
            jobTitle: 'Éducateur spécialisé',
            startDate: '2024-12-07',
            isNightShift: false,
            tags: ['EHPAD', 'Weekend', 'Expérimenté'],
        },
        {
            id: '2',
            type: 'OFFER',
            title: 'Atelier Art-Thérapie pour Séniors',
            providerName: 'Marie Dupont',
            providerRating: 4.8,
            providerReviews: 23,
            city: 'Paris 15e',
            description: 'Séances d\'art-thérapie adaptées aux personnes âgées. Peinture, collage, expression libre.',
            serviceType: 'WORKSHOP',
            category: 'Art-thérapie',
            basePrice: 150,
            imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
            tags: ['Séniors', 'Créatif'],
        },
        {
            id: '3',
            type: 'NEED',
            title: 'Aide-soignant(e) de nuit',
            establishment: 'Clinique Saint-Joseph',
            city: 'Marseille',
            description: 'Poste de nuit pour accompagnement des patients en service gériatrique.',
            urgencyLevel: 'HIGH',
            hourlyRate: 22,
            jobTitle: 'Aide-soignant(e)',
            startDate: '2024-12-08',
            isNightShift: true,
            tags: ['Nuit', 'Gériatrie'],
        },
        {
            id: '4',
            type: 'OFFER',
            title: 'Coaching Sport Adapté en Visio',
            providerName: 'Thomas Martin',
            providerRating: 4.9,
            providerReviews: 47,
            city: 'Toulouse',
            description: 'Séances de sport adapté en visioconférence. Mobilité douce, renforcement musculaire.',
            serviceType: 'COACHING_VIDEO',
            category: 'Sport adapté',
            basePrice: 45,
            imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
            tags: ['Visio', 'Sport'],
        },
        {
            id: '5',
            type: 'NEED',
            title: 'Intervenant(e) atelier mémoire',
            establishment: 'IME Les Oliviers',
            city: 'Nice',
            description: 'Animation d\'ateliers de stimulation cognitive pour résidents atteints de troubles.',
            urgencyLevel: 'MEDIUM',
            hourlyRate: 28,
            jobTitle: 'Psychomotricien',
            startDate: '2024-12-15',
            isNightShift: false,
            tags: ['Mémoire', 'Cognitif', 'IME'],
        },
        {
            id: '6',
            type: 'OFFER',
            title: 'Musicothérapie - Séances de groupe',
            providerName: 'Sophie Lefèvre',
            providerRating: 4.7,
            providerReviews: 31,
            city: 'Bordeaux',
            description: 'Ateliers musicaux thérapeutiques adaptés à tous les publics. Instruments, chant, écoute.',
            serviceType: 'WORKSHOP',
            category: 'Musicothérapie',
            basePrice: 180,
            imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
            tags: ['Musique', 'Groupe'],
        },
    ];

    const talentPool: TalentPoolItem[] = [
        { id: '1', name: 'Marie D.', role: 'Éducatrice', avatar: null, rating: 4.8 },
        { id: '2', name: 'Thomas M.', role: 'Coach sportif', avatar: null, rating: 4.9 },
        { id: '3', name: 'Sophie L.', role: 'Musicothérapeute', avatar: null, rating: 4.7 },
    ];

    const activity: ActivityItem[] = [
        { id: '1', text: 'Marie D. a postulé à votre mission', time: '2h' },
        { id: '2', text: 'Nouvelle mission urgente à Lyon', time: '4h' },
        { id: '3', text: 'Réservation confirmée avec Thomas M.', time: '6h' },
    ];

    return { feed, talentPool, activity };
}

// Server Component - async, no 'use client'
export default async function HomePage() {
    // Server-side data fetching
    const { feed, talentPool, activity } = await getFeedData();

    // Pass initial data to client component for interactivity
    return (
        <WallFeedClient
            initialFeed={feed}
            talentPool={talentPool}
            activity={activity}
        />
    );
}
