'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getFeed } from '@/app/(platform)/services/wall.service';

export interface UseWallFeedOptions {
    initialItems?: any[];
    initialNextCursor?: string | null;
    initialHasNextPage?: boolean;
    debounceMs?: number;
}

export interface UseWallFeedResult {
    feed: any[];
    isLoading: boolean;
    isLoadingMore: boolean;
    nextCursor: string | null;
    hasMore: boolean;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    refresh: () => Promise<void>;
    loadMore: () => Promise<void>;
}

type ParsedFeedResponse = {
    items: any[];
    nextCursor: string | null;
    hasNextPage: boolean;
};

function parseFeedResponse(data: any): ParsedFeedResponse {
    const items =
        (Array.isArray(data?.items) && data.items) ||
        (Array.isArray(data?.data?.items) && data.data.items) ||
        (Array.isArray(data?.feed?.items) && data.feed.items) ||
        (Array.isArray(data?.feed) && data.feed) ||
        (Array.isArray(data) && data) ||
        [];

    const pageInfo =
        (data?.pageInfo && data.pageInfo) ||
        (data?.data?.pageInfo && data.data.pageInfo) ||
        (data?.feed?.pageInfo && data.feed.pageInfo) ||
        null;

    const nextCursor = pageInfo && typeof pageInfo?.nextCursor === 'string' ? pageInfo.nextCursor : null;
    const hasNextPage = Boolean(pageInfo?.hasNextPage);

    return { items: Array.isArray(items) ? items : [], nextCursor, hasNextPage };
}

export function useWallFeed({
    initialItems = [],
    initialNextCursor = null,
    initialHasNextPage = false,
    debounceMs = 320,
}: UseWallFeedOptions = {}): UseWallFeedResult {
    const [searchTerm, setSearchTerm] = useState('');
    const [feed, setFeed] = useState<any[]>(Array.isArray(initialItems) ? initialItems : []);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
    const [hasMore, setHasMore] = useState(Boolean(initialHasNextPage && initialNextCursor));

    const didInitFetchRef = useRef(false);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const normalizedSearch = searchTerm.trim();
            const params: Record<string, any> = {};
            if (normalizedSearch) params.search = normalizedSearch;

            const data = await getFeed(params);
            const parsed = parseFeedResponse(data);

            setFeed(parsed.items);
            setNextCursor(parsed.nextCursor);
            setHasMore(Boolean(parsed.hasNextPage && parsed.nextCursor));
        } catch (error) {
            console.error('useWallFeed.refresh error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm]);

    const loadMore = useCallback(async () => {
        if (!hasMore || !nextCursor || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            const normalizedSearch = searchTerm.trim();
            const params: Record<string, any> = { cursor: nextCursor };
            if (normalizedSearch) params.search = normalizedSearch;

            const data = await getFeed(params);
            const parsed = parseFeedResponse(data);

            setNextCursor(parsed.nextCursor);
            setHasMore(Boolean(parsed.hasNextPage && parsed.nextCursor));

            if (parsed.items.length > 0) {
                setFeed((prev) => {
                    const seen = new Set(prev.map((item) => String(item?.id ?? '')));
                    const merged = [...prev];
                    for (const item of parsed.items) {
                        const id = String(item?.id ?? '');
                        if (!id || seen.has(id)) continue;
                        seen.add(id);
                        merged.push(item);
                    }
                    return merged;
                });
            }
        } catch (error) {
            console.error('useWallFeed.loadMore error:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [hasMore, isLoadingMore, nextCursor, searchTerm]);

    useEffect(() => {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<unknown>;
            const detail = customEvent.detail;
            if (!detail || typeof detail !== 'object') return;

            const record = detail as Record<string, unknown>;
            const status = record.status;
            const optimisticId = record.optimisticId;

            if (typeof status !== 'string' || typeof optimisticId !== 'string') return;

            if (status === 'optimistic') {
                const item = record.item;
                if (!item) return;
                setFeed((prev) => [item as any, ...prev]);
                return;
            }

            if (status === 'confirmed') {
                const item = record.item;
                if (!item) return;

                setFeed((prev) => {
                    const index = prev.findIndex((existing) => String(existing?.id) === optimisticId);
                    if (index === -1) return [item as any, ...prev];
                    const next = [...prev];
                    next[index] = item as any;
                    return next;
                });
                return;
            }

            if (status === 'failed') {
                setFeed((prev) => prev.filter((existing) => String(existing?.id) !== optimisticId));
            }
        };

        window.addEventListener('lesextras:wall:feed-item', handler as EventListener);
        return () => window.removeEventListener('lesextras:wall:feed-item', handler as EventListener);
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) return;
        setFeed(Array.isArray(initialItems) ? initialItems : []);
        setNextCursor(initialNextCursor);
        setHasMore(Boolean(initialHasNextPage && initialNextCursor));
    }, [initialHasNextPage, initialItems, initialNextCursor, searchTerm]);

    useEffect(() => {
        const hasInitial = Array.isArray(initialItems) && initialItems.length > 0;
        const hasQuery = Boolean(searchTerm.trim());

        if (!didInitFetchRef.current) {
            didInitFetchRef.current = true;

            if (hasInitial && !hasQuery) return;
        }

        const timeout = window.setTimeout(() => {
            refresh();
        }, debounceMs);

        return () => window.clearTimeout(timeout);
    }, [debounceMs, initialItems, refresh, searchTerm]);

    return {
        feed,
        isLoading,
        isLoadingMore,
        nextCursor,
        hasMore,
        searchTerm,
        setSearchTerm,
        refresh,
        loadMore,
    };
}

