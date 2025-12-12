export declare enum MissionUrgency {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare class FindCandidatesDto {
    skills?: string[];
    radiusKm?: number;
    limit?: number;
}
export declare class CandidateResultDto {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    headline: string | null;
    specialties: string[];
    diplomas: any[];
    hourlyRate: number | null;
    averageRating: number;
    totalMissions: number;
    distance: number;
    matchScore: number;
    isAvailable: boolean;
}
export declare class MatchingResultDto {
    candidates: CandidateResultDto[];
    totalFound: number;
    searchRadius: number;
    missionId: string;
}
export declare class CreateMissionDto {
    jobTitle: string;
    title?: string;
    hourlyRate: number;
    isNightShift?: boolean;
    urgencyLevel: MissionUrgency;
    description?: string;
    startDate: string;
    endDate?: string;
    city: string;
    postalCode: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    requiredSkills?: string[];
    requiredDiplomas?: string[];
}
