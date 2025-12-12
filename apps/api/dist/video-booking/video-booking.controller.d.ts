import { VideoBookingService } from './video-booking.service';
import { CreateVideoSessionDto, VideoRoomDto, VideoTokenDto } from './dto';
import { CurrentUserPayload } from '../common/decorators';
export declare class VideoBookingController {
    private readonly videoService;
    constructor(videoService: VideoBookingService);
    createSession(dto: CreateVideoSessionDto): Promise<VideoRoomDto>;
    joinSession(roomId: string, user: CurrentUserPayload): Promise<VideoTokenDto>;
    endSession(roomId: string, body: {
        recordingUrl?: string;
    }): Promise<{
        success: boolean;
    }>;
    getUpcoming(user: CurrentUserPayload): Promise<({
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
}
