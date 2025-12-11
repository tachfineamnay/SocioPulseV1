'use client';

import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Clock, MapPin, AlertTriangle, Building2 } from 'lucide-react';

export interface NeedCardProps {
    id: string;
    authorId?: string;
    currentUserId?: string;
    onSelfContact?: () => void;
    title: string;
    establishment: string;
    establishmentLogo?: string;
    city: string;
    description: string;
    urgencyLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    hourlyRate?: number;
    jobTitle: string;
    startDate: string;
    isNightShift?: boolean;
    tags?: string[];
    onClick?: () => void;
}

const urgencyConfig = {
    LOW: { label: 'Sous 1 semaine', color: 'bg-slate-100 text-slate-600' },
    MEDIUM: { label: 'Sous 48h', color: 'bg-amber-100 text-amber-700' },
    HIGH: { label: 'Sous 24h', color: 'bg-orange-100 text-orange-700' },
    CRITICAL: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
};

export function NeedCard({
    id,
    authorId,
    currentUserId,
    title,
    establishment,
    establishmentLogo,
    city,
    description,
    urgencyLevel = 'MEDIUM',
    hourlyRate,
    jobTitle,
    startDate,
    isNightShift,
    tags = [],
    onClick,
    onSelfContact,
}: NeedCardProps) {
    const urgency = urgencyConfig[urgencyLevel];
    const isUrgent = urgencyLevel === 'HIGH' || urgencyLevel === 'CRITICAL';
    const router = useRouter();

    const handleContact = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        if (!authorId) return;
        if (currentUserId && authorId === currentUserId) {
            onSelfContact?.();
            return;
        }

        router.push(`/messages?recipientId=${encodeURIComponent(authorId)}`);
    };

    return (
        <motion.article
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
        group relative bg-white rounded-2xl p-5 cursor-pointer
        border-l-4 border-blue-500
        shadow-soft hover:shadow-soft-lg
        transition-shadow duration-300
      `}
        >
            {/* Urgent Badge */}
            {isUrgent && (
                <div className="absolute -top-2 -right-2 z-10">
                    <span className={`
            inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
            ${urgency.color} animate-pulse
          `}>
                        <AlertTriangle className="w-3 h-3" />
                        {urgency.label}
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
                {/* Establishment Logo */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                    {establishmentLogo ? (
                        <img src={establishmentLogo} alt={establishment} className="w-full h-full object-cover" />
                    ) : (
                        <Building2 className="w-6 h-6 text-blue-500" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-base leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">{establishment}</p>
                </div>
            </div>

            {/* Job Title Badge */}
            <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                    {jobTitle}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
                {description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {city}
                </span>
                <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(startDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                    })}
                    {isNightShift && ' - Nuit'}
                </span>
                {hourlyRate && (
                    <span className="ml-auto font-semibold text-slate-900">
                        {hourlyRate} EUR/h
                    </span>
                )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                    {tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                    {tags.length > 3 && (
                        <span className="text-xs text-slate-400">+{tags.length - 3}</span>
                    )}
                </div>
            )}

            <div className="mt-4 flex items-center justify-end">
                <button
                    type="button"
                    onClick={handleContact}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                    aria-label={`Contacter ${establishment}`}
                >
                    Contacter
                </button>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors pointer-events-none" />
        </motion.article>
    );
}
