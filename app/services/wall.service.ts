'use client';

export type WallFeedParams = Record<string, string | number | boolean | undefined | null>;

export interface CreatePostPayload {
    type: 'OFFER' | 'NEED';
    title: string;
    content: string;
    city?: string;
    postalCode?: string;
    tags?: string[];
    category?: string;
    validUntil?: string;
}

const getApiBase = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000';
    const normalized = apiBase.replace(/\/+$/, '');
    return normalized.endsWith('/api/v1') ? normalized : `${normalized}/api/v1`;
};

export async function getFeed(params: WallFeedParams = {}) {
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        search.set(key, String(value));
    });

    const url = `${getApiBase()}/wall/feed${search.toString() ? `?${search.toString()}` : ''}`;

    try {
        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error(`getFeed failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getFeed error:', error);
        return { items: [] };
    }
}

export async function createPost(payload: CreatePostPayload) {
    const url = `${getApiBase()}/wall/posts`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`createPost failed with status ${response.status}`);
    }

    return response.json();
}
