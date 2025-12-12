import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateVideoSessionDto, VideoRoomDto, VideoTokenDto } from './dto';
export declare class VideoBookingService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    private readonly LIVEKIT_URL;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateVideoSlot(dto: CreateVideoSessionDto): Promise<VideoRoomDto>;
    joinVideoSession(roomId: string, userId: string, userName: string): Promise<VideoTokenDto>;
    endVideoSession(roomId: string, recordingUrl?: string): Promise<void>;
    getUpcomingSessions(userId: string): Promise<({
        service: {
            name: string;
            type: import(".prisma/client").$Enums.ServiceType;
        };
        client: {
            email: string;
            id: string;
        };
        provider: {
            profile: {
                firstName: string;
                lastName: string;
                avatarUrl: string;
            };
        } & {
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            phone: string | null;
            id: string;
            passwordHash: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
            walletBalance: number;
            stripeCustomerId: string | null;
            stripeAccountId: string | null;
            stripeOnboarded: boolean;
            emailVerified: Date | null;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        completedAt: Date | null;
        meetingUrl: string | null;
        providerId: string;
        serviceId: string | null;
        reliefMissionId: string | null;
        selectedOption: string | null;
        ageGroup: string | null;
        objectives: string | null;
        participantCount: number | null;
        sessionDate: Date | null;
        sessionTime: string | null;
        isVideoSession: boolean;
        videoRoomId: string | null;
        videoRoomToken: string | null;
        recordingUrl: string | null;
        totalPrice: number;
        platformFee: number | null;
        providerPayout: number | null;
        stripePaymentIntentId: string | null;
        stripeTransferId: string | null;
        paidAt: Date | null;
        clientNotes: string | null;
        providerNotes: string | null;
        cancellationReason: string | null;
        confirmedAt: Date | null;
        cancelledAt: Date | null;
    })[]>;
    private generateRoomName;
    private getExistingRoom;
    private generateTokens;
    private generateSingleToken;
    private mockGenerateJWT;
}
