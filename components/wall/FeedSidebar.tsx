'use client';

import { useEffect, useState } from 'react';
import { NewsWidget, NewsItem } from './NewsWidget';
import { SuccessWidget, SuccessItem } from './SuccessWidget';
import { Users, Star, ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// ===========================================
// TYPES
// ===========================================

export interface SidebarData {
    news: NewsItem[];
    recentSuccess: SuccessItem[];
}

export interface TalentPoolItem {
    id: string;
    name: string;
    role: string;
    avatar: string | null;
    rating: number;
}

export interface FeedSidebarProps {
    talentPool?: TalentPoolItem[];
    initialData?: SidebarData;
}

// ===========================================
// API FETCHER
// ===========================================

async function fetchSidebarData(): Promise<SidebarData> {
    try {
        const res = await fetch('/api/wall/sidebar', {
            next: { revalidate: 300 }, // Cache 5 minutes
        });
        if (!res.ok) throw new Error('Failed to fetch sidebar');
        return res.json();
    } catch (error) {
        console.error('Sidebar fetch error:', error);
        return { news: [], recentSuccess: [] };
    }
}

// ===========================================
// COMPONENT
// ===========================================

export function FeedSidebar({ talentPool = [], initialData }: FeedSidebarProps) {
    const [sidebarData, setSidebarData] = useState<SidebarData>(
        initialData || { news: [], recentSuccess: [] }
    );
    const [isLoading, setIsLoading] = useState(!initialData);

    useEffect(() => {
        if (!initialData) {
            fetchSidebarData().then((data) => {
                setSidebarData(data);
                setIsLoading(false);
            });
        }
    }, [initialData]);

    return (
        <aside className="hidden lg:block w-80 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
            <div className="space-y-6 pb-6">
                
                {/* Widget 1: Veille Sectorielle */}
                {!isLoading && <NewsWidget news={sidebarData.news} />}

                {/* Widget 2: Derniers Succès */}
                {!isLoading && <SuccessWidget recentSuccess={sidebarData.recentSuccess} />}

                {/* Widget 3: Mon Vivier (optional) */}
                {talentPool.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Users className="w-4 h-4 text-brand-600" />
                                Mon Vivier
                            </h3>
                            <Link
                                href="/vivier"
                                className="text-xs text-brand-600 font-medium hover:underline"
                            >
                                Voir tout
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {talentPool.slice(0, 5).map((talent) => (
                                <Link
                                    key={talent.id}
                                    href={`/profile/${talent.id}`}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-100 to-indigo-100 flex items-center justify-center overflow-hidden">
                                        {talent.avatar ? (
                                            <img
                                                src={talent.avatar}
                                                alt={talent.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm font-semibold text-brand-600">
                                                {(talent.name || '?').charAt(0)}
                                            </span>
                                        )}
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
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Widget 4: Quick Stats Card */}
                <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4" />
                        <h3 className="font-semibold">Cette semaine</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                            <p className="text-2xl font-bold">12</p>
                            <p className="text-xs text-white/80">Nouvelles missions</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                            <p className="text-2xl font-bold">5</p>
                            <p className="text-xs text-white/80">Contacts reçus</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
