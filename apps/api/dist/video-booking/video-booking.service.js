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
var VideoBookingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoBookingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../common/prisma/prisma.service");
let VideoBookingService = VideoBookingService_1 = class VideoBookingService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(VideoBookingService_1.name);
        this.LIVEKIT_URL = this.configService.get('LIVEKIT_URL') || 'https://meet.lesextras.fr';
    }
    async generateVideoSlot(dto) {
        const { bookingId, durationMinutes = 60 } = dto;
        try {
            const booking = await this.prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    client: true,
                    provider: {
                        include: { profile: true },
                    },
                    service: true,
                },
            });
            if (!booking) {
                throw new common_1.NotFoundException(`Booking ${bookingId} non trouvé`);
            }
            if (!booking.isVideoSession) {
                throw new common_1.BadRequestException('Ce booking n\'est pas une session vidéo');
            }
            if (booking.videoRoomId) {
                return this.getExistingRoom(booking);
            }
            const roomId = `room_${(0, uuid_1.v4)()}`;
            const roomName = this.generateRoomName(booking);
            const { hostToken, participantToken } = await this.generateTokens(roomId, roomName, booking.provider.profile?.firstName || 'Host', booking.client.email, durationMinutes);
            const meetingUrl = `${this.LIVEKIT_URL}/room/${roomId}`;
            const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);
            await this.prisma.booking.update({
                where: { id: bookingId },
                data: {
                    videoRoomId: roomId,
                    videoRoomToken: hostToken,
                    meetingUrl,
                },
            });
            this.logger.log(`Video room created: ${roomId} for booking ${bookingId}`);
            return {
                roomId,
                roomName,
                hostToken,
                participantToken,
                meetingUrl,
                expiresAt,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`generateVideoSlot failed: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Erreur lors de la création de la room vidéo');
        }
    }
    async joinVideoSession(roomId, userId, userName) {
        try {
            const booking = await this.prisma.booking.findFirst({
                where: { videoRoomId: roomId },
                include: {
                    client: true,
                    provider: true,
                },
            });
            if (!booking) {
                throw new common_1.NotFoundException(`Room ${roomId} non trouvée`);
            }
            const isHost = booking.providerId === userId;
            const isParticipant = booking.clientId === userId;
            if (!isHost && !isParticipant) {
                throw new common_1.BadRequestException('Vous n\'êtes pas autorisé à rejoindre cette session');
            }
            const token = await this.generateSingleToken(roomId, userName, isHost, 60);
            return {
                token,
                roomName: `session-${booking.id.slice(0, 8)}`,
                meetingUrl: booking.meetingUrl || `${this.LIVEKIT_URL}/room/${roomId}`,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`joinVideoSession failed: ${error.message}`);
            throw new common_1.InternalServerErrorException('Erreur lors de la connexion à la session');
        }
    }
    async endVideoSession(roomId, recordingUrl) {
        try {
            const booking = await this.prisma.booking.findFirst({
                where: { videoRoomId: roomId },
            });
            if (!booking) {
                throw new common_1.NotFoundException(`Room ${roomId} non trouvée`);
            }
            await this.prisma.booking.update({
                where: { id: booking.id },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                    recordingUrl,
                },
            });
            this.logger.log(`Video session ended: ${roomId}`);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`endVideoSession failed: ${error.message}`);
            throw new common_1.InternalServerErrorException('Erreur lors de la fin de session');
        }
    }
    async getUpcomingSessions(userId) {
        try {
            const now = new Date();
            const sessions = await this.prisma.booking.findMany({
                where: {
                    isVideoSession: true,
                    status: { in: ['CONFIRMED', 'PAID'] },
                    sessionDate: { gte: now },
                    OR: [
                        { clientId: userId },
                        { providerId: userId },
                    ],
                },
                include: {
                    client: {
                        select: { id: true, email: true },
                    },
                    provider: {
                        include: {
                            profile: {
                                select: { firstName: true, lastName: true, avatarUrl: true },
                            },
                        },
                    },
                    service: {
                        select: { name: true, type: true },
                    },
                },
                orderBy: { sessionDate: 'asc' },
                take: 10,
            });
            return sessions;
        }
        catch (error) {
            this.logger.error(`getUpcomingSessions failed: ${error.message}`);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des sessions');
        }
    }
    generateRoomName(booking) {
        const serviceName = booking.service?.name || 'Session';
        const date = booking.sessionDate
            ? new Date(booking.sessionDate).toLocaleDateString('fr-FR')
            : '';
        return `${serviceName} - ${date}`.slice(0, 50);
    }
    async getExistingRoom(booking) {
        const { hostToken, participantToken } = await this.generateTokens(booking.videoRoomId, this.generateRoomName(booking), booking.provider.profile?.firstName || 'Host', booking.client.email, 60);
        return {
            roomId: booking.videoRoomId,
            roomName: this.generateRoomName(booking),
            hostToken,
            participantToken,
            meetingUrl: booking.meetingUrl,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        };
    }
    async generateTokens(roomId, roomName, hostName, participantEmail, durationMinutes) {
        const expiry = Math.floor(Date.now() / 1000) + durationMinutes * 60;
        const hostToken = this.mockGenerateJWT({
            room: roomId,
            identity: hostName,
            isHost: true,
            exp: expiry,
        });
        const participantToken = this.mockGenerateJWT({
            room: roomId,
            identity: participantEmail,
            isHost: false,
            exp: expiry,
        });
        return { hostToken, participantToken };
    }
    async generateSingleToken(roomId, userName, isHost, durationMinutes) {
        const expiry = Math.floor(Date.now() / 1000) + durationMinutes * 60;
        return this.mockGenerateJWT({
            room: roomId,
            identity: userName,
            isHost,
            exp: expiry,
        });
    }
    mockGenerateJWT(payload) {
        const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
        const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const signature = Buffer.from('mock_signature_for_development').toString('base64url');
        return `${header}.${body}.${signature}`;
    }
};
exports.VideoBookingService = VideoBookingService;
exports.VideoBookingService = VideoBookingService = VideoBookingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], VideoBookingService);
//# sourceMappingURL=video-booking.service.js.map