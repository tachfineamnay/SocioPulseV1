'use client';

import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Euro, Calendar, Zap, Clock, Building2, ChevronRight } from 'lucide-react';

// ===========================================
// MISSION CARD - Design "Utilitaire" B2B
// Focus: Données (Lieu, Prix, Date) + Confiance (Recruteur)
// Palette: Rose-500 / Slate-900
// ===========================================

export interface MissionCardProps {
    data: any;
    onClick?: () => void;
}

const urgencyConfig = {
    LOW: { label: 'Sous 1 semaine', color: 'bg-slate-100 text-slate-600', urgent: false },
    MEDIUM: { label: 'Sous 48h', color: 'bg-amber-100 text-amber-700', urgent: false },
    HIGH: { label: 'Sous 24h', color: 'bg-orange-100 text-orange-700', urgent: true },
    CRITICAL: { label: 'Urgent', color: 'bg-rose-100 text-rose-700', urgent: true },
};

const getInitials = (value?: string) => {
    if (!value) return 'LX';
    const parts = value.split(' ').filter(Boolean);
    if (parts.length === 0) return 'LX';
    return parts.map((part) => part[0]?.toUpperCase()).join('').slice(0, 2);
};

const formatRelativeTime = (value?: string | Date | null) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return '';

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.round(diffHours / 24);
    return `Il y a ${diffDays}j`;
};

const formatDate = (value?: string | Date | null) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

export function MissionCard({ data, onClick }: MissionCardProps) {
    const mission = data || {};
    const missionId = mission?.id;
    const establishment = mission?.client?.establishment?.name || mission?.establishment || mission?.authorName || 'Établissement';
    const establishmentLogo = mission?.client?.establishment?.logoUrl || mission?.establishmentLogo;
    const city = mission?.city || mission?.client?.establishment?.city || 'Non précisé';
    const description = mission?.description || mission?.content || '';
    const urgencyLevel = (mission?.urgencyLevel || 'MEDIUM') as keyof typeof urgencyConfig;
    const hourlyRate = mission?.hourlyRate !== undefined && mission?.hourlyRate !== null ? Number(mission.hourlyRate) : null;
    const totalPrice = mission?.totalPrice !== undefined ? Number(mission.totalPrice) : null;
    const missionTitle = mission?.title || mission?.jobTitle || 'Mission';
    const jobType = mission?.jobTitle || mission?.missionType || missionTitle;
    const startDate = mission?.startDate;
    const endDate = mission?.endDate;
    const isNightShift = Boolean(mission?.isNightShift);
    const postedLabel = formatRelativeTime(mission?.createdAt);
    const detailHref = missionId ? `/need/${missionId}` : undefined;
    const urgency = urgencyConfig[urgencyLevel];
    const isUrgent = urgency.urgent;
    const router = useRouter();

    // Background image for texture (EHPAD/establishment type)
    const bgImage = mission?.backgroundImage || mission?.establishmentImage;

    const handleViewMission = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();
        if (!missionId) return;
        router.push(`/dashboard/missions/${missionId}`);
    };

    const card = (
        <motion.article
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer
                       border-l-4 border-rose-500
                       shadow-soft hover:shadow-soft-lg
                       transition-all duration-300"
        >
            {/* Background Texture Image (subtle) */}
            {bgImage && (
                <div className="absolute inset-0 pointer-events-none">
                    <img
                        src={bgImage}
                        alt=""
                        className="w-full h-full object-cover opacity-5"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-white/90" />
                </div>
            )}

            {/* Content */}
            <div className="relative p-5">
                {/* Header - Confiance (Recruteur) */}
                <div className="flex items-start gap-3 mb-4">
                    {/* Avatar Recruteur */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
                        {establishmentLogo ? (
                            <img
                                src={establishmentLogo}
                                alt={establishment}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                        ) : (
                            <Building2 className="w-5 h-5 text-slate-500" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{establishment}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {postedLabel}
                        </p>
                    </div>

                    {/* Urgent Badge */}
                    {isUrgent && (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${urgency.color}`}>
                            <Zap className="w-3 h-3" />
                            {urgency.label}
                        </span>
                    )}
                </div>

                {/* Titre du Poste */}
                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3 group-hover:text-rose-600 transition-colors">
                    {missionTitle}
                </h3>

                {/* Data Grid - 2 colonnes */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {/* Lieu */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100">
                        <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700 truncate">{city}</span>
                    </div>

                    {/* Tarif */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100">
                        <Euro className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-sm font-bold text-slate-900">
                            {hourlyRate !== null ? `${hourlyRate}€/h` : totalPrice !== null ? `${totalPrice}€` : 'À définir'}
                        </span>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100">
                        <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700">
                            {startDate ? formatDate(startDate) : 'Dès que possible'}
                            {endDate && ` - ${formatDate(endDate)}`}
                        </span>
                    </div>

                    {/* Type de poste / Nuit */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50">
                        <span className="text-sm font-medium text-rose-700 truncate">
                            {jobType}
                            {isNightShift && ' 🌙'}
                        </span>
                    </div>
                </div>

                {/* Description courte */}
                {description && (
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
                        {description}
                    </p>
                )}

                {/* Footer - CTA */}
                <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={handleViewMission}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl 
                                   border-2 border-rose-200 text-rose-600 text-sm font-semibold
                                   hover:bg-rose-50 hover:border-rose-300
                                   active:scale-95 transition-all"
                        aria-label={`Voir la mission ${missionTitle}`}
                    >
                        Voir la mission
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-rose-200 transition-colors pointer-events-none" />
        </motion.article>
    );

    return detailHref ? (
        <Link href={detailHref} className="block h-full">
            {card}
        </Link>
    ) : (
        card
    );
}
