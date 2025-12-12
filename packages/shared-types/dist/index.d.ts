/**
 * @lesextras/types
 * Single Source of Truth for all types shared between API and Web
 *
 * This package re-exports Prisma generated types and adds custom DTOs.
 */
export { UserRole, UserStatus, ServiceType, MissionStatus, MissionUrgency, BookingStatus, PostType, TransactionType, TransactionStatus, type User, type Profile, type Establishment, type Service, type AvailabilitySlot, type TalentPool, type TalentPoolMember, type ReliefMission, type MissionApplication, type Booking, type Post, type Review, type Transaction, type Notification, type Message, type Prisma, } from '@prisma/client';
/**
 * User payload stored in JWT token
 */
export interface JwtPayload {
    sub: string;
    email: string;
    role: import('@prisma/client').UserRole;
    status: import('@prisma/client').UserStatus;
    iat?: number;
    exp?: number;
}
/**
 * Authenticated user context (after JWT validation)
 */
export interface AuthenticatedUser {
    id: string;
    email: string;
    role: import('@prisma/client').UserRole;
    status: import('@prisma/client').UserStatus;
}
/**
 * Geocoding result from French Government API
 */
export interface GeocodingResult {
    latitude: number;
    longitude: number;
    label: string;
    city: string;
    postalCode: string;
    confidence: number;
}
/**
 * Feed item for the Wall (can be Post or ReliefMission)
 */
export interface FeedItem {
    id: string;
    type: 'POST' | 'MISSION';
    title: string;
    content: string;
    category?: string;
    city?: string;
    postalCode?: string;
    createdAt: Date;
    author: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    postType?: import('@prisma/client').PostType;
    tags?: string[];
    urgency?: import('@prisma/client').MissionUrgency;
    status?: import('@prisma/client').MissionStatus;
    hourlyRate?: number;
    jobTitle?: string;
}
/**
 * Candidate result from matching engine
 */
export interface CandidateResult {
    profileId: string;
    userId: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    headline?: string;
    hourlyRate?: number;
    distanceKm: number;
    matchScore: number;
    specialties: string[];
    averageRating: number;
    totalMissions: number;
}
/**
 * Video session room details
 */
export interface VideoRoomDetails {
    roomId: string;
    roomName: string;
    meetingUrl: string;
    hostToken: string;
    participantToken: string;
    expiresAt: Date;
}
/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}
/**
 * Pagination params
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
/**
 * Diploma structure (stored as JSON in Prisma)
 */
export interface Diploma {
    name: string;
    year?: number;
    url?: string;
    verified?: boolean;
}
/**
 * Pricing option for services (stored as JSON in Prisma)
 */
export interface PricingOption {
    name: string;
    price: number;
    duration?: string;
    maxParticipants?: number;
}
