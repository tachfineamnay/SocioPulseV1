import { Metadata } from 'next';
import { WallFeedClient } from '@/components/wall/WallFeedClient';
import { getApiBaseWithVersion } from '@/lib/config';

// ===========================================
// SOCIOPULSE WALL EXPERIENCE - Wall Page
// SSR: 10 premiers items pour SEO
// ===========================================

export const metadata: Metadata = {
    title: 'Sociopulse - La plateforme du médico-social | Renfort & SocioLive',
    description: 'La plateforme de mise en relation médico-sociale. Un renfort demain, une visio ou un atelier maintenant. Trouvez votre mission ou expert en temps réel.',
    keywords: 'renfort médico-social, interim social, SocioLive, atelier, EHPAD, IDE, aide-soignant, éducateur',
    openGraph: {
        title: 'Sociopulse - La plateforme du médico-social',
        description: 'La plateforme de mise en relation médico-sociale B2B2C. Missions de renfort et services SocioLive.',
        type: 'website',
        siteName: 'Sociopulse',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sociopulse - La plateforme du médico-social',
        description: 'Un renfort demain. Une Visio ou un Atelier maintenant.',
    },
};

const getApiBase = getApiBaseWithVersion;

// Page-based pagination meta interface
interface FeedMeta {
    total: number;
    page: number;
    lastPage: number;
    hasNextPage: boolean;
}

interface InitialFeedResponse {
    data: any[];
    meta: FeedMeta;
    // Legacy fields for backward compatibility
    items?: any[];
    pageInfo?: { nextCursor?: string; hasNextPage?: boolean };
}

async function getInitialFeed(): Promise<{ data: any[]; meta: FeedMeta }> {
    const defaultMeta: FeedMeta = { total: 0, page: 1, lastPage: 1, hasNextPage: false };

    try {
        // SSR fetch: first page with 40 items for sections (carousel + featured + feed)
        const response = await fetch(`${getApiBase()}/wall/feed?page=1&limit=40`, {
            cache: 'no-store',
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            return { data: [], meta: defaultMeta };
        }

        const json: InitialFeedResponse = await response.json();

        // Support both new format (data/meta) and legacy format (items/pageInfo)
        const data = Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json?.items)
                ? json.items
                : [];

        const meta: FeedMeta = json?.meta ?? {
            total: data.length,
            page: 1,
            lastPage: json?.pageInfo?.hasNextPage ? 2 : 1,
            hasNextPage: Boolean(json?.pageInfo?.hasNextPage),
        };

        return { data, meta };
    } catch {
        return { data: [], meta: defaultMeta };
    }
}

export default async function WallPage() {
    const feed = await getInitialFeed();

    return (
        <WallFeedClient
            initialData={feed.data}
            initialMeta={feed.meta}
            talentPool={[]}
            activity={[]}
        />
    );
}

