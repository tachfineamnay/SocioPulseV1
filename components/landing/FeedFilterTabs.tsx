'use client';

import { useState } from 'react';

// ===========================================
// FEED FILTER TABS - Missions / Profils / Services
// Uses existing design tokens
// ===========================================

export type FeedFilter = 'all' | 'missions' | 'profiles' | 'services';

interface FeedFilterTabsProps {
    value: FeedFilter;
    onChange: (filter: FeedFilter) => void;
    showServices?: boolean; // Hidden on MedicoPulse
}

const TABS: { value: FeedFilter; label: string; emoji: string }[] = [
    { value: 'all', label: 'Toutes', emoji: '✨' },
    { value: 'missions', label: 'Missions', emoji: '🚑' },
    { value: 'profiles', label: 'Profils', emoji: '👤' },
    { value: 'services', label: 'Services', emoji: '🎓' },
];

export function FeedFilterTabs({ value, onChange, showServices = true }: FeedFilterTabsProps) {
    const visibleTabs = showServices
        ? TABS
        : TABS.filter(tab => tab.value !== 'services');

    return (
        <div className="flex justify-center px-4 py-2">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 backdrop-blur-sm">
                {visibleTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        className={`
                            relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${value === tab.value
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                            }
                        `}
                    >
                        <span className="mr-1.5">{tab.emoji}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
