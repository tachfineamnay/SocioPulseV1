"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MatchingEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let MatchingEngineService = MatchingEngineService_1 = class MatchingEngineService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MatchingEngineService_1.name);
    }
    async createMission(dto, clientId) {
        try {
            const startDate = new Date(dto.startDate);
            const endDate = dto.endDate
                ? new Date(dto.endDate)
                : new Date(startDate.getTime() + 8 * 60 * 60 * 1000);
            const mission = await this.prisma.reliefMission.create({
                data: {
                    clientId,
                    title: dto.title || `Renfort - ${dto.jobTitle}`,
                    description: dto.description || '',
                    jobTitle: dto.jobTitle,
                    hourlyRate: dto.hourlyRate,
                    isNightShift: dto.isNightShift || false,
                    urgencyLevel: dto.urgencyLevel || 'HIGH',
                    startDate,
                    endDate,
                    city: dto.city,
                    postalCode: dto.postalCode,
                    address: dto.address || dto.city,
                    latitude: dto.latitude,
                    longitude: dto.longitude,
                    radiusKm: dto.radiusKm || 30,
                    requiredSkills: dto.requiredSkills || [],
                    requiredDiplomas: dto.requiredDiplomas || [],
                    status: 'OPEN',
                },
            });
            this.logger.log(`Mission created: ${mission.id} by client ${clientId}`);
            return mission;
        }
        catch (error) {
            this.logger.error(`createMission failed: ${error.message}`);
            throw new common_1.InternalServerErrorException('Erreur lors de la création de la mission');
        }
    }
    async findCandidates(missionId, options = {}) {
        const { skills = [], radiusKm = 30, limit = 10 } = options;
        try {
            const mission = await this.prisma.reliefMission.findUnique({
                where: { id: missionId },
                include: {
                    client: {
                        include: { establishment: true },
                    },
                },
            });
            if (!mission) {
                throw new common_1.NotFoundException(`Mission ${missionId} non trouvée`);
            }
            this.logger.log(`Finding candidates for mission: ${mission.title}`);
            const extras = await this.prisma.user.findMany({
                where: {
                    role: 'EXTRA',
                    status: 'VERIFIED',
                },
                include: {
                    profile: {
                        include: {
                            availabilitySlots: true,
                        },
                    },
                },
            });
            const missionLocation = {
                latitude: mission.latitude || 0,
                longitude: mission.longitude || 0,
            };
            const requiredSkills = mission.requiredSkills || [];
            const requiredDiplomas = mission.requiredDiplomas || [];
            const missionDate = mission.startDate;
            const candidates = [];
            for (const extra of extras) {
                if (!extra.profile)
                    continue;
                const profile = extra.profile;
                const profileLocation = {
                    latitude: profile.latitude || 0,
                    longitude: profile.longitude || 0,
                };
                const distance = this.calculateDistance(missionLocation, profileLocation);
                if (distance > (mission.radiusKm || radiusKm)) {
                    continue;
                }
                const profileSpecialties = profile.specialties || [];
                const skillsMatch = this.calculateSkillsMatch(requiredSkills, profileSpecialties);
                const profileDiplomas = profile.diplomas || [];
                const diplomasMatch = this.calculateDiplomasMatch(requiredDiplomas, profileDiplomas);
                const isAvailable = this.checkAvailability(profile.availabilitySlots, missionDate, mission.isNightShift);
                const matchScore = this.calculateMatchScore({
                    distance,
                    maxDistance: radiusKm,
                    skillsMatch,
                    diplomasMatch,
                    isAvailable,
                    averageRating: profile.averageRating,
                    totalMissions: profile.totalMissions,
                });
                candidates.push({
                    id: profile.id,
                    userId: extra.id,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    avatarUrl: profile.avatarUrl,
                    headline: profile.headline,
                    specialties: profileSpecialties,
                    diplomas: profileDiplomas,
                    hourlyRate: profile.hourlyRate,
                    averageRating: profile.averageRating,
                    totalMissions: profile.totalMissions,
                    distance: Math.round(distance * 10) / 10,
                    matchScore,
                    isAvailable,
                });
            }
            const sortedCandidates = candidates
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, limit);
            this.logger.log(`Found ${sortedCandidates.length} candidates for mission ${missionId}`);
            return {
                candidates: sortedCandidates,
                totalFound: candidates.length,
                searchRadius: radiusKm,
                missionId,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`findCandidates failed: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Erreur lors de la recherche de candidats');
        }
    }
    calculateDistance(point1, point2) {
        if (!point1.latitude || !point1.longitude || !point2.latitude || !point2.longitude) {
            return Infinity;
        }
        const R = 6371;
        const dLat = this.toRad(point2.latitude - point1.latitude);
        const dLon = this.toRad(point2.longitude - point1.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(point1.latitude)) *
                Math.cos(this.toRad(point2.latitude)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(deg) {
        return deg * (Math.PI / 180);
    }
    calculateSkillsMatch(required, available) {
        if (required.length === 0)
            return 1;
        const requiredLower = required.map((s) => s.toLowerCase());
        const availableLower = available.map((s) => s.toLowerCase());
        const matches = requiredLower.filter((skill) => availableLower.some((avail) => avail.includes(skill) || skill.includes(avail)));
        return matches.length / required.length;
    }
    calculateDiplomasMatch(required, available) {
        if (required.length === 0)
            return 1;
        const availableNames = available.map((d) => (d.name || '').toLowerCase());
        const requiredLower = required.map((d) => d.toLowerCase());
        const matches = requiredLower.filter((diploma) => availableNames.some((avail) => avail.includes(diploma) || diploma.includes(avail)));
        return matches.length / required.length;
    }
    checkAvailability(slots, missionDate, isNightShift) {
        if (!slots || slots.length === 0) {
            return true;
        }
        const dayOfWeek = missionDate.getDay();
        const daySlots = slots.filter((slot) => slot.isActive && slot.dayOfWeek === dayOfWeek);
        if (daySlots.length === 0) {
            const specificSlots = slots.filter((slot) => slot.isActive &&
                slot.specificDate &&
                new Date(slot.specificDate).toDateString() === missionDate.toDateString());
            return specificSlots.length > 0;
        }
        if (isNightShift) {
            return daySlots.some((slot) => {
                const startHour = parseInt(slot.startTime.split(':')[0], 10);
                return startHour >= 18 || startHour < 6;
            });
        }
        return true;
    }
    calculateMatchScore(params) {
        const { distance, maxDistance, skillsMatch, diplomasMatch, isAvailable, averageRating, totalMissions, } = params;
        const weights = {
            distance: 0.2,
            skills: 0.25,
            diplomas: 0.25,
            availability: 0.15,
            rating: 0.1,
            experience: 0.05,
        };
        const distanceScore = Math.max(0, 1 - distance / maxDistance);
        const availabilityScore = isAvailable ? 1 : 0.3;
        const ratingScore = averageRating / 5;
        const experienceScore = Math.min(totalMissions / 50, 1);
        const score = distanceScore * weights.distance +
            skillsMatch * weights.skills +
            diplomasMatch * weights.diplomas +
            availabilityScore * weights.availability +
            ratingScore * weights.rating +
            experienceScore * weights.experience;
        return Math.round(score * 100);
    }
    async getMissionWithApplications(missionId) {
        try {
            const mission = await this.prisma.reliefMission.findUnique({
                where: { id: missionId },
                include: {
                    client: {
                        include: { establishment: true },
                    },
                    assignedExtra: {
                        include: { profile: true },
                    },
                    applications: {
                        include: {
                            extra: {
                                include: { profile: true },
                            },
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });
            if (!mission) {
                throw new common_1.NotFoundException(`Mission ${missionId} non trouvée`);
            }
            return mission;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`getMissionWithApplications failed: ${error.message}`);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération');
        }
    }
    async applyToMission(missionId, extraId, coverLetter, proposedRate) {
        try {
            const mission = await this.prisma.reliefMission.findUnique({
                where: { id: missionId },
            });
            if (!mission) {
                throw new common_1.NotFoundException(`Mission ${missionId} non trouvée`);
            }
            if (mission.status !== 'OPEN') {
                throw new Error('Cette mission n\'accepte plus de candidatures');
            }
            const existingApplication = await this.prisma.missionApplication.findUnique({
                where: {
                    missionId_extraId: { missionId, extraId },
                },
            });
            if (existingApplication) {
                throw new Error('Vous avez déjà postulé à cette mission');
            }
            const application = await this.prisma.missionApplication.create({
                data: {
                    missionId,
                    extraId,
                    coverLetter,
                    proposedRate,
                    status: 'PENDING',
                },
                include: {
                    mission: true,
                    extra: {
                        include: { profile: true },
                    },
                },
            });
            this.logger.log(`Application created for mission ${missionId} by extra ${extraId}`);
            return application;
        }
        catch (error) {
            this.logger.error(`applyToMission failed: ${error.message}`);
            throw error;
        }
    }
};
exports.MatchingEngineService = MatchingEngineService;
exports.MatchingEngineService = MatchingEngineService = MatchingEngineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MatchingEngineService);
//# sourceMappingURL=matching-engine.service.js.map