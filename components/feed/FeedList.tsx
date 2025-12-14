'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { NeedCard, OfferCard } from '@/components/wall';
import { FeedSkeleton } from './FeedSkeleton';

// ===========================================
// TYPES
// ===========================================

export interface NeedItem {
    id: string;
    authorId?: string;
    type: 'NEED';
    title: string;
    establishment: string;
    city: string;
    description: string;
    urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    hourlyRate: number;
    jobTitle: string;
    startDate: string;
    isNightShift: boolean;
    tags: string[];
}

export interface OfferItem {
    id: string;
    authorId?: string;
    type: 'OFFER';
    title: string;
    providerName: string;
    providerRating: number;
    providerReviews: number;
    city: string;
    description: string;
    serviceType: 'WORKSHOP' | 'COACHING_VIDEO';
    category?: string;
    basePrice?: number;
    imageUrl?: string;
    tags: string[];
}

export type FeedItem = NeedItem | OfferItem;

export interface FeedListProps {
    items: FeedItem[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    currentUserId?: string | null;
    onSelfContact?: () => void;
}

// ===========================================
// ANIMATION
// ===========================================

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 100,
            damping: 15,
        },
    },
};

// ===========================================
// INFINITE SCROLL HOOK
// ===========================================

function useInView(
    callback: () => void,
    options?: IntersectionObserverInit
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    callback();
                }
            },
            { threshold: 0.1, ...options }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [callback, options]);

    return ref;
}

// ===========================================
// COMPONENT
// ===========================================

export function FeedList({
    items,
    isLoading,
    hasMore,
    onLoadMore,
    currentUserId,
    onSelfContact,
}: FeedListProps) {
    const router = useRouter();

    // Infinite scroll trigger
    const loadMoreTrigger = useInView(
        useCallback(() => {
            if (!isLoading && hasMore) {
                onLoadMore();
            }
        }, [isLoading, hasMore, onLoadMore])
    );

    // Initial loading state
    if (isLoading && items.length === 0) {
        return <FeedSkeleton count={6} />;
    }

    // Empty state
    if (!isLoading && items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Aucun résultat
                </h3>
                <p className="text-sm text-slate-500 max-w-sm">
                    Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.
                </p>
            </div>
        );
    }

    return (
        <>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4"
            >
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        variants={itemVariants}
                        className="break-inside-avoid"
                    >
                        {item.type === 'NEED' ? (
                            <NeedCard
                                id={item.id}
                                authorId={item.authorId}
                                currentUserId={currentUserId || undefined}
                                onSelfContact={onSelfContact}
                                title={item.title}
                                establishment={item.establishment}
                                city={item.city}
                                description={item.description}
                                urgencyLevel={item.urgencyLevel}
                                hourlyRate={item.hourlyRate}
                                jobTitle={item.jobTitle}
                                startDate={item.startDate}
                                isNightShift={item.isNightShift}
                                tags={item.tags}
                                onClick={() => router.push(`/need/${item.id}`)}
                            />
                        ) : (
                            <OfferCard
                                id={item.id}
                                authorId={item.authorId}
                                currentUserId={currentUserId || undefined}
                                onSelfContact={onSelfContact}
                                title={item.title}
                                providerName={item.providerName}
                                providerRating={item.providerRating}
                                providerReviews={item.providerReviews}
                                city={item.city}
                                description={item.description}
                                serviceType={item.serviceType}
                                category={item.category}
                                basePrice={item.basePrice}
                                imageUrl={item.imageUrl}
                                tags={item.tags}
                                onClick={() => router.push(`/offer/${item.id}`)}
                            />
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Load More Trigger */}
            {hasMore && (
                <div ref={loadMoreTrigger} className="py-8 text-center">
                    {isLoading ? (
                        <FeedSkeleton count={3} />
                    ) : (
                        <button
                            onClick={onLoadMore}
                            className="btn-secondary"
                        >
                            Charger plus
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
