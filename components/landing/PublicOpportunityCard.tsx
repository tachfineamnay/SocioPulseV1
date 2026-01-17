'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    MapPin, Clock, Siren, Video, User, ArrowUpRight,
    CheckCircle, Star, Briefcase
} from 'lucide-react';
import { isMedical } from '@/lib/brand';

// ===========================================
// PUBLIC OPPORTUNITY CARD - Polymorphic Feed Card
// Adapts style based on item type and brand
// Uses existing design tokens ONLY
// ===========================================

export type OpportunityType = 'mission' | 'profile' | 'service';

export interface PublicOpportunityItem {
    id: string;
    type: OpportunityType;
    title: string;
    subtitle?: string;
    location?: string;
    price?: number;
    priceLabel?: string;
    imageUrl?: string;
    avatarUrl?: string;
    isUrgent?: boolean;
    isAvailable?: boolean;
    tags?: string[];
    category?: string;
    expiresAt?: string;
    rating?: number;
}

interface PublicOpportunityCardProps {
    item: PublicOpportunityItem;
}

// Format time remaining
const formatTimeRemaining = (expiresAt: string): string => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expiré';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}j`;
};

// Card style variants based on type and brand
const getCardStyles = (type: OpportunityType, isUrgent: boolean) => {
    const medical = isMedical();

    switch (type) {
        case 'mission':
            return {
                container: isUrgent
                    ? 'bg-alert-50/80 border-alert-200 hover:border-alert-300'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300',
                badge: 'bg-alert-500 text-white',
                badgeIcon: Siren,
                badgeLabel: 'Renfort',
                accent: 'text-alert-600',
            };
        case 'service':
            return {
                container: 'bg-live-50/50 border-live-200 hover:border-live-300',
                badge: 'bg-live-500 text-white',
                badgeIcon: Video,
                badgeLabel: medical ? 'Service' : 'Atelier',
                accent: 'text-live-600',
            };
        case 'profile':
            return {
                container: medical
                    ? 'bg-primary-50/50 border-primary-200 hover:border-primary-300'
                    : 'bg-brand-50/50 border-brand-200 hover:border-brand-300',
                badge: medical ? 'bg-primary-600 text-white' : 'bg-brand-600 text-white',
                badgeIcon: User,
                badgeLabel: medical ? 'Soignant' : 'Talent',
                accent: medical ? 'text-primary-600' : 'text-brand-600',
            };
    }
};

export function PublicOpportunityCard({ item }: PublicOpportunityCardProps) {
    const styles = getCardStyles(item.type, item.isUrgent ?? false);
    const BadgeIcon = styles.badgeIcon;

    const href = item.type === 'mission'
        ? `/need/${item.id}`
        : item.type === 'profile'
            ? `/profile/${item.id}`
            : `/offer/${item.id}`;

    return (
        <Link href={href}>
            <motion.article
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`
                    group relative h-full overflow-hidden 
                    rounded-theme-xl p-5 
                    border backdrop-blur-sm
                    shadow-theme-sm hover:shadow-theme-md
                    transition-all duration-300
                    ${styles.container}
                `}
            >
                {/* Header: Badge + Time/Price */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    {/* Type Badge */}
                    <span className={`
                        inline-flex items-center gap-1.5 
                        px-2.5 py-1 rounded-full 
                        text-xs font-semibold
                        ${styles.badge}
                    `}>
                        <BadgeIcon className="h-3.5 w-3.5" />
                        {styles.badgeLabel}
                    </span>

                    {/* Time Remaining or Price */}
                    {item.expiresAt && item.type === 'mission' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTimeRemaining(item.expiresAt)}
                        </span>
                    ) : item.price ? (
                        <span className="text-sm font-bold text-slate-900">
                            {item.priceLabel || `${item.price}€/h`}
                        </span>
                    ) : null}
                </div>

                {/* Avatar (for profiles) */}
                {item.type === 'profile' && (
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`
                            relative h-12 w-12 rounded-full 
                            bg-gradient-to-br from-slate-200 to-slate-300
                            flex items-center justify-center
                            overflow-hidden
                        `}>
                            {item.avatarUrl ? (
                                <img
                                    src={item.avatarUrl}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User className="h-6 w-6 text-slate-500" />
                            )}
                        </div>

                        {/* Rating */}
                        {item.rating && (
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium text-slate-700">
                                    {item.rating.toFixed(1)}
                                </span>
                            </div>
                        )}

                        {/* Available Badge */}
                        {item.isAvailable && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-xs font-medium text-green-700">
                                <CheckCircle className="h-3 w-3" />
                                Dispo
                            </span>
                        )}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 mb-1">
                    {item.title}
                </h3>

                {/* Subtitle */}
                {item.subtitle && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {item.subtitle}
                    </p>
                )}

                {/* Location */}
                {item.location && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                        <MapPin className={`h-4 w-4 ${styles.accent}`} />
                        {item.location}
                    </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                        {item.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* CTA Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className={`h-5 w-5 ${styles.accent}`} />
                </div>
            </motion.article>
        </Link>
    );
}
