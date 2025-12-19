'use client';

import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ChevronLeft, ChevronRight, Flame, Loader2, MessageCircle, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { CreateActionModal, type CreateActionModalUser } from '@/components/create/CreateActionModal';
import { SocialPostCard, type SocialPostCardItem } from '@/components/feed/SocialPostCard';
import { Logo } from '@/components/ui/Logo';
import { MissionCard } from './MissionCard';
import { ServiceCard } from './ServiceCard';
import { SmartSearchBar, type FloatingAvatar } from './SmartSearchBar';
import { useWallFeed } from './useWallFeed';

export interface TalentPoolItem {
    id: string;
    name: string;
    role: string;
    avatar: string | null;
    rating: number;
}

export interface ActivityItem {
    id: string;
    text: string;
    time: string;
}

interface WallFeedClientProps {
    initialData?: any[];
    initialFeed?: any[];
    initialNextCursor?: string | null;
    initialHasNextPage?: boolean;
    talentPool?: TalentPoolItem[];
    activity?: ActivityItem[];
}

const extractHeroAvatars = (items: any[]): FloatingAvatar[] => {
    const result: FloatingAvatar[] = [];
    const seen = new Set<string>();

    for (const item of items) {
        const profile = item?.profile;
        const id = String(profile?.userId || item?.authorId || item?.id || '');
        if (!id || seen.has(id)) continue;

        const name = profile
            ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || item?.authorName || null
            : item?.authorName || null;

        const avatarUrl = profile?.avatarUrl || item?.authorAvatar || null;

        if (!name && !avatarUrl) continue;

        seen.add(id);
        result.push({ id, name, avatarUrl });
        if (result.length >= 6) break;
    }

    return result;
};

const toSocialPostCardItem = (item: any): SocialPostCardItem | null => {
    const id = String(item?.id || '');
    const content = String(item?.content || '').trim();
    if (!id || !content) return null;

    return {
        id,
        type: 'POST',
        postType: typeof item?.postType === 'string' ? item.postType : undefined,
        title: typeof item?.title === 'string' ? item.title : undefined,
        content,
        category: typeof item?.category === 'string' ? item.category : null,
        mediaUrls: Array.isArray(item?.mediaUrls)
            ? item.mediaUrls.filter((url: unknown): url is string => typeof url === 'string' && url.trim().length > 0)
            : [],
        createdAt: item?.createdAt,
        authorName: typeof item?.authorName === 'string' ? item.authorName : undefined,
        authorAvatar: typeof item?.authorAvatar === 'string' ? item.authorAvatar : null,
        isOptimistic: Boolean(item?.isOptimistic),
    };
};

const isType = (item: any, type: string) => String(item?.type || '').toUpperCase() === type;

const isUrgentMission = (mission: any) => {
    const urgency = String(mission?.urgencyLevel || '').toUpperCase();
    return urgency === 'HIGH' || urgency === 'CRITICAL';
};

const getServiceSpanClass = (_service: any, index: number) => {
    if (index % 7 === 0) return 'sm:col-span-2 xl:row-span-2';
    if (index % 11 === 5) return 'xl:col-span-2';
    return '';
};

function SectionEmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 backdrop-blur-md p-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-soft">
                <Icon className="h-7 w-7 text-slate-300" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
            {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
        </div>
    );
}

