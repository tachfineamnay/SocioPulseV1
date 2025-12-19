'use client';

import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video, Palette, Star, MapPin, MessageCircle } from 'lucide-react';

// ===========================================
// SERVICE CARD - Design "Immersif" Expert
// Focus: Visuel (Photo activité) + Humain (L'Expert)
// Palette: Teal-500 / Indigo-600
// ===========================================

export interface ServiceCardProps {
    data: any;
    currentUserId?: string;
    onSelfContact?: () => void;
    onClick?: () => void;
}

const getInitials = (value?: string) => {
    if (!value) return 'LX';
    const parts = value.split(' ').filter(Boolean);
    if (parts.length === 0) return 'LX';
    return parts.map((part) => part[0]?.toUpperCase()).join('').slice(0, 2);
};

// Service type badge config
const serviceTypeBadge = {
    COACHING_VIDEO: { 
        label: 'SocioLive', 
        icon: Video, 
        bgColor: 'bg-teal-500', 
        textColor: 'text-white' 
    },
    WORKSHOP: { 
        label: 'Atelier', 
        icon: Palette, 
        bgColor: 'bg-indigo-600', 
        textColor: 'text-white' 
    },
    DEFAULT: { 
        label: 'Service', 
        icon: Palette, 
        bgColor: 'bg-slate-700', 
        textColor: 'text-white' 
    },
};

export function ServiceCard({
    data,
    currentUserId,
    onClick,
    onSelfContact,
}: ServiceCardProps) {
    const service = data || {};
    const authorId = service?.profile?.userId || service?.authorId || service?.author?.id;
    const title = service?.name || service?.title || 'Service';
    const providerName = service?.profile
        ? `${service.profile.firstName || ''} ${service.profile.lastName || ''}`.trim() || service.profile.displayName || service.authorName || 'Expert'
        : service?.authorName || service?.providerName || 'Expert';
    const providerAvatar = service?.profile?.avatarUrl || service?.authorAvatar || service?.providerAvatar;
    const providerRating = Number(service?.providerRating ?? service?.profile?.averageRating ?? 0);
    const providerReviews = Number(service?.providerReviews ?? service?.profile?.totalReviews ?? 0);
    const city = service?.city || service?.profile?.city || '';
    const description = service?.content || service?.description || '';
    const serviceType = (service?.serviceType || service?.type || 'WORKSHOP') as keyof typeof serviceTypeBadge;
    const category = service?.category;
    const basePriceRaw = service?.basePrice ?? service?.hourlyRate ?? null;
    const basePrice = basePriceRaw !== null && basePriceRaw !== undefined ? Number(basePriceRaw) : null;
    const showBasePrice = basePrice !== null && !Number.isNaN(basePrice);
    const cardId = service?.id || service?.serviceId;
    const detailHref = cardId ? `/offer/${cardId}` : undefined;
    
    // Image de l'expert en action
    const imageUrl =
        service?.imageUrl ||
        (Array.isArray(service?.imageUrls) ? service.imageUrls[0] : undefined) ||
        (Array.isArray(service?.galleryUrls) ? service.galleryUrls[0] : undefined) ||
        service?.coverImage;
    
    // Fallback gradient if no image
    const hasImage = Boolean(imageUrl);
    
    const badgeConfig = serviceTypeBadge[serviceType] || serviceTypeBadge.DEFAULT;
    const BadgeIcon = badgeConfig.icon;
    const router = useRouter();

    const handleContact = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();

        if (!authorId) return;
        if (currentUserId && authorId === currentUserId) {
            onSelfContact?.();
            return;
        }

        router.push(`/messages?recipientId=${encodeURIComponent(authorId)}`);
    };

    const card = (
        <motion.article
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer
                       shadow-soft hover:shadow-soft-lg
                       transition-all duration-300"
        >
            {/* Image Container - Aspect Ratio 4:3 */}
            <div className="relative aspect-[4/3] overflow-hidden">
                {/* Background Image or Gradient */}
                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-teal-500 to-indigo-600" />
                )}

                {/* Gradient Overlay - Bottom to top for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating Badges - Top */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    {/* Service Type Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${badgeConfig.bgColor} ${badgeConfig.textColor} shadow-lg`}>
                        <BadgeIcon className="w-3.5 h-3.5" />
                        {badgeConfig.label}
                    </span>

                    {/* Category Badge (optional) */}
                    {category && (
                        <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 shadow-lg">
                            {category}
                        </span>
                    )}
                </div>

                {/* Price Badge - Bottom Right */}
                {showBasePrice && (
                    <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-sm font-bold text-slate-900 shadow-lg">
                            {basePrice}€<span className="text-xs font-normal text-slate-500">/h</span>
                        </span>
                    </div>
                )}

                {/* Content Overlay - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-white leading-tight mb-2 drop-shadow-lg group-hover:text-teal-200 transition-colors">
                        {title}
                    </h3>

                    {/* Expert Info */}
                    <div className="flex items-center gap-2">
                        {/* Mini Avatar */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center overflow-hidden ring-2 ring-white/50 shadow-sm">
                            {providerAvatar ? (
                                <img src={providerAvatar} alt={providerName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs font-semibold text-white">
                                    {getInitials(providerName)}
                                </span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate drop-shadow">{providerName}</p>
                            <div className="flex items-center gap-2 text-xs text-white/80">
                                {providerRating > 0 && (
                                    <span className="inline-flex items-center gap-0.5">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        {providerRating.toFixed(1)}
                                        <span className="text-white/60">({providerReviews})</span>
                                    </span>
                                )}
                                {city && (
                                    <span className="inline-flex items-center gap-0.5">
                                        <MapPin className="w-3 h-3" />
                                        {city}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - Contact Action */}
            <div className="p-4 bg-white">
                {/* Description courte */}
                {description && (
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">
                        {description}
                    </p>
                )}

                {/* CTA Button */}
                <button
                    type="button"
                    onClick={handleContact}
                    className="w-full inline-flex items-center justify-center gap-2 
                               px-4 py-2.5 rounded-xl 
                               bg-gradient-to-r from-teal-500 to-indigo-600 
                               text-white text-sm font-semibold
                               hover:from-teal-600 hover:to-indigo-700
                               shadow-md hover:shadow-lg
                               active:scale-[0.98] transition-all"
                    aria-label={`Contacter ${providerName}`}
                >
                    <MessageCircle className="w-4 h-4" />
                    Contacter l'expert
                </button>
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-teal-300 transition-colors pointer-events-none" />
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
