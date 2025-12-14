'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    ChevronLeft,
    Bell,
    Filter,
} from 'lucide-react';
import { BookingList, type Booking } from '@/components/bookings';
import { ToastContainer, useToasts } from '@/components/ui/Toast';

// ===========================================
// MOCK DATA
// ===========================================

const MOCK_BOOKINGS: Booking[] = [
    {
        id: '1',
        title: 'Mission Aide-Soignant de Nuit',
        partnerName: 'Clinique Saint-Joseph',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // +2 days
        time: '20:00',
        duration: '10h',
        location: 'Lyon 3e',
        price: 220,
        status: 'CONFIRMED',
    },
    {
        id: '2',
        title: 'Remplacement Infirmier(e)',
        partnerName: 'EHPAD Les Oliviers',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
        time: '07:00',
        duration: '8h',
        location: 'Villeurbanne',
        price: 180,
        status: 'PENDING',
    },
    {
        id: '3',
        title: 'Animation Atelier Mémoire',
        partnerName: 'Résidence Senior Beau Site',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // -2 days
        time: '14:00',
        duration: '3h',
        location: 'Lyon 6e',
        price: 90,
        status: 'COMPLETED',
    },
    {
        id: '4',
        title: 'Garde de Nuit',
        partnerName: 'M. et Mme Durand',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // -10 days
        time: '21:00',
        duration: '12h',
        location: 'Bron',
        price: 150,
        status: 'CANCELLED',
    },
];

// ===========================================
// TYPES
// ===========================================

type TabType = 'UPCOMING' | 'PENDING' | 'HISTORY';

// ===========================================
// COMPONENT
// ===========================================

export default function BookingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('UPCOMING');
    const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
    const { toasts, addToast, removeToast } = useToasts();

    const handleCancel = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
            setBookings(prev => prev.map(booking =>
                booking.id === id ? { ...booking, status: 'CANCELLED' } : booking
            ));
            addToast({ message: 'Réservation annulée', type: 'info' });
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (activeTab === 'UPCOMING') return booking.status === 'CONFIRMED' && booking.date > new Date();
        if (activeTab === 'PENDING') return booking.status === 'PENDING';
        if (activeTab === 'HISTORY') return booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.date < new Date();
        return false;
    });

    const TABS: { id: TabType; label: string; count?: number }[] = [
        { id: 'UPCOMING', label: 'À venir', count: bookings.filter(b => b.status === 'CONFIRMED' && b.date > new Date()).length },
        { id: 'PENDING', label: 'En attente', count: bookings.filter(b => b.status === 'PENDING').length },
        { id: 'HISTORY', label: 'Historique' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors"
                                aria-label="Retour"
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-600" />
                            </Link>
                            <h1 className="text-xl font-bold text-slate-900">
                                Mon Agenda
                            </h1>
                        </div>
                        <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                            <Calendar className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 -mb-[1px] overflow-x-auto scrollbar-none">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                                        ${isActive ? 'text-coral-600' : 'text-slate-500 hover:text-slate-700'}
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        {tab.label}
                                        {tab.count !== undefined && tab.count > 0 && (
                                            <span className={`
                                                px-1.5 py-0.5 text-[10px] rounded-full
                                                ${isActive ? 'bg-coral-100 text-coral-600' : 'bg-slate-100 text-slate-500'}
                                            `}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabBorder"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-coral-500"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <BookingList
                            bookings={filteredBookings}
                            onCancel={handleCancel}
                        />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