export function WallFeedClient({
    initialData,
    initialFeed,
    initialNextCursor = null,
    initialHasNextPage = false,
}: WallFeedClientProps) {
    const resolvedInitialData = Array.isArray(initialData)
        ? initialData
        : Array.isArray(initialFeed)
            ? initialFeed
            : [];

    const { user } = useAuth();
    const canPublish = Boolean(user && (user.role === 'CLIENT' || user.role === 'EXTRA'));

    const { feed, isLoading, isLoadingMore, hasMore, loadMore, searchTerm, setSearchTerm } = useWallFeed({
        initialItems: resolvedInitialData,
        initialNextCursor,
        initialHasNextPage,
    });

    const heroAvatars = useMemo(() => extractHeroAvatars(feed), [feed]);

    const missions = useMemo(() => feed.filter((item) => isType(item, 'MISSION')), [feed]);
    const services = useMemo(() => feed.filter((item) => isType(item, 'SERVICE')), [feed]);
    const posts = useMemo(() => {
        const socialItems = feed
            .filter((item) => isType(item, 'POST'))
            .map(toSocialPostCardItem)
            .filter(Boolean) as SocialPostCardItem[];

        return socialItems;
    }, [feed]);

    const urgentMissions = useMemo(() => missions.filter(isUrgentMission).slice(0, 12), [missions]);

    const urgentRailRef = useRef<HTMLDivElement>(null);

    const scrollUrgentRail = (direction: 'prev' | 'next') => {
        const node = urgentRailRef.current;
        if (!node) return;
        const delta = direction === 'prev' ? -360 : 360;
        node.scrollBy({ left: delta, behavior: 'smooth' });
    };

    return (
        <div className="relative min-h-screen bg-canvas overflow-hidden">
            <div aria-hidden className="absolute inset-0 -z-10">
                <div className="absolute -top-56 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/12 via-teal-400/10 to-rose-400/10 blur-3xl" />
                <div className="absolute top-[24%] -left-44 h-[460px] w-[460px] rounded-full bg-teal-400/10 blur-3xl" />
                <div className="absolute bottom-[-220px] right-[-140px] h-[560px] w-[560px] rounded-full bg-indigo-500/12 blur-3xl" />
            </div>

            <header className="sticky top-0 lg:top-[72px] z-40">
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 pt-safe">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto,1fr,auto] sm:items-center">
                            <div className="flex items-center gap-3">
                                <Logo size="sm" showBaseline={false} href="/wall" className="items-start" />
                            </div>

                            <div className="w-full sm:max-w-3xl sm:justify-self-center">
                                <SmartSearchBar value={searchTerm} onChange={setSearchTerm} avatars={heroAvatars} />
                            </div>

                            <div className="flex justify-end">
                                {canPublish && user ? (
                                    <CreateActionModal
                                        user={user as unknown as CreateActionModalUser}
                                        trigger={
                                            <button
                                                type="button"
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:shadow-soft-lg active:scale-[0.99] transition-all whitespace-nowrap"
                                                aria-label="Publier"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Publier
                                            </button>
                                        }
                                    />
                                ) : (
                                    <Link href="/auth/login" className="btn-secondary whitespace-nowrap">
                                        Se connecter
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-safe">
                {urgentMissions.length > 0 ? (
                    <section className="pt-8">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-rose-50 border border-rose-100 grid place-items-center">
                                    <Flame className="h-5 w-5 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                                        🔥 Urgences à pourvoir
                                    </p>
                                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                                        Missions de renfort
                                    </h2>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => scrollUrgentRail('prev')}
                                    className="h-10 w-10 rounded-2xl bg-white/80 border border-slate-200 hover:bg-slate-50 transition-colors shadow-soft grid place-items-center"
                                    aria-label="Précédent"
                                >
                                    <ChevronLeft className="h-5 w-5 text-slate-700" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollUrgentRail('next')}
                                    className="h-10 w-10 rounded-2xl bg-white/80 border border-slate-200 hover:bg-slate-50 transition-colors shadow-soft grid place-items-center"
                                    aria-label="Suivant"
                                >
                                    <ChevronRight className="h-5 w-5 text-slate-700" />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={urgentRailRef}
                            className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x scroll-smooth"
                        >
                            {urgentMissions.map((mission, index) => (
                                <div
                                    key={String(mission?.id ?? index)}
                                    className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
                                >
                                    <MissionCard data={mission} />
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null}

                <section className="pt-10 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-teal-50 border border-teal-100 grid place-items-center">
                                        <Sparkles className="h-5 w-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                                            💎 Experts & Ateliers
                                        </p>
                                        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                                            Catalogue
                                        </h2>
                                    </div>
                                </div>

                                {services.length > 0 ? (
                                    <span className="text-sm text-slate-500">{services.length} services</span>
                                ) : null}
                            </div>

                            {isLoading && services.length === 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-[18rem] gap-6 [grid-auto-flow:dense]">
                                    {Array.from({ length: 9 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className={`rounded-3xl bg-white/60 backdrop-blur-md border border-white/60 shadow-soft animate-pulse ${
                                                index % 7 === 0 ? 'sm:col-span-2 xl:row-span-2' : ''
                                            }`}
                                        />
                                    ))}
                                </div>
                            ) : services.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-[18rem] gap-6 [grid-auto-flow:dense]">
                                    {services.map((service, index) => (
                                        <div
                                            key={String(service?.id ?? index)}
                                            className={`h-full ${getServiceSpanClass(service, index)}`}
                                        >
                                            <ServiceCard data={service} currentUserId={user?.id ?? undefined} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <SectionEmptyState
                                    icon={Sparkles}
                                    title="Aucun expert disponible"
                                    description="Affinez votre recherche ou revenez un peu plus tard."
                                />
                            )}

                            {hasMore ? (
                                <div className="flex justify-center pt-6">
                                    <button
                                        type="button"
                                        onClick={loadMore}
                                        className="btn-secondary"
                                        disabled={isLoadingMore}
                                    >
                                        {isLoadingMore ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Chargement…
                                            </>
                                        ) : (
                                            'Charger plus'
                                        )}
                                    </button>
                                </div>
                            ) : null}
                        </div>

                        <aside className="lg:col-span-4 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 grid place-items-center">
                                    <MessageCircle className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                                        💬 L'actu du réseau
                                    </p>
                                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                                        Communauté
                                    </h2>
                                </div>
                            </div>

                            {isLoading && posts.length === 0 ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="h-52 rounded-3xl bg-white/60 backdrop-blur-md border border-white/60 shadow-soft animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : posts.length > 0 ? (
                                <div className="space-y-4">
                                    {posts.slice(0, 8).map((post) => (
                                        <SocialPostCard key={post.id} item={post} />
                                    ))}
                                </div>
                            ) : (
                                <SectionEmptyState
                                    icon={MessageCircle}
                                    title="Aucune actu pour l’instant"
                                    description="Partagez une expérience ou une info utile pour lancer la discussion."
                                    action={
                                        canPublish && user ? (
                                            <CreateActionModal
                                                user={user as unknown as CreateActionModalUser}
                                                trigger={
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:shadow-soft-lg active:scale-[0.99] transition-all"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        Publier
                                                    </button>
                                                }
                                            />
                                        ) : undefined
                                    }
                                />
                            )}
                        </aside>
                    </div>
                </section>
            </main>
        </div>
    );
}
