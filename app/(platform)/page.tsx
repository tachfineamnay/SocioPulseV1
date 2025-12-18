import { Metadata } from 'next';
import { WallFeedClient } from '@/components/wall/WallFeedClient';

export const metadata: Metadata = {
    title: 'Les Extras - Le Wall | Offres & Besoins Médico-Social',
    description: 'La plateforme de mise en relation médico-sociale. Trouvez votre prochaine mission ou prestataire en temps réel.',
    openGraph: {
        title: 'Les Extras - Le Wall',
        description: 'Plateforme de mise en relation médico-sociale B2B2C',
        type: 'website',
    },
};

const getApiBase = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000';
    const normalized = apiBase.replace(/\/+$/, '');
    return normalized.endsWith('/api/v1') ? normalized : `${normalized}/api/v1`;
};

async function getInitialFeed(): Promise<any[]> {
    try {
        const response = await fetch(`${getApiBase()}/wall/feed`, { cache: 'no-store' });
        if (!response.ok) return [];

        const data = await response.json();
        if (Array.isArray(data?.items)) return data.items;
        if (Array.isArray(data)) return data;
        return [];
    } catch {
        return [];
    }
}

export default async function HomePage() {
    const feed = await getInitialFeed();

    return (
        <WallFeedClient
            initialData={feed}
            talentPool={[]}
            activity={[]}
        />
    );
}
