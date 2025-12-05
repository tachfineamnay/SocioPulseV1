import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateVideoSessionDto, VideoRoomDto, VideoTokenDto } from './dto';

/**
 * Mock LiveKit API Response
 * In production, replace with actual LiveKit SDK
 */
interface LiveKitMockResponse {
    roomId: string;
    token: string;
    url: string;
}

@Injectable()
export class VideoBookingService {
    private readonly logger = new Logger(VideoBookingService.name);
    private readonly LIVEKIT_URL: string;

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) {
        this.LIVEKIT_URL = this.configService.get<string>('LIVEKIT_URL') || 'https://meet.lesextras.fr';
    }

    /**
     * Generate a video slot/room for a booking
     * Uses LiveKit API (mocked for now)
     */
    async generateVideoSlot(dto: CreateVideoSessionDto): Promise<VideoRoomDto> {
        const { bookingId, durationMinutes = 60 } = dto;

        try {
            // 1. Get the booking
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
                throw new NotFoundException(`Booking ${bookingId} non trouvé`);
            }

            if (!booking.isVideoSession) {
                throw new BadRequestException('Ce booking n\'est pas une session vidéo');
            }

            if (booking.videoRoomId) {
                // Room already exists, return existing tokens
                return this.getExistingRoom(booking);
            }

            // 2. Generate room ID and tokens (Mock LiveKit)
            const roomId = `room_${uuidv4()}`;
            const roomName = this.generateRoomName(booking);

            const { hostToken, participantToken } = await this.generateTokens(
                roomId,
                roomName,
                booking.provider.profile?.firstName || 'Host',
                booking.client.email,
                durationMinutes,
            );

            const meetingUrl = `${this.LIVEKIT_URL}/room/${roomId}`;
            const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

            // 3. Update booking with room info
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
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`generateVideoSlot failed: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Erreur lors de la création de la room vidéo');
        }
    }

    /**
     * Join an existing video session
     */
    async joinVideoSession(
        roomId: string,
        userId: string,
        userName: string,
    ): Promise<VideoTokenDto> {
        try {
            // Find booking with this room
            const booking = await this.prisma.booking.findFirst({
                where: { videoRoomId: roomId },
                include: {
                    client: true,
                    provider: true,
                },
            });

            if (!booking) {
                throw new NotFoundException(`Room ${roomId} non trouvée`);
            }

            // Verify user is part of this booking
            const isHost = booking.providerId === userId;
            const isParticipant = booking.clientId === userId;

            if (!isHost && !isParticipant) {
                throw new BadRequestException('Vous n\'êtes pas autorisé à rejoindre cette session');
            }

            // Generate appropriate token
            const token = await this.generateSingleToken(
                roomId,
                userName,
                isHost,
                60, // Default 60 minutes
            );

            return {
                token,
                roomName: `session-${booking.id.slice(0, 8)}`,
                meetingUrl: booking.meetingUrl || `${this.LIVEKIT_URL}/room/${roomId}`,
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`joinVideoSession failed: ${error.message}`);
            throw new InternalServerErrorException('Erreur lors de la connexion à la session');
        }
    }

    /**
     * End a video session and save recording URL if available
     */
    async endVideoSession(roomId: string, recordingUrl?: string): Promise<void> {
        try {
            const booking = await this.prisma.booking.findFirst({
                where: { videoRoomId: roomId },
            });

            if (!booking) {
                throw new NotFoundException(`Room ${roomId} non trouvée`);
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
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`endVideoSession failed: ${error.message}`);
            throw new InternalServerErrorException('Erreur lors de la fin de session');
        }
    }

    /**
     * Get upcoming video sessions for a user
     */
    async getUpcomingSessions(userId: string) {
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
        } catch (error) {
            this.logger.error(`getUpcomingSessions failed: ${error.message}`);
            throw new InternalServerErrorException('Erreur lors de la récupération des sessions');
        }
    }

    // ==================== Private Helper Methods ====================

    private generateRoomName(booking: any): string {
        const serviceName = booking.service?.name || 'Session';
        const date = booking.sessionDate
            ? new Date(booking.sessionDate).toLocaleDateString('fr-FR')
            : '';
        return `${serviceName} - ${date}`.slice(0, 50);
    }

    private async getExistingRoom(booking: any): Promise<VideoRoomDto> {
        const { hostToken, participantToken } = await this.generateTokens(
            booking.videoRoomId,
            this.generateRoomName(booking),
            booking.provider.profile?.firstName || 'Host',
            booking.client.email,
            60,
        );

        return {
            roomId: booking.videoRoomId,
            roomName: this.generateRoomName(booking),
            hostToken,
            participantToken,
            meetingUrl: booking.meetingUrl,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        };
    }

    /**
     * Generate LiveKit tokens (MOCK)
     * 
     * In production, use @livekit/server-sdk:
     * ```
     * import { AccessToken } from 'livekit-server-sdk';
     * const token = new AccessToken(apiKey, apiSecret, { identity });
     * token.addGrant({ room, roomJoin: true, canPublish: true });
     * return token.toJwt();
     * ```
     */
    private async generateTokens(
        roomId: string,
        roomName: string,
        hostName: string,
        participantEmail: string,
        durationMinutes: number,
    ): Promise<{ hostToken: string; participantToken: string }> {
        // MOCK: In production, use LiveKit SDK
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

    private async generateSingleToken(
        roomId: string,
        userName: string,
        isHost: boolean,
        durationMinutes: number,
    ): Promise<string> {
        const expiry = Math.floor(Date.now() / 1000) + durationMinutes * 60;

        return this.mockGenerateJWT({
            room: roomId,
            identity: userName,
            isHost,
            exp: expiry,
        });
    }

    /**
     * Mock JWT generator for development
     * Replace with actual LiveKit token generation in production
     */
    private mockGenerateJWT(payload: {
        room: string;
        identity: string;
        isHost: boolean;
        exp: number;
    }): string {
        // Base64 encode the payload as a mock token
        const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
        const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const signature = Buffer.from('mock_signature_for_development').toString('base64url');

        return `${header}.${body}.${signature}`;
    }
}
