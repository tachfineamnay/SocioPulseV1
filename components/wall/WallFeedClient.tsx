'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Zap,
    Dumbbell,
    Video,
    Heart,
    Palette,
    Filter,
    Users,
    Activity,
    ChevronRight,
    Clock,
    Star,
    Bell
} from 'lucide-react';
import { NeedCard, OfferCard } from '@/components/wall';

// Types for feed items
export interface NeedItem {
    id: string;
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
    type: 'OFFER';
    title: string;
    providerName: string;
    providerRating: number;
    providerReviews: number;
    city: string;
    description: string;
    serviceType: 'WORKSHOP' | 'COACHING_VIDEO';
    category: string;
    basePrice: number;
    imageUrl?: string;
    tags: string[];
}

export type FeedItem = NeedItem | OfferItem;

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
    initialFeed: FeedItem[];
    talentPool: TalentPoolItem[];
    activity: ActivityItem[];
}

const FILTER_BADGES = [
    { id: 'urgent', label: 'Urgent', icon: Zap, color: 'text-red-500' },
    { id: 'sport', label: 'Sport', icon: Dumbbell, color: 'text-blue-500' },
    { id: 'visio', label: 'Visio', icon: Video, color: 'text-purple-500' },
    { id: 'bien-etre', label: 'Bien-être', icon: Heart, color: 'text-pink-500' },
    { id: 'art', label: 'Art', icon: Palette, color: 'text-orange-500' },
];

// Animation variants
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
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
};

export function WallFeedClient({ initialFeed, talentPool, activity }: WallFeedClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const toggleFilter = (filterId: string) => {
        setActiveFilters(prev =>
            prev.includes(filterId)
                ? prev.filter(f => f !== filterId)
                : [...prev, filterId]
        );
    };

    const filteredFeed = useMemo(() => {
        let items = initialFeed;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.title.toLowerCase().includes(query) ||
                ('establishment' in item && item.establishment.toLowerCase().includes(query)) ||
                ('providerName' in item && item.providerName.toLowerCase().includes(query)) ||
                item.city?.toLowerCase().includes(query)
            );
        }

        // Tag filters
        if (activeFilters.includes('urgent')) {
            items = items.filter(item =>
                item.type === 'NEED' && (item.urgencyLevel === 'CRITICAL' || item.urgencyLevel === 'HIGH')
            );
        }
        if (activeFilters.includes('visio')) {
            items = items.filter(item =>
                item.type === 'OFFER' && item.serviceType === 'COACHING_VIDEO'
            );
        }

        return items;
    }, [searchQuery, activeFilters, initialFeed]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Sticky */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        {/* Top Row: Logo + Search + Notifications */}
                        <div className="flex items-center gap-4 mb-4">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                                <h1 className="text-xl font-bold text-slate-900">
                                    Les<span className="text-gradient">Extras</span>
                                </h1>
                            </div>

                            {/* Search Bar */}
                            <div className="flex-1 max-w-xl">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un professionnel, une mission, un service..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="input-premium pl-12 pr-4"
                                        aria-label="Rechercher"
                                    />
                                </div>
                            </div>

                            {/* Notifications */}
                            <button
                                aria-label="Notifications"
                                className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <Bell className="w-5 h-5 text-slate-600" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full" />
                            </button>
                        </div>

                        {/* Filter Badges */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                            <span className="flex-shrink-0 text-xs font-medium text-slate-400 mr-1">
                                <Filter className="w-4 h-4" />
                            </span>
                            {FILTER_BADGES.map((filter) => {
                                const Icon = filter.icon;
                                const isActive = activeFilters.includes(filter.id);
                                return (
                                    <button
                                        key={filter.id}
                                        onClick={() => toggleFilter(filter.id)}
                                        className={`
                      pill-btn flex-shrink-0 flex items-center gap-1.5
                      ${isActive ? 'pill-btn-active' : 'pill-btn-inactive'}
                    `}
                                    >
                                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : filter.color}`} />
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-6">
                    {/* Feed Grid - Masonry */}
                    <div className="flex-1">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4"
                        >
                            {filteredFeed.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={itemVariants}
                                    className="break-inside-avoid"
                                >
                                    {item.type === 'NEED' ? (
                                        <NeedCard
                                            id={item.id}
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
                                            onClick={() => console.log('Need clicked:', item.id)}
                                        />
                                    ) : (
                                        <OfferCard
                                            id={item.id}
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
                                            onClick={() => console.log('Offer clicked:', item.id)}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Empty State */}
                        {filteredFeed.length === 0 && (
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
                        )}
                    </div>

                    {/* Sidebar - Desktop Only */}
                    <aside className="hidden lg:block w-80 flex-shrink-0 space-y-6">
                        {/* Mon Vivier */}
                        <div className="bg-white rounded-2xl p-5 shadow-soft">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-coral-500" />
                                    Mon Vivier
                                </h2>
                                <button className="text-xs text-coral-600 font-medium hover:underline">
                                    Voir tout
                                </button>
                            </div>

                            <div className="space-y-3">
                                {talentPool.map((talent) => (
                                    <div
                                        key={talent.id}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-100 to-orange-100 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-coral-600">
                                                {talent.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                {talent.name}
                                            </p>
                                            <p className="text-xs text-slate-500">{talent.role}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                            <span className="font-medium">{talent.rating}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activité Récente */}
                        <div className="bg-white rounded-2xl p-5 shadow-soft">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-500" />
                                    Activité récente
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {activity.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-700 leading-snug">
                                                {item.text}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Il y a {item.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-coral-500 to-orange-500 rounded-2xl p-5 text-white">
                            <h3 className="font-semibold mb-3">Cette semaine</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                                    <p className="text-2xl font-bold">12</p>
                                    <p className="text-xs text-white/80">Nouvelles missions</p>
                                </div>
                                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                                    <p className="text-2xl font-bold">5</p>
                                    <p className="text-xs text-white/80">Candidatures</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
