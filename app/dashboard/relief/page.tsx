'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Siren,
    TrendingUp,
    Users,
    Clock,
    Calendar,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { FlashRequestForm, MissionMonitor } from '@/components/dashboard';
import { getActiveMissions } from './actions';

// Mock stats
const STATS = [
    { label: 'Missions ce mois', value: '24', change: '+12%', icon: TrendingUp },
    { label: 'Taux de réponse', value: '94%', change: '+5%', icon: Users },
    { label: 'Délai moyen', value: '18 min', change: '-3 min', icon: Clock },
];

export default function ReliefDashboardPage() {
    const [missions, setMissions] = useState<any[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    // Load initial missions
    useEffect(() => {
        async function loadMissions() {
            const data = await getActiveMissions();
            setMissions(data);
        }
        loadMissions();
    }, [refreshKey]);

    const handleMissionCreated = (missionId: string, candidatesFound: number) => {
        // Add new mission to the list
        const newMission = {
            id: missionId,
            jobTitle: 'Nouvelle mission',
            startTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            status: 'SEARCHING' as const,
            candidateName: null,
            urgencyLevel: 'CRITICAL' as const,
            createdAt: new Date().toISOString(),
        };

        setMissions(prev => [newMission, ...prev]);

        // Simulate finding a candidate after a few seconds
        setTimeout(() => {
            setMissions(prev => prev.map(m =>
                m.id === missionId
                    ? { ...m, status: 'ASSIGNED', candidateName: 'Sophie M.' }
                    : m
            ));
        }, 8000);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                                    <Siren className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-slate-900">SOS Renfort</h1>
                                    <p className="text-xs text-slate-500">Gestion des renforts urgents</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/dashboard/relief/history"
                                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                Historique
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                >
                    {STATS.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-5 shadow-soft"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-slate-600" />
                                    </div>
                                </div>
                                <p className="text-xs text-green-600 font-medium mt-2">{stat.change}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Flash Request Form */}
                    <div className="lg:col-span-1">
                        <FlashRequestForm onMissionCreated={handleMissionCreated} />

                        {/* Quick Tips */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100"
                        >
                            <h4 className="font-medium text-blue-900 text-sm mb-2">💡 Astuce</h4>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Plus le tarif est attractif, plus vous recevrez de candidatures rapidement.
                                Le taux moyen dans votre région est de <strong>24€/h</strong>.
                            </p>
                        </motion.div>
                    </div>

                    {/* Mission Monitor */}
                    <div className="lg:col-span-2">
                        <MissionMonitor initialMissions={missions} />
                    </div>
                </div>
            </main>

            {/* Emergency Float Button - Mobile */}
            <div className="fixed bottom-6 right-6 lg:hidden">
                <button className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30 flex items-center justify-center">
                    <Siren className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
