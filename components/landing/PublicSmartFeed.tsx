'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronDown } from 'lucide-react';
import { PublicOpportunityCard, type PublicOpportunityItem } from './PublicOpportunityCard';
import { FeedFilterTabs, type FeedFilter } from './FeedFilterTabs';
import { currentBrand } from '@/lib/brand';

// ===========================================
// PUBLIC SMART FEED - SSR + Load More Container
// Separate from private Wall (/wall)
// ===========================================

interface FeedMeta {
    page: number;
    hasNextPage: boolean;
    total?: number;
}

interface PublicSmartFeedProps {
    initialItems: PublicOpportunityItem[];
    initialMeta: FeedMeta;
    viewMode: 'establishment' | 'talent';
}

// Skeleton card for loading state
function SkeletonCard() {
    return (
        <div className="rounded-theme-xl border border-slate-200 bg-white/50 p-5 animate-pulse">
            <div className="flex justify-between mb-4">
                <div className="h-6 w-20 bg-slate-200 rounded-full" />
                <div className="h-6 w-16 bg-slate-200 rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-1/2 bg-slate-200 rounded mb-3" />
            <div className="flex gap-2">
                <div className="h-6 w-16 bg-slate-200 rounded-full" />
                <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>
        </div>
    );
}

export function PublicSmartFeed({
    initialItems,
    initialMeta,
    viewMode
}: PublicSmartFeedProps) {
    const [items, setItems] = useState<PublicOpportunityItem[]>(initialItems);
    const [meta, setMeta] = useState<FeedMeta>(initialMeta);
    const [filter, setFilter] = useState<FeedFilter>('all');
    const [isPending, startTransition] = useTransition();

    // Filter items based on selected tab
    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'missions') return item.type === 'mission';
        if (filter === 'profiles') return item.type === 'profile';
        if (filter === 'services') return item.type === 'service';
        return true;
    });

    // Load more handler
    const handleLoadMore = () => {
        startTransition(async () => {
            try {
                const nextPage = meta.page + 1;
                const typeParam = viewMode === 'establishment' ? 'profile' : 'mission';
                const appModeParam = currentBrand.mode; // SOCIAL or MEDICAL

                const response = await fetch(
                    `/api/v1/wall-feed?page=${nextPage}&limit=10&type=${typeParam}&appMode=${appModeParam}`
                );

                if (!response.ok) throw new Error('Failed to load');

                const data = await response.json();

                // Transform API response to our item format
                const newItems: PublicOpportunityItem[] = (data.data || []).map((item: any) => ({
                    id: item.id,
                    type: item.type?.toLowerCase() === 'mission' ? 'mission'
                        : item.type?.toLowerCase() === 'service' ? 'service'
                            : 'profile',
                    title: item.title || item.name || 'Untitled',
                    subtitle: item.description || item.content,
                    location: item.city,
                    price: item.hourlyRate || item.basePrice,
                    imageUrl: item.imageUrl,
                    avatarUrl: item.profile?.avatarUrl || item.authorAvatar,
                    isUrgent: item.urgencyLevel === 'HIGH' || item.urgencyLevel === 'CRITICAL',
                    isAvailable: true,
                    tags: item.tags || item.requiredSkills || [],
                    category: item.category,
                    expiresAt: item.validUntil || item.startDate,
                    rating: item.profile?.averageRating,
                }));

                setItems(prev => [...prev, ...newItems]);
                setMeta({
                    page: nextPage,
                    hasNextPage: data.meta?.hasNextPage ?? false,
                    total: data.meta?.total,
                });

                // Update URL silently
                const url = new URL(window.location.href);
                url.searchParams.set('page', String(nextPage));
                window.history.replaceState({}, '', url.toString());

            } catch (error) {
                console.error('Failed to load more:', error);
            }
        });
    };

    // Empty state
    if (filteredItems.length === 0 && !isPending) {
        return (
            <div className="py-16 text-center">
                <p className="text-slate-500 text-lg">
                    Aucun résultat pour ce filtre
                </p>
            </div>
        );
    }

    return (
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Filter Tabs */}
            <FeedFilterTabs
                value={filter}
                onChange={setFilter}
                showServices={currentBrand.showAteliers}
            />

            {/* Feed Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            layout
                        >
                            <PublicOpportunityCard item={item} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Loading Skeletons */}
                {isPending && (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                )}
            </motion.div>

            {/* Load More Button */}
            {meta.hasNextPage && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleLoadMore}
                        disabled={isPending}
                        className={`
                            inline-flex items-center gap-2 
                            px-6 py-3 rounded-full
                            bg-white border border-slate-200
                            text-slate-700 font-medium
                            hover:bg-slate-50 hover:border-slate-300
                            active:scale-[0.98]
                            transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Chargement...
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4" />
                                Voir plus
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Results count */}
            {meta.total && (
                <p className="text-center text-sm text-slate-500 mt-4">
                    {filteredItems.length} sur {meta.total} résultats
                </p>
            )}
        </section>
    );
}
